# Étape 1 : Construction
FROM node:20 AS builder
WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installer TurboRepo et les dépendances de production
RUN npm install -g turbo
RUN npm install --omit=dev

# Construire le projet
RUN npm run build:api-prod

# Étape 2 : Exécution
FROM node:20 AS runner
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app .

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:api-prod"]
