# docker-project-lct-2023
 Автоматизированный Docker контейнер для сборки и запуска проекта.

<h2>Супер команды</h2>

<ul>
 <li>[make initProject] - инициализация проекта с подтягиванием всех компонентов </li>
 <li>[make updateProject] - обновление компонентов проекта (backend и frontend)  </li>
</ul>
 <h2>Внутренние команды </h2>
 
<ul>
 <li>[make db] - создание папки для базы данных                    *использовать если ранее папка не была создана</li>
 <li>[make backend] - клонирует backend с git                      *нужен key для осуществления копирования с приватного репозитория  </li>
 <li>[make backendUpdate] - обновляет backend с git                *нужен key для осуществления копирования с приватного репозитория  </li>
</ul>

  <h2>Команды Docker</h2>

<ul>
 <li>[make docker] - запуск Docker приложения состоящего из контейнеров</li>
 <li>[make docker-stop] - останвливет Docker приложение</li>
 <li>[make docker-reset] - удаляет все установленные контейнеры данног и пересобирает приложение  </li>
 <li>[make docker-rebuild] - [make docker-reset] + [make docker]  </li>
</ul>
