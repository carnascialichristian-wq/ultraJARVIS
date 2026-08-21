/**
 * ultraJARVIS — contratto FBK: fallback locale a costo zero.
 * Fedele al blueprint §20 (`docs/architecture/RUNTIME_BLUEPRINT.md`), non inventato.
 *
 * SCOPING (leggere prima di modificare):
 * Questa e' una superficie SEPARATA e NON fa parte dei 15 artefatti congelati di UJ-RUN-001.
 * Non e' esportata da `runtime/index.ts` e i suoi test vivono in `tests/fallback/`, fuori da
 * `tests/contracts/`, cosi' il conteggio 140 dichiarato nella consegna in review resta 140.
 * E' un anticipo di M2/M3, come i contratti RTE, DEC e SEL.
 *
 * PERCHE' IL CONTROLLO E' IN ADMISSION E NON A RUNTIME (§20.1):
 * scoprire che una capability non ha fallback quando il percorso primario e' gia' fallito
 * significa scoprirlo nel momento peggiore. Un task senza fallback non deve nascere.
 *
 * LA REGOLA CHE INGANNA — §20.5 punto 2:
 * il controllo sui costi e' sulla CHIUSURA TRANSITIVA, non sul primo salto. Un fallback che a
 * sua volta ricade su un adapter a pagamento e' la porta che conta, ed e' esattamente la forma
 * del finding S-17 sul codice Python: tre gate diversi che condividevano lo stesso ponte verso
 * un provider a consumo. Controllare solo il primo salto avrebbe dichiarato sicuro quel ponte.
 */

import type { CapabilityTag, TaskId, TaskNode } from "../decomposition/decomposition.js";
import type { CostClass } from "../routing/adapter-routing.js";

/**
 * I tre — e soli tre — modi in cui una capability puo' degradare (§20.2, verbatim).
 *
 * NON ESISTE UN QUARTO VALORE, e in particolare non esiste un fallback verso un adapter
 * `METERED`: il tipo lo rende irrappresentabile. E' lo stesso metodo con cui
 * `L5 — Broad Autonomy` e' tenuto fuori dal sistema dei tipi in `agent-manifest.ts`.
 */
export type FallbackKind =
  | "ZERO_LOCAL" // ricade su esecuzione locale a costo zero
  | "HUMAN_BRIDGE" // ricade su una persona che media il passaggio
  | "FAIL_CLOSED"; // si ferma — ammesso solo se il task non e' essenziale

/** Il percorso primario di una capability: un adapter e la sua classe di costo. */
export interface PrimaryBinding {
  readonly adapterId: string;
  readonly costClass: CostClass;
}

/**
 * La destinazione di degrado di una capability.
 *
 * `viaTag` esiste per rendere la catena ISPEZIONABILE: un fallback `ZERO_LOCAL` che in realta'
 * delega a un'altra capability deve dirlo, altrimenti la chiusura transitiva del §20.5 non e'
 * calcolabile e il controllo si riduce al primo salto — cioe' al controllo che S-17 dimostra
 * insufficiente.
 */
export interface FallbackBinding {
  readonly kind: FallbackKind;
  readonly detail: string;
  /** Se il fallback delega a un'altra capability, il suo tag. Altrimenti assente. */
  readonly viaTag?: CapabilityTag;
}

/** Il binding completo di una capability (§20.2). */
export interface CapabilityBinding {
  readonly tag: CapabilityTag;
  readonly primary: PrimaryBinding;
  readonly fallback: FallbackBinding;
}

/** Un'infrazione nominata: il reviewer deve vedere QUALE regola ha protetto il sistema. */
export interface FallbackViolation {
  readonly rule: "FBK-E01" | "FBK-E02" | "FBK-E03" | "FBK-E04";
  readonly detail: string;
  /** Il tag che ha causato l'infrazione, quando ne esiste uno. */
  readonly tag?: CapabilityTag;
}

/**
 * Esito dell'ammissione (§20.3). Due soli valori: `ADMITTED` o `BLOCKED_NO_FALLBACK`.
 * Non esiste un "ammesso con riserva": una riserva su un fallback e' un fallback che non c'e'.
 */
export type FallbackAdmission =
  | { readonly outcome: "ADMITTED"; readonly taskId: TaskId }
  | {
      readonly outcome: "BLOCKED_NO_FALLBACK";
      readonly taskId: TaskId;
      /** TUTTE le infrazioni, non la prima: chi corregge deve vederle insieme. */
      readonly violations: readonly FallbackViolation[];
    };

