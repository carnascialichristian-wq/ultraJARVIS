/**
 * decomposition.ts — decomposizione di una missione in un DAG di task (sottosistema DEC, §16).
 *
 * NUOVA superficie, NON parte dei 15 artefatti congelati di UJ-RUN-001 (stesso scoping di
 * routing/adapter-routing.ts): anticipo di M2/M3. Fedele al blueprint §16, non inventato.
 *
 * §16.1: la parte STRUTTURALE è una funzione pura. Dato lo stesso input, produce lo stesso
 * verdetto byte per byte, senza chiamare alcun modello. Un modello può PROPORRE una
 * decomposizione, ma la proposta passa per questi stessi controlli.
 *
 * Tutti gli errori sono RIFIUTI IN BLOCCO (§16.5): non esiste decomposizione parzialmente
 * accettata. Una a metà è peggio di nessuna, perché lascia task orfani. Perciò
 * validateDecomposition restituisce TUTTE le infrazioni e non si ferma alla prima.
 */

/** ID di un task. Plain string a runtime (i contratti runtime usano Brand<string>). */
export type TaskId = string;
export type AiId = string;
export type CapabilityTag = string;

/** Un criterio di accettazione. `verification` nomina come si falsifica (§16.6 punto 4). */
export interface Criterion {
  readonly id: string;
  readonly text: string;
}

/** Un nodo del DAG di decomposizione (blueprint §16.3, verbatim sui campi). */
export interface TaskNode {
  readonly taskId: TaskId;
  readonly parentId: TaskId | null;
  readonly depth: number;
  readonly weight: number; // intero > 0
  readonly owner: AiId;
  readonly reviewer: AiId; // invariante: reviewer !== owner
  readonly requiredCapabilities: readonly CapabilityTag[];
  readonly acceptanceCriteria: readonly Criterion[]; // >= 1, ognuno falsificabile
  readonly dependsOn: readonly TaskId[];
}

export interface Decomposition {
  readonly missionId: string;
  readonly nodes: readonly TaskNode[];
}

/** Tetti non modificabili dagli agenti (DG-1..DG-3). */
export interface DecompositionCeilings {
  readonly maxDepth: number;
  readonly maxFanOut: number;
}

export interface DecompositionContext {
  /** Registro chiuso di capability: nessun tag inventato in decomposizione (§16.2). */
  readonly capabilityIndex: readonly CapabilityTag[];
  readonly ceilings: DecompositionCeilings;
}

export type DecRule =
  | "DEC-E01" | "DEC-E02" | "DEC-E03" | "DEC-E04" | "DEC-E05" | "DEC-E06" | "DEC-E07";

export interface DecViolation {
  readonly rule: DecRule;
  readonly detail: string;
}

export type DecompositionDecision =
  | { readonly admitted: true }
  | { readonly admitted: false; readonly violations: readonly [DecViolation, ...DecViolation[]] };

// --- DEC-E04: falsificabilità di un criterio (portato da check-acceptance-criteria.mjs) ----

