FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Servir com Nginx interno (usaremos o Nginx principal no container separado)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
