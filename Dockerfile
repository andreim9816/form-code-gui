# Stage 1: Build Angular App
FROM node:alpine AS form-gate-gui-build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
ARG configuration=production
RUN npm run build -- --configuration=$configuration --output-path=./dist/form-gui

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build artifacts to Nginx's html directory
COPY --from=form-gate-gui-build /app/dist/form-gui/ /usr/share/nginx/html

# Copy custom Nginx configuration and entrypoint script
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
