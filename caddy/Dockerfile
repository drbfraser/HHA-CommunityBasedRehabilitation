FROM caddy:2.4.6

# these paths are relative to the project root, not this folder
ADD caddy/Caddyfile /etc/caddy/Caddyfile
ADD web_build.tar.gz /var/www/

# TODO: REMOVE
RUN echo "Build ran!" >> /var/www/check.txt
COPY web_build.tar.gz /var/

# Try putting into non-existent directory
ADD web_build.tar.gz /var/www-nonexistant/

# Try putting into directory that exists
RUN mkdir -p /var/www-exists
ADD web_build.tar.gz /var/www-exists/

# TODO: Remove -- Try extracting manually
RUN mkdir -p /var/www-manual/
COPY web_build.tar.gz /var/www-manual/
RUN cd /var/www-manual/ && tar -xzf web_build.tar.gz && rm web_build.tar.gz