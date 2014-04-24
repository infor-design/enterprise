MOCHA_OPTS = --check-leaks
REPORTER = spec

test:
		@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		./test/*.js

xunit:
    @NODE_ENV=test ./node_modules/.bin/mocha \
    --reporter xunit > xunit.xml \
    ./test/*.js

.PHONY: test
