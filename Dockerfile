FROM node:20-bookworm as builder
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
RUN echo "--- Contenido de /app/dist en la etapa builder ---"
RUN ls -la /app/dist || ls -la /app/dist || ls -la /app/dist
FROM nginx:1.28-alpine

RUN find /usr/share/nginx/html -mindepth 1 -delete

COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo "--- Contenido de /usr/share/nginx/html después de la copia ---"
RUN ls -la /usr/share/nginx/html
RUN echo "---------------------------------------------------------"
RUN chmod -R 755 /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
//COPY nginx/ssl /etc/nginx/ssl
