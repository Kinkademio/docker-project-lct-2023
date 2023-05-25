/* 
***************************************************************
                           ЗАВИСИМОСТИ
***************************************************************
*/

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http');
const cors=require("cors");
const path = require('path');
const fileupload = require('express-fileupload')
const {routes} = require('./src/routes')



/****************************************************************
                 ПОРТЫ ДЛЯ ЗАПУСКА КОНТЕЙНЕРОВ
                 (подтягиваются с DockerFile)
****************************************************************/

const DB_PORT = process.env.DB_PORT;
const BACKEND_PORT = process.env.BACKEND_PORT;

/****************************************************************
             НАЗВАНИЕ БАЗЫ и URL ДЛЯ ДОСТУПА К НЕЙ
****************************************************************/
const DB_NAME = 'edu_app_database';
let uri = `mongodb://mongodb:${DB_PORT}/${DB_NAME}`


/****************************************************************
                     ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
****************************************************************/

global.ROOT = path.resolve(__dirname);
global.SERVER_URL = 'https://graduate-map.ru/api';

/****************************************************************
                     ОСНОВНАЯ ЧАСТЬ
****************************************************************/


//Установка соединения с базой
mongoose.connect(
    uri,
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

//Инициализация приложения
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileupload());

//Название роута сотовляется из названия файла + роут
//Пример:
//http:/localhost:PORT/назвение_route/запрос    
routes.forEach(item => {
    app.use(`/${item}`, require(`./src/routes/${item}`));
})

http.createServer({}, app).listen(BACKEND_PORT, function(){
    console.log(`Сервер успешно запущен и работает на PORT: ${BACKEND_PORT}`);
});

