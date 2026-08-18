FROM caddy:2.8.4

# these paths are relative to the project root, not this folder
COPY caddy/Caddyfile /etc/caddy/Caddyfile

# Syntax check the Caddyfile (was previously a CI/CD job).
# DOMAIN and API_HOSTNAME are only set at runtime
RUN DOMAIN=example.com API_HOSTNAME=cbr_django caddy validate --config /etc/caddy/Caddyfile

# Extract website (avoid ADD: unpredictable, and seems not to extract on CI/CD server July 2022)
# Note: this does leave behind the extar tar.gz file in a layer
COPY web_build.tar.gz /var/www/
RUN cd /var/www/ && tar -xzf web_build.tar.gz && rm web_build.tar.gz
