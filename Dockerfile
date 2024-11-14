# Étape 1 : Construction
FROM node:20 AS builder
WORKDIR /app

ARG DATABASE_URL
ARG JWT_SECRET
ARG NODE_ENV

RUN echo $JWT_SECRET
RUN echo $DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

# Copier les fichiers principaux et installer toutes les dépendances
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installez toutes les dépendances, y compris celles de développement
RUN npm install -g turbo
RUN npm install

# Construire le projet
RUN npm run build:api-prod

# Étape 2 : Production
FROM node:20 AS runner
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:api-prod"]