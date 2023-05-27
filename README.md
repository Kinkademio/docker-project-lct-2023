# docker-project-lct-2023
 Автоматизированный Docker контейнер для сборки и запуска проекта.

 <h2>Внутренние команды </h2>
 
<ul>
 <li>[make db] - создание папки для базы данных                    *использовать если ранее папка не была создана</li>
</ul>

  <h2>Команды Docker</h2>

<ul>
 <li>[make docker] - запуск Docker приложения состоящего из контейнеров</li>
 <li>[make docker-stop] - останвливет Docker приложение</li>
 <li>[make docker-reset] - удаляет все установленные контейнеры данног и пересобирает приложение  </li>
 <li>[make docker-rebuild] - [make docker-reset] + [make docker]  </li>
</ul>