const FALLBACK_KINDS: readonly string[] = ["ZERO_LOCAL", "HUMAN_BRIDGE", "FAIL_CLOSED"];

/**
 * Insieme dei `costClass` raggiungibili da una capability seguendo primario e fallback
 * TRANSITIVAMENTE (§20.5 punto 2).
 *
 * Cicli: `seen` li tronca invece di girare all'infinito. Un ciclo non e' un errore di per se'
 * — due capability che si rimandano a vicenda hanno comunque una chiusura finita — ma senza la
 * guardia il calcolo non terminerebbe, e un controllo che non termina non e' un controllo.
 */
export function reachableCostClasses(
  tag: CapabilityTag,
  bindings: ReadonlyMap<CapabilityTag, CapabilityBinding>,
  seen: Set<CapabilityTag> = new Set(),
): ReadonlySet<CostClass> {
  const out = new Set<CostClass>();
  if (seen.has(tag)) return out;
  seen.add(tag);

  const binding = bindings.get(tag);
  if (binding === undefined) return out;

  out.add(binding.primary.costClass);

  // Un fallback ZERO_LOCAL contribuisce la propria classe; HUMAN_BRIDGE quella umana;
  // FAIL_CLOSED non aggiunge nulla, perche' fermarsi non costa.
  if (binding.fallback.kind === "ZERO_LOCAL") out.add("ZERO_LOCAL");
  if (binding.fallback.kind === "HUMAN_BRIDGE") out.add("ZERO_SUBSCRIPTION_HUMAN");

  // E QUI STA IL PUNTO: se il fallback delega, la sua chiusura entra nella nostra.
  if (binding.fallback.viaTag !== undefined) {
    for (const c of reachableCostClasses(binding.fallback.viaTag, bindings, seen)) out.add(c);
  }
  return out;
}

/**
 * Ammette o blocca un task in base ai binding delle capability che richiede (§20.3).
 *
 * FAIL-SAFE, NON FAIL-OPEN (§20.5 punto 3): un binding malformato produce `BLOCKED`, mai un
 * default permissivo. E' la lezione di S-29 sul codice Python, dove un guasto del revisore di
 * sicurezza si leggeva come approvazione.
 */
export function admitTaskFallbacks(
  task: TaskNode,
  bindingList: readonly CapabilityBinding[],
  options: { readonly essential: boolean },
): FallbackAdmission {
  const violations: FallbackViolation[] = [];
  const bindings = new Map<CapabilityTag, CapabilityBinding>();
  for (const b of bindingList) bindings.set(b.tag, b);

  for (const tag of task.requiredCapabilities) {
    const binding = bindings.get(tag);

    // FBK-E01 — la capability non ha alcun binding. Il tag va NOMINATO: un blocco che non dice
    // cosa manca costa a chi corregge un giro di ricerca (§20.3).
    if (binding === undefined) {
      violations.push({ rule: "FBK-E01", tag, detail: `no CapabilityBinding for tag "${tag}"` });
      continue;
    }

    // FBK-E02 — kind fuori dai tre valori. In TypeScript il tipo lo impedisce, ma un binding
    // che arriva da JSON non e' passato dal compilatore: e' il confine dove il tipo non protegge.
    if (!FALLBACK_KINDS.includes(binding.fallback.kind)) {
      violations.push({
        rule: "FBK-E02",
        tag,
        detail: `fallback.kind "${String(binding.fallback.kind)}" is not one of ${FALLBACK_KINDS.join("/")}`,
      });
    }

    // FBK-E03 — FAIL_CLOSED su un task essenziale alla missione.
    if (binding.fallback.kind === "FAIL_CLOSED" && options.essential) {
      violations.push({
        rule: "FBK-E03",
        tag,
        detail: `FAIL_CLOSED is not admissible for tag "${tag}" on an essential task`,
      });
    }

    // FBK-E04 — la CHIUSURA raggiunge METERED. Non il primo salto: la chiusura.
    const reachable = reachableCostClasses(tag, bindings);
    if (reachable.has("METERED")) {
      violations.push({
        rule: "FBK-E04",
        tag,
        detail: `transitive cost closure for tag "${tag}" reaches METERED via ${[...reachable].join(",")}`,
      });
    }
  }

  return violations.length === 0
    ? { outcome: "ADMITTED", taskId: task.taskId }
    : { outcome: "BLOCKED_NO_FALLBACK", taskId: task.taskId, violations };
}
