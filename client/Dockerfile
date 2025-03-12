FROM node:16
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./
RUN ls -la # Affiche les fichiers après la copie de package.json


# Copier le reste des fichiers
COPY . .
RUN ls -la # Affiche les fichiers après la copie de tous les fichiers

# Installer les dépendances
RUN npm install --legacy-peer-deps


# Construire l'application React
RUN npm run build

# Servir l'application avec un serveur léger
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
