ORGANIZATION = agolub
CONTAINER = enterprise-docs-publisher
VERSION = 0.0.1

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build-image, build, shell

build-image :
	docker build -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

release :
	docker run --rm --name $(CONTAINER) \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env BRANCH=${BRANCH} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell :
	docker run -it --rm --name $(CONTAINER) \
		--entrypoint /bin/sh \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env BRANCH=${BRANCH} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
