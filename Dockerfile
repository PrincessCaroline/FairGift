# Étape 1 : Construction
FROM node:18 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers principaux et les installer
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/
COPY apps/api/package.json apps/api/
RUN npm install

# Construire le package DTO et l'API
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:18 AS runner

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers construits
COPY --from=builder /app .

# Définir la commande de démarrage
CMD ["npm", "run", "start:api-prod"]