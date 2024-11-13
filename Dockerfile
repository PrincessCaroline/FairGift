# Étape 1 : Construction
FROM node:18 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers principaux et les installer
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Définir les variables d'environnement uniquement pour l'exécution
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

# Afficher les valeurs pendant l'exécution pour vérifier
CMD echo "JWT_SECRET: $JWT_SECRET" && \
    echo "DATABASE_URL: $DATABASE_URL" && \
    echo "NODE_ENV: $NODE_ENV" && \

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
