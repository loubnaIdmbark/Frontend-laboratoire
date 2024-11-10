# Step 1: Build the Angular application
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application
COPY . .

# Build the Angular app for production
RUN ng build frontend-laboratoire --configuration production

# Step 2: Create the final image for deployment using Nginx
FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/frontend-laboratoire /usr/share/nginx/html
