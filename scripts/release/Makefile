ORGANIZATION = hookandloop
WORKER_CONTAINER_NAME = enterprise-release
WORKER_CONTAINER_VERSION = 1.0.0

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build-worker-image
build-worker-image :
	docker build -t $(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION) .

.PHONY: run-worker
run-worker :
	docker run --rm --name $(WORKER_CONTAINER_NAME) \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env DOCS_API_URL=${DOCS_API_URL} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env BRANCH=${BRANCH} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env NPM_LATEST=${NPM_LATEST} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		--env REPO_OWNER_NAME=${REPO_OWNER_NAME} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/.gitconfig:/root/.gitconfig \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)

.PHONY: shell-worker
shell-worker :
	docker run -it --rm --name $(WORKER_CONTAINER_NAME) \
		--entrypoint /bin/bash \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env DOCS_API_URL=${DOCS_API_URL} \
		--env NPM_TOKEN=${NPM_TOKEN} \
		--env BRANCH=${BRANCH} \
		--env NPM_COMMAND=${NPM_COMMAND} \
		--env NPM_LATEST=${NPM_LATEST} \
		--env RELEASEIT_FLAGS=${RELEASEIT_FLAGS} \
		--env RELEASE_INCREMENT=${RELEASE_INCREMENT} \
		--env REPO_OWNER_NAME=${REPO_OWNER_NAME} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/.gitconfig:/root/.gitconfig \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)
