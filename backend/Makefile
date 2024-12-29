start:
	docker compose -f docker-compose-dev.yml up -d

stop:
	docker compose -f docker-compose-dev.yml stop

exec:
	docker compose -f docker-compose-dev.yml exec -it app sh

logs:
	docker compose -f docker-compose-dev.yml logs app alert-checker -f