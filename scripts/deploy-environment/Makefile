ORGANIZATION=hookandloop
WORKER_CONTAINER_NAME=ent-env-worker
WORKER_CONTAINER_VERSION=0.0.1
DEMO_CONTAINER_NAME=sohoxi-demo
DEMO_CONTAINER_VERSION=1.0.1

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: build-worker-image, run-workflow, run-worker, shell-worker, start-demo

build-worker-image :
	docker build -t $(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION) .

run-workflow :
	. ./run-workflow.sh \
		-u ${AWF_URL} \
		-o ${ORG_NAME} \
		-c ${BASE_CONTAINER_NAME} \
		-f ${BUILD_FROM} \
		-n ${SUBDOMAIN_NAME} \
		-l ${BUILD_AS_LATEST} \
		-v ${VERSION} \
		-a ${APP_REPO} \
		-m ${MANIFESTS_REPO} \
		-s ${SITE}

run-worker :
	docker run --rm --name $(WORKER_CONTAINER_NAME) \
		--env IMAGE_LIBRARY_USER=${IMAGE_LIBRARY_USER} \
		--env IMAGE_LIBRARY_PASS=${IMAGE_LIBRARY_PASS} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env AWF_URL=${AWF_URL} \
		--env ORG_NAME=${ORG_NAME} \
		--env BASE_CONTAINER_NAME=${BASE_CONTAINER_NAME} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env SUBDOMAIN_NAME=${SUBDOMAIN_NAME} \
		--env BUILD_AS_LATEST=${BUILD_AS_LATEST} \
		--env VERSION=${VERSION} \
		--env APP_REPO=${APP_REPO} \
		--env MANIFESTS_REPO=${MANIFESTS_REPO} \
		--env SITE=${SITE} \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)

shell-worker :
	docker run -it --rm --name $(WORKER_CONTAINER_NAME) \
			--entrypoint /bin/bash \
			--env IMAGE_LIBRARY_USER=${IMAGE_LIBRARY_USER} \
			--env IMAGE_LIBRARY_PASS=${IMAGE_LIBRARY_PASS} \
			--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
			--env AWF_URL=${AWF_URL} \
			--env ORG_NAME=${ORG_NAME} \
			--env BASE_CONTAINER_NAME=${BASE_CONTAINER_NAME} \
			--env BUILD_FROM=${BUILD_FROM} \
			--env SUBDOMAIN_NAME=${SUBDOMAIN_NAME} \
			--env BUILD_AS_LATEST=${BUILD_AS_LATEST} \
			--env VERSION=${VERSION} \
			--env APP_REPO=${APP_REPO} \
			--env MANIFESTS_REPO=${MANIFESTS_REPO} \
			--env SITE=${SITE} \
			-v /var/run/docker.sock:/var/run/docker.sock \
			-v ${PWD}/build:/root/enterprise \
			-v ${PWD}/run.sh:/usr/src/run.sh \
			$(ORGANIZATION)/$(WORKER_CONTAINER_NAME):$(WORKER_CONTAINER_VERSION)

start-demo :
	docker run --rm --name $(DEMO_CONTAINER_NAME) \
		-v ${PWD}/build:/controls \
		-v ${PWD}/build/dist:/www/data/artifacts \
		-v ${PWD}/build/docs:/www/data/docs \
		-p 8080:80/tcp \
	 	$(ORGANIZATION)/$(DEMO_CONTAINER_NAME):$(DEMO_CONTAINER_VERSION)
