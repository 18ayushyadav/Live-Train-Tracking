# Where Is My Train 🚂

> An **offline-first, full-stack Indian Railways tracker** — Flutter mobile app + React web companion + Node.js/Firebase backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Flutter](https://img.shields.io/badge/Flutter-3.x-blue?logo=flutter) ![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js) ![Firebase](https://img.shields.io/badge/Firebase-enabled-orange?logo=firebase)

---

## ✨ Features

| Feature | Flutter App | React Web |
|---------|-------------|-----------|
| Live train position (API) | ✅ | ✅ |
| Offline position via cell towers | ✅ Android | ❌ |
| PNR status | ✅ | ✅ |
| Leaflet / flutter_map | ✅ | ✅ |
| Hindi / English i18n | ✅ | ✅ |
| WebSocket live feed | ✅ | ✅ |
| Arrival alarm | ✅ | Planned |
| Crowdsource cell towers | ✅ (opt-in) | — |

---

## 📁 Project Structure

```
Train location/
├── train-tracker-backend/   # Node.js + Express + Firebase + Socket.io
├── train_tracker_app/       # Flutter app (Android / Web)
├── train-tracker-web/       # React + Vite website
└── scripts/                 # Seed data scripts
```

---

## 🚀 Quick Start

### 1 — Backend
```bash
cd train-tracker-backend
cp .env.example .env        # fill in your API keys
npm install
npm run dev                 # starts on :3001
```

### 2 — React Web
```bash
cd train-tracker-web
cp .env.example .env        # set VITE_API_URL
npm install
npm run dev                 # starts on :5173
```

### 3 — Flutter App
```bash
cd train_tracker_app
flutter pub get
flutter run                 # Android emulator or device
```

---

## ⚙️ Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `RAILWAY_API_KEY` | backend `.env` | indianrailapi.com key |
| `FIREBASE_*` | backend `.env` | Firebase Admin credentials |
| `PORT` | backend `.env` | Server port (default 3001) |
| `VITE_API_URL` | web `.env` | Backend URL for React app |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/train/:no` | Live train status |
| GET | `/api/train/:no/schedule` | Full schedule |
| GET | `/api/pnr/:no` | PNR status |
| GET | `/api/stations?q=` | Station search |
| POST | `/api/towers/upload` | 🔒 Upload cell tower (auth) |
| WS  | `socket.io` | Real-time train feed |

---

## 📱 Offline Mode (Flutter)

The Flutter app reads cell tower IDs via `TelephonyManager` and matches them against a bundled SQLite database of **40+ towers mapped to rail corridors**. A weighted centroid of nearby towers is computed to estimate the train's position without any internet connection.

See [`cell_tower_service.dart`](train_tracker_app/lib/services/cell_tower_service.dart) and [`seed_towers.json`](train_tracker_app/assets/data/seed_towers.json).

---

## 📖 Docs

- [DEPLOY.md](DEPLOY.md) — Deployment instructions (Firebase, Vercel, Play Store, APK)
- [PRIVACY.md](PRIVACY.md) — Privacy policy and data handling

---

## ⚠️ Disclaimer

This project is **not affiliated with Indian Railways or IRCTC**. Live data is sourced from third-party APIs and may not always be accurate.
