# stage 1

FROM node:alpine AS gui-build
WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out


# stage 2

FROM nginx:alpine
#Copy ci-dashboard-dist
COPY --from=gui-build /app/dist/out/ /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx.conf.template /etc/nginx/conf.d/default.conf
