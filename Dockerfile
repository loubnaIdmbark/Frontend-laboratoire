# Étape 1: Construire l'application Angular
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet
COPY . .

# Construire l'application Angular pour la production
ng build frontend-laboratoire --configuration production

# Étape 2: Créer l'image finale pour le déploiement
FROM nginx:alpine

# Copier les fichiers générés par le build de Angular dans le répertoire de NGINX
COPY --from=build /app/dist/frontend-laboratoire /usr/share/nginx/html

# Exposer le port 80 pour l'accès à l'application
EXPOSE 80

# Commande de démarrage du serveur NGINX
CMD ["nginx", "-g", "daemon off;"]
