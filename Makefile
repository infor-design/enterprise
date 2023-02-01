# Container Name
SOHO_CONTAINER = hl_sohoxi

.PHONY: test

pull :
	docker-compose pull

up : pull
	rm -rf node_modules
	docker-compose up -d
	@echo "[Info] Building IDS Enterprise..."
	@echo "[Info] Can take up to 5 mins to start. Check http://localhost:4000"
	@echo "[Info] Run make down to stop containers."

down :
	rm -rf node_modules
	docker-compose down

restart :
	docker-compose restart

reset : down
	make up

shell :
	docker exec -ti $(SOHO_CONTAINER) /bin/bash

tail :
	docker logs -f $(SOHO_CONTAINER)

watch :
	docker exec -ti $(SOHO_CONTAINER) /bin/bash -c "cd /controls && npm run watch"
