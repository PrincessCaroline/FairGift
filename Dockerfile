# Étape 1 : Installer Turborepo globalement et builder les dépendances
FROM node:18 AS builder

WORKDIR /app

# Copier tous les fichiers du monorepo dans le conteneur
COPY . .

# Installer Turborepo globalement
RUN npm install -g turbo

# Installer les dépendances pour la racine
RUN npm install --legacy-peer-deps

# Installer les dépendances pour `@repo/dto` et `@repo/api`
RUN npm install --workspace=packages/dto --legacy-peer-deps
RUN npm install --workspace=apps/api --legacy-peer-deps

# Builder `@repo/dto` et `@repo/api`
RUN npm run build:api-prod

# Étape 2 : Créer une image finale optimisée
FROM node:18 AS runner

WORKDIR /app

# Copier les fichiers buildés pour `@repo/api`
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

# Copier les fichiers buildés de `@repo/dto` dans `node_modules`
COPY --from=builder /app/packages/dto/dist ./node_modules/@repo/dto/dist

# Copier les dépendances de production de la racine pour `@repo/api`
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port de l'API
EXPOSE 3000

# Démarrer l'application en production
CMD ["node", "dist/main.js"]
