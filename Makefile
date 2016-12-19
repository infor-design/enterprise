MOCHA_OPTS = --check-leaks
REPORTER = spec

# Container Name
SOHO_CONTAINER = hl_sohoxi

.PHONY: test

test:
	@node test-runner.js

test-accessibility:
	@node test-runner.js accessibility

test-autocomplete:
	@node test-runner.js autocomplete

test-button:
	@node test-runner.js button

test-busyindicator:
	@node test-runner.js busyindicator

test-charts:
	@node test-runner.js charts

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

test-tabs:
	@node test-runner.js tabs

pull :
	docker-compose pull

up : pull
	rm -rf node_modules
	docker-compose up -d
	@echo "[Info] Building SoHo XI..." 
	@echo "[Info] Can take up to 5 mins to start. Check http://localhost:4000"
	@echo "[Info] Run make down to stop containers."

down :
	rm -rf node_modules
	docker-compose down

restart :
	docker-compose restart	

reset : down
	make up

shell :
	docker exec -ti $(SOHO_CONTAINER) /bin/bash

tail :
	docker logs -f $(SOHO_CONTAINER)

watch :
	docker exec -ti $(SOHO_CONTAINER) /bin/bash -c "cd /controls && grunt watch"
	@echo "[Info] ctrl-c to stop grunt watch"

unit-tests :
	docker exec -ti $(SOHO_CONTAINER) /bin/bash -c "./node_modules/.bin/intern-client config=test2/intern.local.unit"
	@echo "[Info] Running unit-tests..."