const VERDICT_ONLY: readonly RegExp[] = [
  /\b(?:CHATGPT|CLAUDE|GEMINI|GROK|Christian|CHRISTIAN)\s+issues?\b[^.]*\breview\b/i,
  /\bissues?\s+an?\s+evidence-backed\s+(?:PASS|PASS_WITH_ACTIONS|FAIL)/i,
  /\breviewer\s+(?:approves|accepts|passes)\b/i,
];
const NAMES_SOMETHING: readonly RegExp[] = [
  /`[^`]+`/,
  /\.(?:md|json|ts|mjs|py|yaml)\b/,
  /\b(?:exit\s*(?:code)?\s*0|command|comando)\b/i,
  /\bsha-?256\b/i,
];

/**
 * Un criterio la cui verità dipende SOLO dal verdetto del reviewer non è falsificabile.
 * Restituisce true se il criterio è falsificabile (accettabile), false altrimenti.
 */
export function isCriterionFalsifiable(text: string): boolean {
  const verdictOnly = VERDICT_ONLY.some((r) => r.test(text));
  if (!verdictOnly) return true;
  return NAMES_SOMETHING.some((r) => r.test(text));
}

// --- il controllo -----------------------------------------------------------

/**
 * Valida una decomposizione contro tutti gli invarianti DEC del §16.
 * Rifiuto in blocco: restituisce TUTTE le infrazioni, oppure `{ admitted: true }`.
 */
export function validateDecomposition(
  decomp: Decomposition,
  context: DecompositionContext,
): DecompositionDecision {
  const violations: DecViolation[] = [];
  const nodes = decomp.nodes;
  const byId = new Map<TaskId, TaskNode>();
  for (const n of nodes) byId.set(n.taskId, n);
  const capIndex = new Set(context.capabilityIndex);

  // DEC-E03 / DEC-E04 / DEC-E05 (fan-out) / DEC-E06: per nodo
  const childCount = new Map<TaskId, number>();
  for (const n of nodes) {
    if (n.reviewer === n.owner) {
      violations.push({ rule: "DEC-E03", detail: `node '${n.taskId}': reviewer equals owner ('${n.owner}')` });
    }
    if (n.acceptanceCriteria.length === 0) {
      violations.push({ rule: "DEC-E04", detail: `node '${n.taskId}': no acceptance criteria` });
    } else {
      for (const c of n.acceptanceCriteria) {
        if (!isCriterionFalsifiable(c.text)) {
          violations.push({ rule: "DEC-E04", detail: `node '${n.taskId}' criterion '${c.id}': true iff the reviewer approves — not falsifiable` });
        }
      }
    }
    if (n.depth > context.ceilings.maxDepth) {
      violations.push({ rule: "DEC-E05", detail: `node '${n.taskId}': depth ${n.depth} exceeds maxDepth ${context.ceilings.maxDepth} (DG-1)` });
    }
    for (const cap of n.requiredCapabilities) {
      if (!capIndex.has(cap)) {
        violations.push({ rule: "DEC-E06", detail: `node '${n.taskId}': capability '${cap}' is outside the closed capabilityIndex` });
      }
    }
    if (n.parentId !== null) {
      childCount.set(n.parentId, (childCount.get(n.parentId) ?? 0) + 1);
    }
  }
  // DEC-E05 fan-out
  for (const [pid, count] of childCount) {
    if (count > context.ceilings.maxFanOut) {
      violations.push({ rule: "DEC-E05", detail: `node '${pid}': fan-out ${count} exceeds maxFanOut ${context.ceilings.maxFanOut} (DG-2)` });
    }
  }

  // DEC-E02: conservazione del peso sui non-foglia
  const children = new Map<TaskId, TaskNode[]>();
  for (const n of nodes) {
    if (n.parentId !== null) {
      const arr = children.get(n.parentId) ?? [];
      arr.push(n);
      children.set(n.parentId, arr);
    }
  }
  for (const n of nodes) {
    const kids = children.get(n.taskId);
    if (kids && kids.length > 0) {
      const sum = kids.reduce((a, k) => a + k.weight, 0);
      if (sum !== n.weight) {
        violations.push({ rule: "DEC-E02", detail: `node '${n.taskId}': weight ${n.weight} != sum of children ${sum}` });
      }
    }
  }

  // DEC-E01: aciclicità del DAG di dipendenze (dependsOn) via ordinamento topologico
  const indeg = new Map<TaskId, number>();
  for (const n of nodes) indeg.set(n.taskId, 0);
  for (const n of nodes) {
    for (const dep of n.dependsOn) {
      if (byId.has(dep)) indeg.set(n.taskId, (indeg.get(n.taskId) ?? 0) + 1);
    }
  }
  const ready = nodes.filter((n) => (indeg.get(n.taskId) ?? 0) === 0).map((n) => n.taskId);
  let processed = 0;
  const queue = [...ready];
  const remaining = new Map(indeg);
  const dependents = new Map<TaskId, TaskId[]>();
  for (const n of nodes) for (const dep of n.dependsOn) {
    if (byId.has(dep)) { const a = dependents.get(dep) ?? []; a.push(n.taskId); dependents.set(dep, a); }
  }
  while (queue.length) {
    const id = queue.shift();
    if (id === undefined) break;
    processed += 1;
    for (const d of dependents.get(id) ?? []) {
      remaining.set(d, (remaining.get(d) ?? 0) - 1);
      if ((remaining.get(d) ?? 0) === 0) queue.push(d);
    }
  }
  if (processed !== nodes.length) {
    violations.push({ rule: "DEC-E01", detail: `dependency cycle: ${nodes.length - processed} node(s) never reach in-degree zero` });
  }

  // DEC-E07: ogni task raggiungibile dalla radice (parentId === null) via parentId
  const roots = nodes.filter((n) => n.parentId === null).map((n) => n.taskId);
  const reachable = new Set<TaskId>(roots);
  const kidsByParent = children;
  const stack = [...roots];
  while (stack.length) {
    const id = stack.pop();
    if (id === undefined) break;
    for (const k of kidsByParent.get(id) ?? []) {
      if (!reachable.has(k.taskId)) { reachable.add(k.taskId); stack.push(k.taskId); }
    }
  }
  for (const n of nodes) {
    if (!reachable.has(n.taskId)) {
      violations.push({ rule: "DEC-E07", detail: `node '${n.taskId}' is unreachable from any root` });
    }
  }

  if (violations.length === 0) return { admitted: true };
  return { admitted: false, violations: violations as [DecViolation, ...DecViolation[]] };
}
