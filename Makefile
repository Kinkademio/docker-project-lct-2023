db: 
	mkdir "_databases"
	echo '############# Database folder successfully created ##############'

#Команды для docker
docker:
	docker-compose up -d
	echo '##################### Container launched ########################'

#Перезапуск контейнера на docker
docker-reset:
	docker-compose down
	docker volume prune
	docker-compose build
	echo '################# Container successfully rebuilt ################'

#Остановка контейнера на докер
docker-stop:
	docker-compose down
	echo '##################### Container stopped ############################'

#Пересобирает контейнер и запускает его
docker-rebuild: docker-reset docker
