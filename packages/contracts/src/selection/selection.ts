/**
 * selection.ts — legare un TaskNode a un agente (sottosistema SEL, blueprint §17).
 *
 * NUOVA superficie, NON parte dei 15 artefatti congelati di UJ-RUN-001 (stesso scoping di
 * routing/adapter-routing.ts e decomposition/decomposition.ts): anticipo di M2/M3, fedele al
 * blueprint §17, non inventato. Non viene esportata da runtime/index.ts di proposito — quel
 * file è uno dei 15 hashati e in review presso GEMINI.
 *
 * §17.1 — regola dura: l'input della selezione NON contiene stringhe di vendor. La funzione
 * legge solo capability (insiemi), ceiling (rank ordinati), identità di owner/reviewer
 * (uguaglianza) e scadenza (confronto di timestamp). L'agentId è un handle OPACO per
 * costruzione: il tie-break lessicografico su di esso non introduce dipendenza dal vendor,
 * perché i nomi di fornitore vivono nei capability tag, non nell'handle. Questa è la proprietà
 * che AC-01 di UJ-RUN-001 chiede ed è quella verificata dal test T-SEL-2.
 *
 * §17.2 — `now` è un parametro iniettato, MAI letto dall'orologio: una selezione che legge
 * l'orologio non è riproducibile e il ledger non sarebbe replayabile.
 *
 * §17.3 — tre esiti e nessun quarto: ASSIGNED, HUMAN_BRIDGE, REFUSED. Non esiste "assegnato
 * con riserva".
 *
 * Maturità del contratto: PROPOSAL. Come il resto dei contratti runtime, ha bisogno di
 * versione, validazione a runtime e test di compatibilità prima di lasciare PROPOSAL (§9.3).
 */

import type { AiId, CapabilityTag, TaskId, TaskNode } from "../decomposition/decomposition.js";
import type { AutonomyLevel, DataClass, SideEffectLevel } from "../runtime/common.js";
import { rankAsChild } from "../runtime/common.js";
import {
  AUTONOMY_ORDER,
  DATA_CLASS_ORDER,
  SIDE_EFFECT_ORDER,
  autonomyWithin,
  dataClassWithin,
  sideEffectWithin,
} from "../runtime/common.js";

/** Handle opaco di un agente. Plain string a runtime, come AiId (i contratti runtime brandano). */
export type AgentId = AiId;

/**
 * La parte dichiarativa di un candidato (un AgentManifest §3 ridotto ai campi che §17 legge).
 * `declaredCapabilities` è ciò che §17.6 controllo 1 confronta con `requiredCapabilities`.
 * `expiresAt` è la deadline assoluta del manifest (§3): assoluta e mai relativa, così non
 * deriva fra un resume e l'altro. `null` = non scade.
 */
export interface AgentCandidate {
  readonly agentId: AgentId;
  readonly declaredCapabilities: readonly CapabilityTag[];
  readonly maxDataClass: DataClass;
  readonly maxAutonomy: AutonomyLevel;
  readonly maxSideEffect: SideEffectLevel;
  readonly expiresAt: string | null;
}

/**
 * L'allowlist effettiva del padre (§9). Il blueprint la nomina `EffectiveGrants` (§17.2) ma
 * non la definisce come tipo concreto: qui è resa fedele a §9 — l'insieme di capability
 * effettive del padre più i tre ceiling ordinati contro cui si applicano TA-2/TA-4/TA-5/TA-8.
 */
export interface EffectiveGrants {
  readonly capabilities: readonly CapabilityTag[];
  readonly maxDataClass: DataClass;
  readonly maxAutonomy: AutonomyLevel;
  readonly maxSideEffect: SideEffectLevel;
}

/**
 * L'envelope che la selezione produce quando nessun agente copre il task (§17.3 / §18.4).
 * Riferimenti soltanto, nessun segreto (HB-3): contiene ciò che la persona deve sapere per
 * assegnare il task a mano, non dati sensibili. Gli altri campi di §18.4 (idempotencyKey,
 * resumeToken, expiresAt) vengono arricchiti a valle dal livello di routing, che non è questo.
 */
export interface SelectionBridgeEnvelope {
  readonly taskId: TaskId;
  readonly instruction: string;
  readonly missingCapabilities: readonly CapabilityTag[];
}

export type SelRule = "SEL-E01" | "SEL-E02" | "SEL-E03" | "SEL-E04" | "SEL-E05";

/** Un'infrazione nominata: il reviewer deve vedere QUALE invariante ha protetto il sistema. */
export interface SelViolation {
  readonly rule: SelRule;
  readonly detail: string;
}

/** Tre esiti e nessun quarto (§17.3). */
export type Assignment =
  | { readonly kind: "ASSIGNED"; readonly agentId: AgentId; readonly grants: EffectiveGrants }
  | { readonly kind: "HUMAN_BRIDGE"; readonly reason: string; readonly envelope: SelectionBridgeEnvelope }
  | { readonly kind: "REFUSED"; readonly violations: readonly [SelViolation, ...SelViolation[]] };

