FROM node:14

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait && npm install --global nodemon && npm install --gloabal yarn --force

WORKDIR /usr/src/auth/

COPY . /usr/src/auth/

RUN npm install

EXPOSE $_PORT

CMD /wait && npm install && npm start /usr/src/auth