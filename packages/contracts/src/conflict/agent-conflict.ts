/**
 * ultraJARVIS — contratto CNF: conflitti fra agenti.
 * Fedele al blueprint §19 (`docs/architecture/RUNTIME_BLUEPRINT.md`), non inventato.
 *
 * SCOPING (leggere prima di modificare):
 * Superficie SEPARATA, NON parte dei 15 artefatti congelati di UJ-RUN-001. Non e' esportata da
 * `runtime/index.ts`, i test vivono in `tests/conflict/`. Anticipo di M2/M3 come RTE/DEC/SEL/FBK.
 *
 * LE TRE CLASSI DI CONFLITTO (§19.2) e il motivo per cui NESSUNA si chiude a maggioranza:
 *
 *   C-1  scrittura concorrente   -> single-writer per path, deciso in DECOMPOSIZIONE.
 *                                   Non e' una disputa: e' un errore di progetto, e va chiuso
 *                                   a monte invece che arbitrato a runtime.
 *   C-2  doppia rivendicazione   -> compare-and-set sulla versione del nodo. Il secondo perde.
 *   C-3  verdetti incompatibili  -> ESCALATED a una persona. NESSUNA MEDIA.
 *
 * PERCHE' C-3 NON E' UN VOTO. Un voto di maggioranza fra IA fabbrica consenso dove non c'e', ed
 * e' esattamente il falso avanzamento che §31.5 vieta. Due revisori in disaccordo sono
 * un'INFORMAZIONE, non un rumore da sopprimere: la media di un PASS e di un FAIL non e' un
 * mezzo PASS, e' la cancellazione del FAIL.
 *
 * CNF-E04 — CHI E' PARTE NON ARBITRA. E' la stessa regola che il Technical Lead si e' imposto
 * il 2026-08-20 (`UJ-LEAD-DECISION-001` §2): non accettare peso sui propri task. Qui smette di
 * essere una disciplina dichiarata e diventa una condizione che il codice verifica.
 */

import type { AiId, TaskId, TaskNode } from "../decomposition/decomposition.js";

/** Riferimento a un deliverable in un punto preciso della storia. */
export interface ArtifactRef {
  readonly taskId: TaskId;
  readonly commitSha: string;
}

/** Esito che un reviewer puo' emettere su un deliverable. */
export type VerdictOutcome = "PASS" | "PASS_WITH_ACTIONS" | "FAIL";

export interface Verdict {
  readonly ref: ArtifactRef;
  readonly reviewer: AiId;
  readonly outcome: VerdictOutcome;
}

/** Un'infrazione nominata. */
export interface ConflictViolation {
  readonly rule: "CNF-E01" | "CNF-E02" | "CNF-E03" | "CNF-E04";
  readonly detail: string;
}

// --------------------------------------------------------------- C-1 · scrittura concorrente

/**
 * Rifiuta in DECOMPOSIZIONE due task che dichiarano lo stesso path di output (§19.5 punto 1).
 *
 * `outputPaths` e' OPZIONALE su `TaskNode` ed e' un'estensione mia: il blueprint §19.5 parla di
 * *"due `TaskNode` che dichiarano lo stesso path di output"* ma non definisce il campo. Reso
 * opzionale di proposito, cosi' le decomposizioni gia' scritte restano valide; un task senza
 * `outputPaths` semplicemente non partecipa al controllo di unicita'.
 */
export function checkSingleWriter(
  nodes: readonly (TaskNode & { readonly outputPaths?: readonly string[] })[],
): readonly ConflictViolation[] {
  const owner = new Map<string, TaskId>();
  const violations: ConflictViolation[] = [];
  for (const node of nodes) {
    for (const path of node.outputPaths ?? []) {
      const existing = owner.get(path);
      if (existing !== undefined && existing !== node.taskId) {
        violations.push({
          rule: "CNF-E01",
          detail: `path "${path}" is claimed for write by both ${existing} and ${node.taskId}`,
        });
        continue;
      }
      owner.set(path, node.taskId);
    }
  }
  return violations;
}

// ------------------------------------------------------------- C-2 · doppia rivendicazione

export interface NodeClaimState {
  readonly taskId: TaskId;
  readonly version: number;
  readonly assignee: AiId | null;
}

export type ClaimResult =
  | { readonly outcome: "ACCEPTED"; readonly state: NodeClaimState }
  | {
      readonly outcome: "REJECTED_CONFLICT";
      readonly winner: AiId;
      readonly loser: AiId;
      readonly reason: ConflictViolation;
    };

