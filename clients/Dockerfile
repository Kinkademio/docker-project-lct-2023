FROM node:16

WORKDIR /usr/src/clients/dist/ssr


ARG _FRONTEND_PORT=3000
ENV FRONTEND_PORT=$_FRONTEND_PORT
EXPOSE $_FRONTEND_PORT

CMD npm install && yarn --prod && node index.js