export interface SelectionInput {
  readonly task: TaskNode;
  readonly candidates: readonly AgentCandidate[];
  readonly parentGrants: EffectiveGrants;
  /** IsoTimestamp iniettato (§17.2), mai letto dall'orologio: la selezione è riproducibile. */
  readonly now: string;
}

// --- helper di ranking e ceiling --------------------------------------------

// S-28: un valore fuori dominio dava -1, cioe' il rango piu' basso, quindi veniva
// scelto come "il ceiling piu' stretto" e propagato nel grant risultante. Con
// rankAsChild l'ignoto vale +Infinity e non vince mai contro un limite reale.
function rank<T extends readonly string[]>(order: T, value: T[number]): number {
  return rankAsChild(order, value);
}

/** Il ceiling più stretto fra due, sulla stessa scala ordinata (per il grant risultante). */
function minCeil<T extends readonly string[]>(order: T, a: T[number], b: T[number]): T[number] {
  return rank(order, a) <= rank(order, b) ? a : b;
}

/**
 * §17.6 controllo 4 — ordine totale che preferisce l'agente MENO privilegiato, non il più
 * capace: (a) maxAutonomy più basso, (b) maxDataClass più bassa, (c) maxSideEffect più basso,
 * (d) agentId lessicografico. È un ordine totale, quindi il tie-break è deterministico e MAI
 * a caso (SEL-E05).
 */
function compareByPrivilege(a: AgentCandidate, b: AgentCandidate): number {
  const dAut = rank(AUTONOMY_ORDER, a.maxAutonomy) - rank(AUTONOMY_ORDER, b.maxAutonomy);
  if (dAut !== 0) return dAut;
  const dData = rank(DATA_CLASS_ORDER, a.maxDataClass) - rank(DATA_CLASS_ORDER, b.maxDataClass);
  if (dData !== 0) return dData;
  const dSide = rank(SIDE_EFFECT_ORDER, a.maxSideEffect) - rank(SIDE_EFFECT_ORDER, b.maxSideEffect);
  if (dSide !== 0) return dSide;
  return a.agentId < b.agentId ? -1 : a.agentId > b.agentId ? 1 : 0;
}

/** Il candidato meno privilegiato di una lista non vuota. Il throw è irraggiungibile: ogni
 * chiamante garantisce la non-vuotezza, ed è un guard di precondizione sotto
 * noUncheckedIndexedAccess, non un ramo logico. */
function leastPrivileged(list: readonly AgentCandidate[]): AgentCandidate {
  const first = [...list].sort(compareByPrivilege)[0];
  if (first === undefined) throw new Error("leastPrivileged: empty candidate list");
  return first;
}

/**
 * Le infrazioni di ceiling e scadenza di UN candidato contro `parentGrants` e `now`.
 * SEL-E03 (indipendenza del reviewer) è a livello di task ed è trattata in `selectAgent`.
 * Restituisce TUTTE le infrazioni del candidato, non la prima (§17.6 controllo 2).
 */
function violationsOf(
  candidate: AgentCandidate,
  task: TaskNode,
  parentGrants: EffectiveGrants,
  now: string,
): SelViolation[] {
  const v: SelViolation[] = [];

  // TA-2 — sottoinsieme: effective(child) ⊆ effective(parent). Le capability che il figlio
  // eserciterebbe sono quelle richieste dal task; se il padre non le possiede, è TA-2. È il
  // caso "un nodo che chiede un tool non posseduto dal padre" del blueprint (riga esempio §17).
  const parentCaps = new Set(parentGrants.capabilities);
  const notHeld = task.requiredCapabilities.filter((cap) => !parentCaps.has(cap));
  if (notHeld.length > 0) {
    v.push({
      rule: "SEL-E02",
      detail: `candidate '${candidate.agentId}': TA-2 — required capabilities [${notHeld.join(", ")}] are not held by the parent grants`,
    });
  }

  // TA-4 — ceiling dei dati: maxDataClass(child) ≤ maxDataClass(parent).
  if (!dataClassWithin(candidate.maxDataClass, parentGrants.maxDataClass)) {
    v.push({
      rule: "SEL-E02",
      detail: `candidate '${candidate.agentId}': TA-4 — maxDataClass ${candidate.maxDataClass} exceeds parent ${parentGrants.maxDataClass}`,
    });
  }

  // TA-5 — ceiling di autonomia: maxAutonomy(child) ≤ maxAutonomy(parent).
  if (!autonomyWithin(candidate.maxAutonomy, parentGrants.maxAutonomy)) {
    v.push({
      rule: "SEL-E02",
      detail: `candidate '${candidate.agentId}': TA-5 — maxAutonomy ${candidate.maxAutonomy} exceeds parent ${parentGrants.maxAutonomy}`,
    });
  }

  // TA-8 — ceiling di side effect: maxSideEffect(child) ≤ maxSideEffect(parent).
  if (!sideEffectWithin(candidate.maxSideEffect, parentGrants.maxSideEffect)) {
    v.push({
      rule: "SEL-E02",
      detail: `candidate '${candidate.agentId}': TA-8 — maxSideEffect ${candidate.maxSideEffect} exceeds parent ${parentGrants.maxSideEffect}`,
    });
  }

  // SEL-E04 — manifest scaduto rispetto a `now`. Confronto lessicografico su ISO-8601 UTC, che
  // è ordinato come il tempo. `null` = non scade.
  if (candidate.expiresAt !== null && candidate.expiresAt <= now) {
    v.push({
      rule: "SEL-E04",
      detail: `candidate '${candidate.agentId}': manifest expired at ${candidate.expiresAt} (now ${now})`,
    });
  }

  return v;
}

