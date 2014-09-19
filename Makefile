MOCHA_OPTS = --check-leaks
REPORTER = spec

test:
	@node test-runner.js

test-tmpl:
	@node test-runner.js tmpl

test-globalize:
	@node test-runner.js globalize

.PHONY: test
