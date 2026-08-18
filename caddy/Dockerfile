FROM caddy:2.8.4

# these paths are relative to the project root, not this folder
COPY caddy/Caddyfile /etc/caddy/Caddyfile

# Syntax-check the Caddyfile so an invalid config fails the build (was previously a CI/CD job).
# DOMAIN/API_HOSTNAME are only set at runtime, so supply placeholders to keep the parse valid.
RUN DOMAIN=example.com API_HOSTNAME=cbr_django caddy validate --config /etc/caddy/Caddyfile

# Extract website (avoid ADD: unpredictable, and seems not to extract on CI/CD server July 2022)
# Note: this does leave behind the extar tar.gz file in a layer
COPY web_build.tar.gz /var/www/
RUN cd /var/www/ && tar -xzf web_build.tar.gz && rm web_build.tar.gz
