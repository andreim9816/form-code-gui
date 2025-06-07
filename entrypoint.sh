#!/bin/sh

# Substitute and generate nginx config
envsubst '${PROXY_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start NGINX
exec "$@"
