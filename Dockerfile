# Stage 1: Build de l'application Angular
FROM node:20-alpine as builder

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm ci --silent

# Copie le code source
COPY . .

# Build l'application avec SSR pour la production
RUN npm run build:ssr

# Stage 2: Image de production
FROM node:20-alpine

WORKDIR /app

# Copie les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installe seulement les dépendances de production
RUN npm ci --only=production --silent

# Expose le port 4200
EXPOSE 4200

# Démarre le serveur SSR
CMD ["npm", "run", "serve:ssr"]
