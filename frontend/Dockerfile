FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# COPIAR .env ANTES DO BUILD
COPY .env.production .env

COPY . .
RUN npm run build

# Servir com Nginx interno
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
