#!/usr/bin/env bash
# integration-gate.sh — il gate di integrazione del programma ultraJARVIS.
#
# Atto n.5 del mandato di Technical Lead (CLAUDE.md PARTE 3-bis §4): "nessun merge
# senza typecheck, build, suite e validator a exit 0, con gli exit code registrati".
#
# Consolida in un comando solo le verifiche che ho eseguito a mano a ogni commit di
# questa sessione. Ogni exit code e' catturato DAL COMANDO VERO, mai attraverso una
# pipe (trappola 15): il risultato di ognuna e' letto da $? subito dopo il comando,
# con l'output redirezionato su file.
#
# ATTENZIONE — NON esegue `pytest` di Grok, DI PROPOSITO. Finche' FIX-11 non e'
# applicato, la test suite Python sovrascrive grok.md e altri file tracciati (S-18):
# eseguirla in un gate corromperebbe il repository. Quando FIX-11 sara' su main,
# aggiungere qui la sezione Python con --ignore per i moduli non importabili.
#
# Uso:  bash scripts/integration-gate.sh
# Exit: 0 se tutte le verifiche BLOCCANTI passano, 1 altrimenti.

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

LOG_DIR="$(mktemp -d)"
trap 'rm -rf "$LOG_DIR"' EXIT

declare -a NAMES CODES BLOCKING
fail=0

run() {
  # run <blocking:0|1> <nome> <comando...>
  local blk="$1"; local name="$2"; shift 2
  "$@" > "$LOG_DIR/out" 2>&1
  local rc=$?                       # <-- $? del comando vero, non di una pipe
  NAMES+=("$name"); CODES+=("$rc"); BLOCKING+=("$blk")
  if [ "$rc" -ne 0 ]; then
    if [ "$blk" -eq 1 ]; then
      fail=1
      printf '  [FAIL] %-38s exit=%s  (BLOCCANTE)\n' "$name" "$rc"
    else
      printf '  [warn] %-38s exit=%s  (informativo)\n' "$name" "$rc"
    fi
    tail -3 "$LOG_DIR/out" | sed 's/^/         /'
  else
    printf '  [ ok ] %-38s exit=0\n' "$name"
  fi
}

echo "== ultraJARVIS integration gate =="
echo "ref: $(git rev-parse --short HEAD)  branch: $(git rev-parse --abbrev-ref HEAD)"
echo

echo "-- A) TypeScript dei contratti --"
run 1 "typecheck (tsc --noEmit)"       npx tsc -p packages/contracts --noEmit
run 1 "build (tsc)"                    npx tsc -p packages/contracts

