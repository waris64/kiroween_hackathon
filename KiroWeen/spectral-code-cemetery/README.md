# 🎃 SPECTRAL - Spooky Code Cemetery

> A Halloween-themed Git repository analyzer that visualizes code evolution in a haunting cemetery interface

## 🦇 About

SPECTRAL is a Kiroween hackathon project that transforms Git repository analysis into a spooky, interactive experience. Watch as your code's history comes alive in a haunted cemetery, where each tombstone represents a file, and ghostly spirits reveal the stories of code evolution.

## ✨ Features

- 👻 **Haunted Cemetery Visualization**: Interactive 3D cemetery interface
- 🔮 **AI-Powered Analysis**: Claude AI analyzes code patterns and evolution
- 📊 **Code Evolution Timeline**: Track how your code has changed over time
- 🎭 **Spooky Animations**: Framer Motion-powered ghostly effects
- 🌙 **Dark Theme**: Perfect for late-night coding sessions

## 🏗️ Project Structure

```
spectral-code-cemetery/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express API
├── shared/            # Shared types and constants
└── .kiro/            # Kiro specs and configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. Add your Google Gemini API key to `backend/.env`

### Running the Project

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- D3.js
- React Query

### Backend
- Node.js
- Express
- Google Gemini AI
- simple-git
- Winston (logging)

## 📝 License

MIT License - see LICENSE file for details

## 🎃 Kiroween Hackathon 2025

Built with 💀 for the Kiroween Hackathon
