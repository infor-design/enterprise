MOCHA_OPTS = --check-leaks
REPORTER = spec

test:
		@node test-runner.js

.PHONY: test