echo "-- B) suite dei contratti (dalla root) --"
# conta pass/fail aggregati sui 5 file; blocca se un file esce != 0
tot=0; sfail=0; suite_rc=0
for f in tests/contracts/*.test.mjs; do
  node --test "$f" > "$LOG_DIR/t" 2>&1 || suite_rc=1
  p=$(grep -E '^# pass ' "$LOG_DIR/t" | awk '{print $3}'); p=${p:-0}
  fl=$(grep -E '^# fail ' "$LOG_DIR/t" | awk '{print $3}'); fl=${fl:-0}
  tot=$((tot + p)); sfail=$((sfail + fl))
done
NAMES+=("contract suite ($tot pass, $sfail fail)"); CODES+=("$suite_rc"); BLOCKING+=("1")
if [ "$suite_rc" -eq 0 ] && [ "$sfail" -eq 0 ]; then
  printf '  [ ok ] %-38s %s pass, 0 fail\n' "contract suite" "$tot"
else
  fail=1
  printf '  [FAIL] %-38s %s pass, %s fail  (BLOCCANTE)\n' "contract suite" "$tot" "$sfail"
fi

echo "-- B1b) contratto RTE (routing, blueprint §18) --"
tot_rte=0; rte_rc=0
for f in tests/routing/*.test.mjs; do
  node --test "$f" > "$LOG_DIR/rte" 2>&1 || rte_rc=1
  p=$(grep -E '^# pass ' "$LOG_DIR/rte" | awk '{print $3}'); tot_rte=$((tot_rte + ${p:-0}))
done
NAMES+=("RTE suite ($tot_rte pass)"); CODES+=("$rte_rc"); BLOCKING+=("1")
if [ "$rte_rc" -eq 0 ]; then printf '  [ ok ] %-38s %s pass\n' "RTE suite (routing)" "$tot_rte";
else fail=1; printf '  [FAIL] %-38s (BLOCCANTE)\n' "RTE suite (routing)"; fi

echo "-- B1c) contratto DEC (decomposition, blueprint §16) --"
tot_dec=0; dec_rc=0
for f in tests/decomposition/*.test.mjs; do
  node --test "$f" > "$LOG_DIR/dec" 2>&1 || dec_rc=1
  p=$(grep -E '^# pass ' "$LOG_DIR/dec" | awk '{print $3}'); tot_dec=$((tot_dec + ${p:-0}))
done
NAMES+=("DEC suite ($tot_dec pass)"); CODES+=("$dec_rc"); BLOCKING+=("1")
if [ "$dec_rc" -eq 0 ]; then printf '  [ ok ] %-38s %s pass\n' "DEC suite (decomposition)" "$tot_dec";
else fail=1; printf '  [FAIL] %-38s (BLOCCANTE)\n' "DEC suite (decomposition)"; fi

echo "-- B1d) contratto SEL (selection, blueprint §17) --"
tot_sel=0; sel_rc=0
for f in tests/selection/*.test.mjs; do
  node --test "$f" > "$LOG_DIR/sel" 2>&1 || sel_rc=1
  p=$(grep -E '^# pass ' "$LOG_DIR/sel" | awk '{print $3}'); tot_sel=$((tot_sel + ${p:-0}))
done
NAMES+=("SEL suite ($tot_sel pass)"); CODES+=("$sel_rc"); BLOCKING+=("1")
if [ "$sel_rc" -eq 0 ]; then printf '  [ ok ] %-38s %s pass\n' "SEL suite (selection)" "$tot_sel";
else fail=1; printf '  [FAIL] %-38s (BLOCCANTE)\n' "SEL suite (selection)"; fi

echo "-- B2) demo end-to-end §21 di UJ-RUN-001 --"
run 1 "demo end-to-end (mission-demo)"  node packages/contracts/demo/mission-demo.mjs

echo "-- C) validatori del Council (di ChatGPT, riusati) --"
run 1 "validate-council-packets"       node scripts/validate-council-packets.mjs
run 1 "validate-program-os"            node scripts/validate-program-os.mjs

echo "-- D) response packet di UJ-RUN-001 (mio) --"
if [ -f docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json ]; then
  run 1 "validate-response-packet"     node scripts/validate-response-packet.mjs docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
fi

echo "-- E) coerenza incrociata dei documenti (informativo, non blocca) --"
run 0 "cross-document-consistency"     python3 docs/threat-models/probes/cross-document-consistency.py

echo "-- F) le review importabili (informativo) --"
run 0 "audit-review-importability"     node scripts/audit-review-importability.mjs

echo
echo "== riepilogo =="
for i in "${!NAMES[@]}"; do
  tag="informativo"; [ "${BLOCKING[$i]}" -eq 1 ] && tag="BLOCCANTE"
  printf '  %-40s exit=%-3s %s\n' "${NAMES[$i]}" "${CODES[$i]}" "$tag"
done
echo
echo "-- NON eseguito di proposito: pytest di Grok (S-18/FIX-11: corromperebbe il repo) --"
if [ "$fail" -eq 0 ]; then
  echo "GATE: PASS — tutte le verifiche bloccanti a exit 0"
  exit 0
else
  echo "GATE: FAIL — almeno una verifica bloccante non e' a exit 0"
  exit 1
fi
