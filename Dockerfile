# Paso de construcción
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY vite.config.js svelte.config.js ./
COPY . .
RUN npm install -g npm
RUN npm ci
RUN npm run build

# Paso de servicio
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/vite.config.js .
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "index.js"]

