FROM caddy:2.4.6

# these paths are relative to the project root, not this folder
ADD caddy/Caddyfile /etc/caddy/Caddyfile
ADD web_build.tar.gz /var/www/

# TODO: REMOVE
COPY web_build.tar.gz /var/
RUN echo "Build did it!" >> /var/www/check.txt
RUN ls -la  >> /var/www/fileinfo.txt