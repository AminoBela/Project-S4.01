# Application de Collecte Audio

Ce projet est une application web développée dans le cadre de S4-DACS-01-1 pour collecter des enregistrements audio d'utilisateurs lisant des phrases prédéfinies. Elle est conçue pour être conviviale, anonyme, et conteneurisée avec Docker pour faciliter le déploiement.

L'application est divisée en deux parties principales : un frontend et un backend.

Le frontend est construit avec React. Il gère l'affichage des pages et les interactions avec l'utilisateur. Voici comment il est structuré :
- La page d'accueil (`App.js`) affiche un message de bienvenue et un lien pour commencer.
- La page de consentement (`ConsentForm.js`) collecte l'âge, le genre, et le consentement de l'utilisateur, ainsi que le nombre de phrases qu'il veut enregistrer.
- L'interface d'enregistrement (`RecordingInterface.js`) affiche une phrase à lire, permet d'enregistrer, de réécouter, de réenregistrer, de sauvegarder, et de passer à la phrase suivante. Elle inclut aussi une barre de progression et un statut de sauvegarde ("Sauvegardé" ou "Non sauvegardé") pour éviter les erreurs de sauvegarde.

Le **backend** est construit avec Node.js et Express, un framework pour créer des API. Il gère les requêtes du frontend et stocke les données. Voici son fonctionnement :
- Il reçoit les données (âge, genre) via la route `/api/auth/consent`.
- Il sauvegarde les enregistrements audio via la route `/api/recordings`. Les fichiers audio sont stockés dans un dossier `uploads`, et les métadonnées (nom du fichier, index de la phrase, âge, genre) sont enregistrées dans une base de données SQLite (`recordings.db`).
- SQLite est utilisé pour suivre les enregistrements, ce qui permet de savoir si un fichier a été sauvegardé et d'éviter les doublons.

## Technologies utilisées

- **Frontend** :
  - React : Pour l'interface utilisateur.
  - Axios : Pour envoyer des requêtes HTTP au backend.
  - CSS : Pour le style (voir `App.css` et les styles inline).

- **Backend** :
  - Node.js : Environnement d'exécution JavaScript.
  - Express : Framework pour créer l'API.
  - Multer : Pour gérer l'upload des fichiers audio.
  - SQLite3 : Base de données légère pour stocker les métadonnées.

- **Conteneurisation** :
  - Docker : Pour encapsuler l'application et ses dépendances.
  - Docker Compose : Pour orchestrer les services frontend et backend.

## Docker Compose

Docker Compose est utilisé pour gérer les deux services de l'application : le frontend et le backend. Il permet de les lancer ensemble avec une seule commande, tout en configurant les ports, les volumes, et les dépendances entre eux.

Dans le fichier `docker-compose.yml` :
- Le service `backend` est construit à partir du dossier `server`. Il expose le port 5000 et monte deux volumes : le dossier `uploads` pour les fichiers audio et `recordings.db` pour la base de données.
- Le service `frontend` est construit à partir du dossier `client`. Il expose le port 3000 et dépend du backend (il attend que le backend soit prêt avant de démarrer).
- Les volumes assurent que les données (fichiers audio et base de données) persistent même si les conteneurs sont arrêtés.

### LAncement avec docker-composer

```bash
docker-compose up --build
```

## Fonctionnement en local

**Cloner le dépôt** :
   ``bash
   git clone git@github.com:AminoBela/Project-S4.01.git
   cd Project-S4.01``

### Installer les dépendances :

- Pour le backend :

```bash
cd server
npm install
```

- Pour le frontend :

```bash
cd ../client
npm install
```

### Lancement en local :

- Pour le backend :

```bash
cd ../server
npm start
```

- Pour le frontend :

```bash
cd ../client
npm start
```
Le navigateur s'ouvrira automatiquement sur http://localhost:3000.


