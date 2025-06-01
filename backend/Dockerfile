# Usar Node.js 18 Alpine
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["node", "server/index.js"]