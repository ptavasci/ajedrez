# Etapa 1: Build de la app con Node
FROM node:lts-alpine AS build

WORKDIR /app

# Instala npm globalmente
RUN npm install -g npm

# Copia ambos archivos antes de instalar dependencias
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir archivos estáticos con Nginx
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada de Nginx
COPY nginx-custom.conf /etc/nginx/conf.d/

# Borra cualquier archivo viejo en la carpeta html
RUN rm -rf /usr/share/nginx/html/*

# Copia SOLO el build generado por Vite
COPY --from=build /app/dist /usr/share/nginx/html 

# Copia el entrypoint si lo necesitas
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]