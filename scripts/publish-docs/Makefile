ORGANIZATION = hookandloop
WORKER_CONTAINER_NAME = enterprise-publish-docs
WORKER_CONTAINER_VERSION = 0.0.1

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
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env SITE=${SITE} \
		--env APP_REPO=${APP_REPO} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		-v ${PWD}/utils.sh:/usr/src/utils.sh \
		$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)

.PHONY: shell-worker
shell-worker :
	docker run -it --rm --name $(WORKER_CONTAINER_NAME) \
		--entrypoint /bin/sh \
		--env DOCS_API_KEY=${DOCS_API_KEY} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env SITE=${SITE} \
		--env APP_REPO=${APP_REPO} \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		-v ${PWD}/utils.sh:/usr/src/utils.sh \
		$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)
