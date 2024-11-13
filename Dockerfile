# Étape 1 : Construction
FROM node:20 AS builder
WORKDIR /app

# Copier les fichiers principaux et installer toutes les dépendances
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installez toutes les dépendances, y compris celles de développement
RUN npm install

# Construire le projet
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:20 AS runner
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:api-prod"]
