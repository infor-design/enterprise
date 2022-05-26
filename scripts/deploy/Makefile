ORGANIZATION = agolub
CONTAINER = enterprise-release
VERSION = 0.0.1

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build-image, release, shell

build-image :
	docker build -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

release :
	docker run --rm --name $(CONTAINER) \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env BRANCH=${BRANCH} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env NPM_LATEST=${NPM_LATEST} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell :
	docker run -it --rm --name $(CONTAINER) \
		--entrypoint /bin/sh \
		--env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		--env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env BRANCH=${BRANCH} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env NPM_LATEST=${NPM_LATEST} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(CONTAINER):$(VERSION)
