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
COPY --from=gui-build /app/dist/out/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
