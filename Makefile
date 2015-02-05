MOCHA_OPTS = --check-leaks
REPORTER = spec

test:
	@node test-runner.js

test-autocomplete:
	@node test-runner.js autocomplete

test-button:
	@node test-runner.js button

test-busyindicator:
	@node test-runner.js busyindicator

test-checkbox:
	@node test-runner.js checkbox

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

test-spinbox:
	@node test-runner.js spinbox

test-slider:
	@node test-runner.js slider

test-radio:
	@node test-runner.js radio

test-message:
	@node test-runner.js message
	
test-toast:
	@node test-runner.js toast

test-toolbar:
	@node test-runner.js toolbar

test-searchfield:
	@node test-runner.js searchfield
				
.PHONY: test
