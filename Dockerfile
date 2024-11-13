# Étape 1 : Construction
FROM node:20 AS builder
WORKDIR /app

# Déclarer les arguments pour les variables d'environnement
ARG DATABASE_URL
ARG JWT_SECRET
ARG NODE_ENV

# Définir les variables d'environnement pour la phase d'exécution
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

# Copier les fichiers principaux et installer les dépendances
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installer TurboRepo et les dépendances de production
RUN npm install -g turbo
RUN npm install

# Construire le projet
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:20 AS runner
WORKDIR /app

# Copier les fichiers construits depuis le builder
COPY --from=builder /app .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:api-prod"]
