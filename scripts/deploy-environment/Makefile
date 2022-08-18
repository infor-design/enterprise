ORGANIZATION=hookandloop
DEPLOY_CONTAINER_NAME=ent-env-deploy
DEPLOY_CONTAINER_VERSION=0.0.1
DEMO_CONTAINER_NAME=sohoxi-demo
DEMO_CONTAINER_VERSION=1.0.1

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: run-awf, build-image, deploy, shell

build-image :
	docker build -t $(ORGANIZATION)/$(DEPLOY_CONTAINER_NAME):$(DEPLOY_CONTAINER_VERSION) .

run-awf :
	. ./run-workflow.sh \
		${AWF_URL} \
		${AWF_TEMPLATE_ID} \
		${HANDLER_API_URL} \
		${ORG_NAME} \
		${BASE_CONTAINER_NAME} \
		${BUILD_FROM} \
		${REPO_OWNER_NAME}

run-demo :
	docker run --rm --name $(DEMO_CONTAINER_NAME) \
		-v ${PWD}/build:/controls \
		-v ${PWD}/build/dist:/www/data/artifacts \
		-v ${PWD}/build/docs:/www/data/docs \
		-p 8080:80/tcp \
	 	$(ORGANIZATION)/$(DEMO_CONTAINER_NAME):$(DEMO_CONTAINER_VERSION)

deploy :
	docker run --rm --name $(DEPLOY_CONTAINER_NAME) \
		--env IMAGE_LIBRARY_USER=${IMAGE_LIBRARY_USER} \
		--env IMAGE_LIBRARY_PASS=${IMAGE_LIBRARY_PASS} \
		--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
		--env HANDLER_API_KEY=${HANDLER_API_KEY} \
		--env HANDLER_API_URL=${HANDLER_API_URL} \
		--env TLS_SECRET=${TLS_SECRET} \
		--env ORG_NAME=${ORG_NAME} \
		--env BASE_CONTAINER_NAME=${BASE_CONTAINER_NAME} \
		--env BUILD_FROM=${BUILD_FROM} \
		--env BUILD_AS_LATEST=${BUILD_AS_LATEST} \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v ${PWD}/build:/root/enterprise \
		-v ${PWD}/run.sh:/usr/src/run.sh \
		$(ORGANIZATION)/$(DEPLOY_CONTAINER_NAME):$(DEPLOY_CONTAINER_VERSION)

shell :
	docker run -it --rm --name $(DEPLOY_CONTAINER_NAME) \
			--entrypoint /bin/bash \
			--env IMAGE_LIBRARY_USER=${IMAGE_LIBRARY_USER} \
			--env IMAGE_LIBRARY_PASS=${IMAGE_LIBRARY_PASS} \
			--env GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN} \
			--env HANDLER_API_KEY=${HANDLER_API_KEY} \
			--env HANDLER_API_URL=${HANDLER_API_URL} \
			--env TLS_SECRET=${TLS_SECRET} \
			--env ORG_NAME=${ORG_NAME} \
			--env BASE_CONTAINER_NAME=${BASE_CONTAINER_NAME} \
			--env BUILD_FROM=${BUILD_FROM} \
			--env BUILD_AS_LATEST=${BUILD_AS_LATEST} \
			-v /var/run/docker.sock:/var/run/docker.sock \
			-v ${PWD}/build:/root/enterprise \
			-v ${PWD}/run.sh:/usr/src/run.sh \
			$(ORGANIZATION)/$(DEPLOY_CONTAINER_NAME):$(DEPLOY_CONTAINER_VERSION)
