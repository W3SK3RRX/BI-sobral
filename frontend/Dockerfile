FROM node:18-alpine as build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./

# Build do React
RUN npm run build
