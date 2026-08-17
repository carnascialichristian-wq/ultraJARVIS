/**
 * ultraJARVIS — the active-task counter, and why the naive one is wrong.
 *
 * Task: UJ-RCV-001 (CLAUDE). Closes R-RUN-01, the last outstanding P0.
 * Rationale: docs/runbooks/DISASTER_RECOVERY.md, blueprint §6.3
 *
 * DG-3 caps active atomic tasks at 25, and that cap binds long before the depth
 * limit does (the theoretical tree is 156 nodes). So this counter is the limit
 * that actually holds the system, and it is the part of DepthGuard that breaks
 * first in a naive implementation.
 *
 * The failure is not exotic. In Node, any `await` between reading the counter and
 * writing it is a race window: the event loop can interleave another reservation
 * that read the same stale value. Both see 24, both admit, the run ends with 26
 * active tasks and DG-3 is silently violated.
 */

export interface ReservationResult {
  readonly granted: boolean;
  readonly activeAfter: number;
}

export interface ActiveTaskCounter {
  reserve(): Promise<ReservationResult>;
  release(): Promise<void>;
  current(): number;
}

/**
 * WRONG ON PURPOSE — kept as an executable counter-example, not as an option.
 *
 * Reads, awaits, then writes. Under concurrent fan-out it admits more than the
 * ceiling. Test T-DG-4b uses this to prove the race is real before proving the
 * fix works; a fix demonstrated against no failure demonstrates nothing.
 *
 * Never wire this into the runtime.
 */
export class NaiveActiveTaskCounter implements ActiveTaskCounter {
  private active = 0;

  constructor(
    private readonly limit: number,
    /** Simulates any I/O between the read and the write: a DB round trip, a log flush. */
    private readonly yieldBetweenReadAndWrite: () => Promise<void>,
  ) {}

  async reserve(): Promise<ReservationResult> {
    const observed = this.active; // read
    if (observed >= this.limit) {
      return { granted: false, activeAfter: observed };
    }
    await this.yieldBetweenReadAndWrite(); // ← the race window
    this.active = observed + 1; // write, based on a possibly stale read
    return { granted: true, activeAfter: this.active };
  }

  async release(): Promise<void> {
    this.active = Math.max(0, this.active - 1);
  }

  current(): number {
    return this.active;
  }
}

/**
 * CORRECT — the check and the increment happen with no suspension point between
 * them, so no interleaving is possible. Any I/O is done before or after, never
 * inside the critical section.
 *
 * This is the in-process form. When the counter lives in a database, the same
 * property must come from a conditional update (see CasActiveTaskCounter).
 */
export class AtomicActiveTaskCounter implements ActiveTaskCounter {
  private active = 0;

  constructor(private readonly limit: number) {}

  /** Synchronous by design: adding an `await` here reintroduces the bug. */
  private reserveSync(): ReservationResult {
    if (this.active >= this.limit) {
      return { granted: false, activeAfter: this.active };
    }
    this.active += 1;
    return { granted: true, activeAfter: this.active };
  }

  async reserve(): Promise<ReservationResult> {
    return this.reserveSync();
  }

  async release(): Promise<void> {
    this.active = Math.max(0, this.active - 1);
  }

  current(): number {
    return this.active;
  }
}

/** Backing store exposing a conditional update, e.g. `UPDATE ... WHERE value = ?`. */
export interface CompareAndSwapStore {
  read(): Promise<number>;
  /** Returns false when the stored value no longer matches `expected`. */
  compareAndSwap(expected: number, next: number): Promise<boolean>;
}

/**
 * CORRECT for a distributed counter — compare-and-swap with bounded retry.
 *
 * The read may be stale, but the write only lands if the value has not changed
 * since. A losing racer retries against the fresh value rather than overwriting.
 *
 * `maxAttempts` is bounded: an unbounded CAS loop under contention is a livelock,
 * which trades a correctness bug for an availability bug.
 */
export class CasActiveTaskCounter implements ActiveTaskCounter {
  private lastKnown = 0;

  constructor(
    private readonly limit: number,
    private readonly store: CompareAndSwapStore,
    private readonly maxAttempts = 8,
  ) {}

  async reserve(): Promise<ReservationResult> {
    for (let attempt = 0; attempt < this.maxAttempts; attempt += 1) {
      const observed = await this.store.read();
      this.lastKnown = observed;
      if (observed >= this.limit) {
        return { granted: false, activeAfter: observed };
      }
      const swapped = await this.store.compareAndSwap(observed, observed + 1);
      if (swapped) {
        this.lastKnown = observed + 1;
        return { granted: true, activeAfter: observed + 1 };
      }
      // Lost the race: another reservation moved the value. Retry on the fresh one.
    }
    // Contention did not settle. Refusing is correct: admitting on an unverified
    // count would be exactly the violation this class exists to prevent.
    return { granted: false, activeAfter: this.lastKnown };
  }

  async release(): Promise<void> {
    for (let attempt = 0; attempt < this.maxAttempts; attempt += 1) {
      const observed = await this.store.read();
      const next = Math.max(0, observed - 1);
      if (await this.store.compareAndSwap(observed, next)) {
        this.lastKnown = next;
        return;
      }
    }
  }

  current(): number {
    return this.lastKnown;
  }
}
