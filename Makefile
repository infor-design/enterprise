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

test-locale:
	@node test-runner.js locale

test-mask:
	@node test-runner.js mask

test-multiselect:
	@node test-runner.js multiselect

test-form:
	@node test-runner.js form

test-colorpicker:
	@node test-runner.js colorpicker

test-timepicker:
	@node test-runner.js timepicker

test-datepicker:
	@node test-runner.js datepicker

.PHONY: test
