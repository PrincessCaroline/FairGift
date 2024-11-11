# Étape 1 : Installer Turborepo globalement et builder les dépendances
FROM node:18 AS builder

WORKDIR /app

# Copier tous les fichiers du monorepo dans le conteneur
COPY . .

# Installer Turborepo globalement
RUN npm install -g turbo

# Installer toutes les dépendances du monorepo
RUN npm install --legacy-peer-deps

# Builder les packages nécessaires (`@repo/dto` et `@repo/api`)
RUN npm run build:api-prod

# Étape 2 : Créer une image finale optimisée
FROM node:18 AS runner

WORKDIR /app

# Copier les fichiers buildés pour `@repo/api`
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

# Copier le dossier dist de `@repo/dto` dans `node_modules/@repo/dto/dist`
RUN mkdir -p ./node_modules/@repo/dto
COPY --from=builder /app/packages/dto/dist ./node_modules/@repo/dto/dist

# Copier l'intégralité de `node_modules` pour toutes les dépendances
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port de l'API
EXPOSE 3000

# Démarrer l'application en production
CMD ["node", "dist/main.js"]
