FROM node:14

WORKDIR /usr/src/clients/dist

COPY dist /usr/src/clients/dist

WORKDIR /usr/src/clients/dist/spa

RUN npm install


#        УСТАНОВКА ПОРТОВ ДЛЯ ЗАПУСКА КОНТЕЙНЕРОВ
#
#        _FRONTEND_PORT  - порт для создания* и запуска контейнера FRONTEND

ARG _FRONTEND_PORT=8080

#Константы портов для доступа внутри контейнеров
ENV FRONTEND_PORT=$_FRONTEND_PORT

EXPOSE $_FRONTEND_PORT

CMD /wait && yarn start --watch /usr/src/clients/dist

