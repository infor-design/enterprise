FROM node:14-buster

WORKDIR /usr/src

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get update \
	&& apt-get install -y \
	software-properties-common \
	build-essential \
	supervisor \
	nginx \
	&& apt-get -y autoclean

COPY supervisor/* /etc/supervisor/conf.d/
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf /etc/nginx/sites-enabled/default

RUN mkdir -p /www/data/
RUN chown -R www-data.www-data /www/data
RUN mkdir -p /data/nginx/cache

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
