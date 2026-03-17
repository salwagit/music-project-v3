# 🎵 Music Project v3 – Top Songs App
## 📖 Description

**Music Project v3** est une application web développée avec Node.js permettant d’afficher les **Top Songs** en récupérant les données depuis une API externe, puis en les stockant dans une base de données MongoDB.

L’application est entièrement conteneurisée avec Docker Compose et comprend :

* 🌐 **Application Web (Express.js)** : serveur backend + frontend statique
* 💾 **MongoDB** : stockage des chansons
* 🛠️ **Mongo Express** : interface d’administration de la base de données

---

## 🛠️ Prérequis

Avant de commencer, assure-toi d’avoir installé :

* Docker
* Docker Compose
* Git

Cloner le projet :

```bash
git clone https://github.com/salwagit/music-project-v3.git
cd music-project-v3
```

---

## 🚀 Installation & Démarrage

Lancer tous les services avec Docker :

```bash
docker compose up -d      # Build et démarrage
docker compose logs -f   # Voir les logs en temps réel
```

---

## 🌐 Accès aux services

| Service       | URL                                            |
| ------------- | ---------------------------------------------- |
| Application   | [http://localhost:3000](http://localhost:3000) |
| Mongo Express | [http://localhost:8081](http://localhost:8081) |
| MongoDB       | localhost:27017                                |

---

## 🏗️ Architecture

### 📦 Containers

1. **top-songs-app**

   * Application Node.js (Express)
   * Exécute `app.js`

2. **mongodb**

   * Image officielle MongoDB (version 6)
   * Données persistées via volume Docker

3. **mongo-express**

   * Interface web pour gérer MongoDB
   * Accessible via navigateur

---

### 🌐 Réseau Docker

* Réseau : `musicnet` (bridge)
* Communication interne :

```bash
mongodb://mongo:27017/musicdb
```

---

## 🐳 Dockerfile (Résumé)

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

---

## 🧪 Tests

1. Ouvrir l’application :

   ```
   http://localhost:3000
   ```

2. Vérifier les données via Mongo Express :

   ```
   http://localhost:8081
   ```

---

## 🛑 Arrêt et nettoyage

```bash
docker compose down        # Arrêter les conteneurs
docker compose down -v     # Supprimer aussi les volumes
docker system prune -f     # Nettoyage global Docker
```

---

## 🔧 Troubleshooting

* ❌ **MongoDB non prêt**

  * Attendre quelques secondes (retry automatique dans le code)

* ❌ **Ports déjà utilisés**

  * Modifier les ports dans `docker-compose.yml`

* 🔍 **Voir les logs**

  ```bash
  docker compose logs app
  ```

* 🔄 **Rebuild complet**

  ```bash
  docker compose up --build -d
  ```

* ⚠️ **Warning version docker-compose**

  * Supprimer `version: "3.9"` si nécessaire

---

## 📁 Structure du projet

```
music-project-v3/
├── app.js                 # Serveur Express
├── package.json           # Dépendances Node.js
├── public/                # Frontend statique
│   ├── index.html
│   └── style.css
├── Dockerfile             # Image de l'application
└── docker-compose.yml     # Orchestration des services
```

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`feature/ma-feature`)
3. Commit tes changements
4. Push et crée une Pull Request

