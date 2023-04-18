# docker-project-lct-2023
 Автоматизированный Docker контейнер для сборки и запуска проекта.

 _______________________________ Супер команды __________________________________
 *[make initProject] - инициализация проекта с подтягиванием всех компонентов 
 *[updateProject] - обновление компонентов проекта (backend и frontend) 
 ________________________________________________________________________________
 
 
 _______________________________ Внутренние команды ______________________________
 *[make db] - создание папки для базы данных                    *использовать если ранее папка не была создана
 *[make backend] - клонирует backend с git                      *нужен key для осуществления копирования с приватного репозитория
 *[make backendUpdate] - обновляет backend с git                *нужен key для осуществления копирования с приватного репозитория
 ________________________________________________________________________________
 
 
 _________________________________ Команды Docker _______________________________
 *[make docker] - запуск Docker приложения состоящего из контейнеров
 *[make docker-stop] - останвливет Docker приложение
 *[make docker-reset] - удаляет все установленные контейнеры данног и пересобирает приложение
 *[make docker-rebuild] - [make docker-reset] + [make docker]
 ________________________________________________________________________________
