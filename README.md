# 🚀 Watsshap - Application de Messagerie NoSQL

Une application de messagerie moderne inspirée de WhatsApp, construite avec Node.js, React et Prisma.

## 🎯 Cas d'Usage NoSQL

**Watsshap** démontre les avantages des bases de données NoSQL pour les applications de messagerie :

- **Flexibilité des schémas** : Messages avec métadonnées variables
- **Performance** : Requêtes rapides sur gros volumes
- **Scalabilité** : Support de millions d'utilisateurs
- **Relations complexes** : Conversations, groupes, participants

## 🛠️ Technologies

### Backend
- **Node.js** + Express
- **Prisma** ORM
- **SQLite** (prêt pour MongoDB)
- **API REST** complète

### Frontend
- **React** + Vite
- **Axios** pour les appels API
- **Lucide React** pour les icônes
- **CSS moderne** avec design WhatsApp-like

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/watsshap.git
cd watsshap

# Installer les dépendances
npm install

# Installer les dépendances du frontend
cd watsshap-frontend
npm install
cd ..

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Build du frontend
cd watsshap-frontend
npm run build
cd ..

# Démarrer l'application
npm run dev
```

## 📱 Fonctionnalités

- ✅ **Création d'utilisateurs** avec profil complet
- ✅ **Conversations 1-1** en temps réel
- ✅ **Groupes de discussion** avec rôles
- ✅ **Messages** texte, images, fichiers
- ✅ **Interface responsive** mobile/desktop
- ✅ **Design WhatsApp-like** moderne

## 🗄️ Schéma de Base de Données

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String?
  email     String?  @unique
  phone     String?  @unique
  avatar    String?
  // Relations avec messages, conversations, groupes
}

model Conversation {
  id        Int      @id @default(autoincrement())
  name      String?  // Pour les groupes
  type      String   @default("direct") // "direct" ou "group"
  // Relations avec participants et messages
}

model Message {
  id             Int      @id @default(autoincrement())
  content        String
  type           String   @default("text") // "text", "image", "file"
  senderId       Int
  conversationId Int
  // Relations avec sender et conversation
}
```

## 🌐 API Endpoints

### Utilisateurs
- `POST /user` - Créer un utilisateur
- `GET /byId/:id` - Récupérer un utilisateur

### Conversations
- `POST /conversation/direct` - Créer conversation 1-1
- `GET /conversation/:id/messages` - Récupérer messages

### Messages
- `POST /message` - Envoyer un message

### Groupes
- `POST /group` - Créer un groupe

## 🎨 Interface

L'interface reproduit fidèlement l'expérience WhatsApp :
- **Sidebar** avec liste des utilisateurs
- **Chat en temps réel** avec bulles de messages
- **Design responsive** pour mobile et desktop
- **Animations CSS** fluides

## 🔧 Arguments Techniques NoSQL

### 1. Flexibilité des Schémas
- Messages avec types variables (texte, image, fichier)
- Métadonnées dynamiques sans migration

### 2. Performance
- Requêtes optimisées avec `include` Prisma
- Indexation automatique des relations

### 3. Scalabilité
- Architecture prête pour MongoDB
- Support de millions d'utilisateurs simultanés

### 4. Relations Complexes
- Conversations avec participants multiples
- Groupes avec rôles (admin/membre)
- Messages avec expéditeurs et timestamps

## 📊 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Database      │
│   React + Vite  │◄──►│   Node.js +      │◄──►│   SQLite        │
│   WhatsApp-like │    │   Express +      │    │   (MongoDB      │
│                 │    │   Prisma         │    │    ready)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Déploiement

### Local
```bash
npm run dev
# API disponible sur http://localhost:3000
```

### Production
```bash
# Démarrer en production
npm start
```

## 📝 Présentation NoSQL

Ce projet démontre parfaitement les cas d'usage NoSQL :

1. **Données non-structurées** : Messages avec métadonnées variables
2. **Relations complexes** : Conversations, groupes, participants
3. **Performance** : Requêtes rapides sur gros volumes
4. **Scalabilité** : Architecture prête pour MongoDB

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Koman** - Développeur Full-Stack
- GitHub: [@komanboni](https://github.com/komanboni)

---

**Watsshap** - Démonstration NoSQL avec Node.js + Prisma 🚀
