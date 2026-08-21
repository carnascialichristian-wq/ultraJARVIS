/**
 * adapter-routing.ts — instradamento provider-neutral (sottosistema RTE del §18).
 *
 * NUOVA superficie di contratto, NON parte dei 15 artefatti congelati di UJ-RUN-001.
 * È un anticipo (down-payment) del sottosistema di routing che il blueprint §18 SPECIFICA
 * ma che non era ancora implementato — uno dei cinque sottosistemi che la demo §21
 * esercitava con logica `[demo]`. Faithful a §18.2: i tipi e le regole sono quelli scritti
 * nel blueprint, non inventati qui.
 *
 * Non viene esportato da runtime/index.ts di proposito: quel file è uno dei 15 hashati e in
 * review presso GEMINI. Questo modulo vive accanto, con la propria superficie, finché la
 * consegna di UJ-RUN-001 non è accettata e il sottosistema RTE non entra in un packet suo.
 *
 * Maturità del contratto: PROPOSAL. Come il resto dei contratti runtime, ha bisogno di
 * versione, validazione a runtime e test di compatibilità prima di lasciare PROPOSAL (§9.3).
 */

import type { AutonomyLevel } from "../runtime/common.js";
import { AUTONOMY_ORDER } from "../runtime/common.js";

/**
 * Classe di costo di un adapter di fornitura (blueprint §18.2, verbatim).
 * `METERED` è a consumo, ed è vietato sotto STRICT_ZERO_CARD.
 */
export type CostClass =
  | "ZERO_LOCAL" // esecuzione locale, loopback, nessuna rete uscente
  | "ZERO_SUBSCRIPTION_HUMAN" // abbonamento già pagato, mediato da una persona
  | "METERED"; // a consumo — vietato sotto STRICT_ZERO_CARD

/** Vincolo sull'endpoint che un adapter può raggiungere (blueprint §18.2). */
export type EndpointConstraint = "LOOPBACK_ONLY" | "NONE";

/**
 * La parte dichiarativa di un `ProviderAdapter` (§18.2). Il metodo `send` non è parte del
 * contratto di ammissione: la registrazione si giudica sui soli metadati, prima che una
 * chiamata possa esistere.
 */
export interface AdapterRegistration {
  readonly adapterId: string;
  readonly costClass: CostClass;
  readonly endpointConstraint: EndpointConstraint;
}

/** Contesto del run al momento della registrazione dell'adapter. */
export interface RoutingContext {
  /** Autonomia massima concessa al run (§16). `METERED` è irrappresentabile a L2. */
  readonly runMaxAutonomy: AutonomyLevel;
  /** Se il run è sotto STRICT_ZERO_CARD, `METERED` non è mai registrabile. */
  readonly strictZeroCard: boolean;
}

/** Un'infrazione nominata: il reviewer deve vedere QUALE regola ha protetto il sistema. */
export interface RoutingViolation {
  readonly rule: "RTE-E01" | "RTE-E02" | "RTE-E03";
  readonly detail: string;
}

export type RegistrationDecision =
  | { readonly admitted: true }
  | {
      readonly admitted: false;
      readonly violations: readonly [RoutingViolation, ...RoutingViolation[]];
    };

/** Soglia minima di autonomia per un adapter `METERED`: L3. Sotto, è irrappresentabile. */
const METERED_MIN_AUTONOMY: AutonomyLevel = "L3";

function autonomyRank(level: AutonomyLevel): number {
  return AUTONOMY_ORDER.indexOf(level);
}

/**
 * Risolve la `CostClass` di un adapter da un valore d'ambiente (blueprint §18.2, "il default
 * non è una variabile d'ambiente").
 *
 * Un valore assente o non riconosciuto risolve a `ZERO_LOCAL`, **mai** a `METERED`. Questa
 * regola nasce da un difetto misurato, non da un principio astratto: in `cloud_bridge.py` su
 * `main`, `PROVIDER = os.getenv("MODEL_PROVIDER", "openai")` fissava il default a pagamento
 * all'import (S-17: sei percorsi a pagamento su sette attacchi). Qui il default cade sul
 * percorso a costo zero, per costruzione.
 */
export function resolveCostClass(envValue: string | undefined): CostClass {
  if (envValue === "ZERO_LOCAL" || envValue === "ZERO_SUBSCRIPTION_HUMAN" || envValue === "METERED") {
    return envValue;
  }
  return "ZERO_LOCAL";
}

/**
 * Decide se un adapter può essere REGISTRATO nel contesto del run (blueprint §18.2).
 *
 * Il rifiuto avviene alla registrazione, non alla chiamata: un controllo che scatta al
 * momento della chiamata protegge solo se qualcuno arriva fin lì con la configurazione
 * giusta. Restituisce TUTTE le infrazioni, non la prima: un rapporto che ne nomina una sola
 * nasconde le altre.
 */
export function admitAdapterRegistration(
  adapter: AdapterRegistration,
  context: RoutingContext,
): RegistrationDecision {
  const violations: RoutingViolation[] = [];

  // RTE-E01: METERED è vietato sotto STRICT_ZERO_CARD, senza eccezioni.
  if (adapter.costClass === "METERED" && context.strictZeroCard) {
    violations.push({
      rule: "RTE-E01",
      detail: `adapter '${adapter.adapterId}' is METERED and cannot be registered under STRICT_ZERO_CARD`,
    });
  }

  // RTE-E02: METERED è irrappresentabile sotto L3 (il blueprint lo dice "a L2").
  if (adapter.costClass === "METERED" && autonomyRank(context.runMaxAutonomy) < autonomyRank(METERED_MIN_AUTONOMY)) {
    violations.push({
      rule: "RTE-E02",
      detail: `adapter '${adapter.adapterId}' is METERED but run autonomy ${context.runMaxAutonomy} is below the required ${METERED_MIN_AUTONOMY}`,
    });
  }

  // RTE-E03: un adapter ZERO_LOCAL che non vincola l'endpoint al loopback contraddice la
  // propria classe ("esecuzione locale, loopback, nessuna rete uscente"). È il buco che il
  // fix STRICT_ZERO di S-17 chiude: senza questo, un ZERO_LOCAL potrebbe puntare a un
  // endpoint remoto a pagamento.
  if (adapter.costClass === "ZERO_LOCAL" && adapter.endpointConstraint !== "LOOPBACK_ONLY") {
    violations.push({
      rule: "RTE-E03",
      detail: `adapter '${adapter.adapterId}' is ZERO_LOCAL but its endpointConstraint is '${adapter.endpointConstraint}', not LOOPBACK_ONLY`,
    });
  }

  if (violations.length === 0) {
    return { admitted: true };
  }
  return { admitted: false, violations: violations as [RoutingViolation, ...RoutingViolation[]] };
}
