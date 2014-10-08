MOCHA_OPTS = --check-leaks
REPORTER = spec

test:
	@node test-runner.js
	
test-button:
	@node test-runner.js button
	
test-dropdown:
	@node test-runner.js dropdown
	
test-tmpl:
	@node test-runner.js tmpl

test-globalize:
	@node test-runner.js globalize

test-mask:
	@node test-runner.js mask

test-multiselect:
	@node test-runner.js multiselect

.PHONY: test
