# Stage 1: Build Angular app
FROM node:alpine AS gui-build
WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=gui-build /app/dist/out/browser/ /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
