#!/bin/sh

# Replace placeholder in nginx config with environment variable
envsubst '${PROXY_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
nginx -g "daemon off;"
