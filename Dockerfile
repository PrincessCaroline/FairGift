# Étape 1 : Construction
FROM node:20 AS builder

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

# Afficher les variables pour vérification pendant la phase de build
RUN echo "JWT_SECRET: $JWT_SECRET"
RUN echo "DATABASE_URL: $DATABASE_URL"

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers principaux et installer les dépendances
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installer TurboRepo globalement et les dépendances de production
RUN npm install -g turbo
RUN npm install

# Construire l'API
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:18 AS runner

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers construits depuis l'étape de build
COPY --from=builder /app .

# Définir les variables d'environnement pour la phase d'exécution
ENV RAILWAY_PUBLIC_DOMAIN=${RAILWAY_PUBLIC_DOMAIN}
ENV RAILWAY_PRIVATE_DOMAIN=${RAILWAY_PRIVATE_DOMAIN}
ENV RAILWAY_PROJECT_NAME=${RAILWAY_PROJECT_NAME}
ENV RAILWAY_ENVIRONMENT_NAME=${RAILWAY_ENVIRONMENT_NAME}
ENV RAILWAY_SERVICE_NAME=${RAILWAY_SERVICE_NAME}
ENV RAILWAY_PROJECT_ID=${RAILWAY_PROJECT_ID}
ENV RAILWAY_ENVIRONMENT_ID=${RAILWAY_ENVIRONMENT_ID}
ENV RAILWAY_SERVICE_ID=${RAILWAY_SERVICE_ID}
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

# Afficher les variables pour vérifier qu'elles sont disponibles lors de l'exécution
CMD echo "JWT_SECRET: $JWT_SECRET" && \
    echo "DATABASE_URL: $DATABASE_URL" && \
    echo "NODE_ENV: $NODE_ENV" && \
    npm run start:api-prod
