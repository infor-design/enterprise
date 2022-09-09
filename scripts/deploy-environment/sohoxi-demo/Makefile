ORGANIZATION = hookandloop
CONTAINER = sohoxi-demo
VERSION = 1.0.1

.PHONY: build

build :
	docker build --squash -t $(ORGANIZATION)/$(CONTAINER):$(VERSION) .

push:
	docker push $(ORGANIZATION)/$(CONTAINER):$(VERSION)

shell:
	docker exec -it $(CONTAINER) /bin/bash

history:
	docker history --human --format "{{.CreatedBy}}: {{.Size}}" $(ORGANIZATION)/$(CONTAINER):$(VERSION)