/**
 * Lega un `TaskNode` a un agente, o produce HUMAN_BRIDGE / REFUSED (§17).
 *
 * Ordine dei controlli, e perché:
 *  1. Indipendenza del reviewer (§17.6.5, SEL-E03), RI-verificata qui perché i manifest
 *     possono cambiare fra FROZEN e assegnazione. Il blueprint la formula sul candidato
 *     ("owner AND reviewer"), ma owner !== reviewer è un invariante del task (DEC-E03): il
 *     re-check che ha senso a selezione è sul task. È REFUSED e non HUMAN_BRIDGE — un
 *     self-review non si corregge incollando, va corretta la decomposizione.
 *  2. Copertura (§17.6.1): se nessun candidato copre le capability richieste → SEL-E01 →
 *     HUMAN_BRIDGE (non REFUSED): l'assenza di un agente capace è normale a costo zero, e la
 *     risposta è chiedere a una persona.
 *  3. Ceiling / scadenza per candidato (SEL-E02/E04). Gli idonei sono quelli senza infrazioni.
 *  4. Se c'è almeno un idoneo → tie-break (§17.6.4) → ASSIGNED al MENO privilegiato.
 *  5. Se coprono ma nessuno è idoneo → REFUSED, elencando TUTTE le infrazioni del candidato
 *     migliore (il meno privilegiato fra i coprenti), §17.5 SEL-E02 + §17.6.2.
 */
export function selectAgent(input: SelectionInput): Assignment {
  const { task, candidates, parentGrants, now } = input;

  // 1. SEL-E03 — indipendenza del reviewer, ri-verificata a selezione (§17.6.5).
  if (task.owner === task.reviewer) {
    return {
      kind: "REFUSED",
      violations: [
        {
          rule: "SEL-E03",
          detail: `task '${task.taskId}': owner and reviewer are the same agent ('${task.owner}') — reviewer independence re-checked at selection (§17.6.5)`,
        },
      ],
    };
  }

  // 2. SEL-E01 — copertura: requiredCapabilities ⊆ declaredCapabilities(candidate).
  const required = task.requiredCapabilities;
  const covering = candidates.filter((c) => {
    const declared = new Set(c.declaredCapabilities);
    return required.every((cap) => declared.has(cap));
  });
  if (covering.length === 0) {
    const missing = required.filter((cap) => !candidates.some((c) => c.declaredCapabilities.includes(cap)));
    return {
      kind: "HUMAN_BRIDGE",
      reason: `no candidate covers the required capabilities of task '${task.taskId}'`,
      envelope: {
        taskId: task.taskId,
        instruction: `Assign task '${task.taskId}' to a person: no available agent declares [${missing.join(", ")}].`,
        missingCapabilities: missing,
      },
    };
  }

  // 3. idoneità: coprenti senza infrazioni di ceiling/scadenza.
  const eligible = covering.filter((c) => violationsOf(c, task, parentGrants, now).length === 0);

  // 4. almeno un idoneo → ASSIGNED al meno privilegiato; grant = min(candidato, padre).
  if (eligible.length > 0) {
    const chosen = leastPrivileged(eligible);
    const grants: EffectiveGrants = {
      capabilities: [...required],
      maxDataClass: minCeil(DATA_CLASS_ORDER, chosen.maxDataClass, parentGrants.maxDataClass),
      maxAutonomy: minCeil(AUTONOMY_ORDER, chosen.maxAutonomy, parentGrants.maxAutonomy),
      maxSideEffect: minCeil(SIDE_EFFECT_ORDER, chosen.maxSideEffect, parentGrants.maxSideEffect),
    };
    return { kind: "ASSIGNED", agentId: chosen.agentId, grants };
  }

  // 5. coprono ma nessuno idoneo → REFUSED con tutte le infrazioni del candidato migliore.
  const best = leastPrivileged(covering);
  const bestViolations = violationsOf(best, task, parentGrants, now);
  return { kind: "REFUSED", violations: bestViolations as [SelViolation, ...SelViolation[]] };
}
