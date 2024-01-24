CURRENT_DIR=$(shell pwd)
ORGANIZATION = hookandloop
IMAGE = enterprise-publish-docs
IMAGE_TAG = 0.0.2


ifneq (,$(wildcard ./.env))
	include .env
	export
endif


.PHONY: all
all: build tag push

.PHONY: build
build :
	DOCKER_BUILDKIT=1 docker build --platform=linux/amd64 -t $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG) -f $(CURRENT_DIR)/Dockerfile .

.PHONY: tag
tag:
	docker tag $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG) $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: push
push:
	docker push $(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: run
run :
	docker run --platform=linux/amd64 --rm --name $(IMAGE) \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env DOCS_API_URL=${DOCS_API_URL} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env SITE=${SITE} \
		--env APP_REPO=${APP_REPO} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		-v ${PWD}/utils.sh:/usr/src/utils.sh \
		$(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)

.PHONY: shell
shell :
	docker run --platform=linux/amd64 -it --rm --name $(IMAGE) \
		--entrypoint /bin/sh \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env DOCS_API_URL=${DOCS_API_URL} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env SITE=${SITE} \
		--env APP_REPO=${APP_REPO} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		-v ${PWD}/utils.sh:/usr/src/utils.sh \
		$(ORGANIZATION)/$(IMAGE):$(IMAGE_TAG)
