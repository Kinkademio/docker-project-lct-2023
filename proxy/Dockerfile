FROM node:14

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait && npm install --global nodemon && npm install --gloabal yarn --force

WORKDIR /usr/src/proxy/

COPY . /usr/src/proxy/

RUN npm install

ARG _HOST='0.0.0.0'
ARG _PORT='6000'


#Константы портов для доступа внутри контейнеров
ENV HOST=$_HOST
ENV PORT=$_PORT

EXPOSE $_PORT

CMD /wait && npm install && node server.js /usr/src/proxy