/**
 * Compare-and-set sulla transizione `UNASSIGNED -> ASSIGNED` (§19.2, C-2).
 *
 * SINCRONA DI PROPOSITO, e non e' un dettaglio di stile: fra il confronto della versione e la
 * scrittura non deve esistere un `await`. E' la lezione misurata di `R-RUN-01` in
 * `UJ-RCV-001` — con un `await` in mezzo, dieci spawn concorrenti passavano tutti e il
 * contatore perdeva nove incrementi su dieci.
 *
 * §19.5 punto 2: su database questo presuppone un UPDATE CONDIZIONALE, non `SELECT` + `UPDATE`.
 * E' un VINCOLO SULLA SCELTA DI STORAGE (rischio `R-RCV-01`, owner `UJ-INF-001`), e va
 * dichiarato a chi la fa invece di essere scoperto dopo.
 */
export function claimNode(
  state: NodeClaimState,
  claimant: AiId,
  expectedVersion: number,
): ClaimResult {
  if (state.assignee !== null || state.version !== expectedVersion) {
    return {
      outcome: "REJECTED_CONFLICT",
      winner: state.assignee ?? claimant,
      loser: claimant,
      reason: {
        rule: "CNF-E02",
        detail:
          `CAS failed on ${state.taskId}: expected version ${expectedVersion}, ` +
          `found ${state.version} assigned to ${state.assignee ?? "nobody"}. ` +
          `The loser does NOT retry automatically.`,
      },
    };
  }
  return {
    outcome: "ACCEPTED",
    state: { taskId: state.taskId, version: state.version + 1, assignee: claimant },
  };
}

// ------------------------------------------------------------ C-3 · verdetti incompatibili

export type VerdictResolution =
  | { readonly outcome: "ACCEPTED"; readonly verdict: Verdict }
  | {
      readonly outcome: "ESCALATED";
      /** ENTRAMBI i verdetti sono conservati: la divergenza e' il dato. */
      readonly verdicts: readonly Verdict[];
      readonly reason: ConflictViolation;
    };

const isPositive = (o: VerdictOutcome): boolean => o === "PASS" || o === "PASS_WITH_ACTIONS";

/**
 * Registra un verdetto, o scala a una persona se contraddice uno gia' presente sullo stesso
 * `(taskId, commitSha)` (§19.2, C-3).
 *
 * NON esiste un ramo che media. Non c'e' un `else` che sceglie il piu' recente, il piu'
 * severo o il piu' frequente: la funzione o accetta o scala. Un ramo che sceglie sarebbe
 * gia' una media, e l'assenza di quel ramo E' il contratto.
 *
 * `PASS` e `PASS_WITH_ACTIONS` NON sono in conflitto: sono entrambi positivi e differiscono
 * per le azioni di seguito, non per l'esito. Trattarli come divergenti scalerebbe a una
 * persona un disaccordo che non esiste — e un'escalation che scatta troppo spesso viene
 * ignorata, che e' il modo in cui una difesa smette di difendere.
 */
export function resolveVerdict(
  incoming: Verdict,
  existing: readonly Verdict[],
): VerdictResolution {
  const sameRef = existing.filter(
    (v) => v.ref.taskId === incoming.ref.taskId && v.ref.commitSha === incoming.ref.commitSha,
  );
  const contradicting = sameRef.filter((v) => isPositive(v.outcome) !== isPositive(incoming.outcome));

  if (contradicting.length > 0) {
    return {
      outcome: "ESCALATED",
      verdicts: [...contradicting, incoming],
      reason: {
        rule: "CNF-E03",
        detail:
          `incompatible verdicts on (${incoming.ref.taskId}, ${incoming.ref.commitSha}): ` +
          [...contradicting, incoming]
            .map((v) => `${v.reviewer}=${v.outcome}`)
            .join(" vs ") +
          ". No majority vote, no average: escalated to the owner.",
      },
    };
  }
  return { outcome: "ACCEPTED", verdict: incoming };
}

// ------------------------------------------------------- CNF-E04 · chi e' parte non arbitra

export interface ArbitrationRequest {
  readonly arbiter: AiId;
  readonly ref: ArtifactRef;
  /** Le parti del conflitto: owner del task e reviewer che hanno emesso i verdetti. */
  readonly parties: readonly AiId[];
}

export type ArbitrationDecision =
  | { readonly admitted: true }
  | { readonly admitted: false; readonly violation: ConflictViolation };

/**
 * Un arbitro che sia parte del conflitto e' rifiutato (§19.5 punto 3).
 *
 * Vale anche — e soprattutto — per il Technical Lead. Il mandato del 2026-08-20 gli da' il
 * potere di accettare; non gli da' il potere di arbitrare un conflitto in cui e' parte, perche'
 * quello non e' un potere che si possa esercitare bene, e' un conflitto d'interessi con un
 * altro nome.
 */
export function admitArbiter(request: ArbitrationRequest): ArbitrationDecision {
  if (request.parties.includes(request.arbiter)) {
    return {
      admitted: false,
      violation: {
        rule: "CNF-E04",
        detail:
          `${request.arbiter} is a party to the conflict on ${request.ref.taskId} ` +
          `(parties: ${request.parties.join(", ")}) and cannot arbitrate it.`,
      },
    };
  }
  return { admitted: true };
}
