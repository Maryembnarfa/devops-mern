# Utilisation de l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application React
RUN npm run build

# Servir l'application avec un serveur léger (nginx ou serve)
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
