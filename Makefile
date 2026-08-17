.PHONY: test health tools snapshot seed run

test:
	python -m pytest tests/ -q

health:
	python bin/uj health

tools:
	python bin/uj tools

snapshot:
	python bin/uj snapshot

seed:
	python bin/uj seed "$(MSG)"

run:
	python bin/uj run --all
