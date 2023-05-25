FROM node:14

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait && npm install --global nodemon && npm install --gloabal yarn --force

WORKDIR /usr/src/backend-lct-2023/

COPY package.json /usr/src/backend-lct-2023/

RUN npm install


#        УСТАНОВКА ПОРТОВ ДЛЯ ЗАПУСКА КОНТЕЙНЕРОВ
#
#        _DB_PORT  - порт для создания* и запуска контейнера базы данных
#        _BACKEND_PORT  - порт для создания* и запуска контейнера backend

ARG _DB_PORT=27017
ARG _BACKEND_PORT=3000

#                 !!! НЕОБХОДИМО ИЗМЕНИТЬ!!!
ARG _DOMAIN_NAME='graduate-map.ru'

#Константы портов для доступа внутри контейнеров
ENV DB_PORT=$_DB_PORT
ENV BACKEND_PORT=$_BACKEND_PORT
ENV DOMAIN_NAME=$_DOMAIN_NAME


EXPOSE $_BACKEND_PORT

CMD /wait && yarn dev --watch /usr/src/backend-lct-2023