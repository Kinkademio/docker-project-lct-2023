FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY .htpasswd /etc/nginx/conf.d/.htpasswd
COPY certs/graduate-map.ru.crt /etc/
COPY certs/graduate-map.ru.key /etc/ssl
COPY ./spa /usr/share/nginx/html