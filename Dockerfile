# Étape 1 : Builder les dépendances
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier tout le monorepo dans le conteneur
COPY . .

# Installer Turborepo globalement
RUN npm install -g turbo

# Installer les dépendances et builder uniquement les packages nécessaires
RUN npm install && \
    npm run build:api-prod

# Étape 2 : Créer une image finale optimisée
FROM node:18 AS runner

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour exécuter l'application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port de l'API
EXPOSE 3000

# Démarrer l'application en production
CMD ["npm", "run", "start:api-prod"]
