# Étape 1 : Construction
FROM node:20 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers principaux et les installer
COPY package.json turbo.json ./
COPY packages packages/
COPY apps/api apps/api/

# Installer TurboRepo globalement et les dépendances du projet
RUN npm install 
RUN npm install -g turbo

# Copier uniquement les fichiers nécessaires de l'étape de build
COPY --from=builder /app .

EXPOSE 3000

# Définir la commande de démarrage pour l'API
CMD ["npm", "run", "start:api-prod"]
