# Étape 1 : Construction
FROM node:18 AS builder

# Définir le dossier de travail
WORKDIR /app

# Définir des arguments pour les variables d’environnement
ARG DATABASE_URL
ARG JWT_SECRET
ARG NODE_ENV

# Rendre ces variables disponibles pendant la phase de build
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

# Copier les fichiers principaux et les installer
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/
# Copier le fichier .env.production dans le conteneur
COPY .env.production .env

# Installer TurboRepo globalement et les dépendances du projet
RUN npm install -g turbo
RUN npm install

# Construire le package DTO et l'API
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:18 AS runner

# Définir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires de l'étape de build
COPY --from=builder /app .

# Définir la commande de démarrage pour l'API
CMD ["npm", "run", "start:api-prod"]
