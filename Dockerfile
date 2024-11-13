# Étape 1 : Construction
FROM node:18 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers principaux et les installer
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

FROM node
# railway env variables
ARG RAILWAY_PUBLIC_DOMAIN
ARG RAILWAY_PRIVATE_DOMAIN
ARG RAILWAY_PROJECT_NAME
ARG RAILWAY_ENVIRONMENT_NAME
ARG RAILWAY_SERVICE_NAME
ARG RAILWAY_PROJECT_ID
ARG RAILWAY_ENVIRONMENT_ID
ARG RAILWAY_SERVICE_ID
# app env variables
ARG DATABASE_URL
ARG JWT_SECRET
ARG NODE_ENV

RUN echo $JWT_SECRET
RUN echo $DATABASE_URL


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