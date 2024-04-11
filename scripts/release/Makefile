CURRENT_DIR=$(shell pwd)

ORGANIZATION = hookandloop
IMAGE = enterprise-release
IMAGE_TAG = 1.0.1


ifneq (,$(wildcard ./.env))
	include .env
	export
endif


.PHONY: all
all: build tag push

.PHONY: build
build:
	DOCKER_BUILDKIT=1 docker build \
		--platform=linux/amd64 \
		-t $(IMAGE):$(IMAGE_TAG) \
		-f $(CURRENT_DIR)/Dockerfile .

.PHONY: tag
tag:
	docker tag $(IMAGE):$(IMAGE_TAG) $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: push
push:
	docker push $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: run
run :
	docker run --rm --name $(IMAGE) \
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
		$(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: shell
shell :
	docker run -it --rm --name $(IMAGE) \
		--platform=linux/amd64 \
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
		$(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)
