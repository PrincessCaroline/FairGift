# Étape 1 : Builder les dépendances et les packages pour API uniquement
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier tous les fichiers du monorepo dans le conteneur
COPY . .

# Installer les dépendances uniquement pour `@repo/api` et les packages partagés
RUN npm install --workspace=apps/api --legacy-peer-deps

# Builder `@repo/api` et ses dépendances nécessaires
RUN npm run build:api-prod

# Étape 2 : Créer une image finale optimisée
FROM node:18 AS runner

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers buildés et les dépendances de production de `@repo/api`
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port de l'API
EXPOSE 3000

# Démarrer l'application en production
CMD ["node", "dist/main.js"]