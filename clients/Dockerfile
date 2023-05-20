FROM node:14

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait && npm install --global nodemon && npm install --gloabal yarn --force

WORKDIR /usr/src/clients/

COPY package.json /usr/src/clients/

RUN npm install


#        УСТАНОВКА ПОРТОВ ДЛЯ ЗАПУСКА КОНТЕЙНЕРОВ
#
#        _FRONTEND_PORT  - порт для создания* и запуска контейнера FRONTEND

ARG _FRONTEND_PORT=80

#Константы портов для доступа внутри контейнеров
ENV FRONTEND_PORT=$_FRONTEND_PORT

EXPOSE $_FRONTEND_PORT

CMD /wait && yarn dev --watch /usr/src/clients
