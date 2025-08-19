# LeetGuide 🚀

An interactive, professional dashboard for LeetCode analytics with smart recommendations and user comparisons.

## 🎯 Project Overview

LeetGuide is a comprehensive analytics platform that:
- **Visualizes** user LeetCode stats with intuitive charts
- **Recommends** next ideal questions using NLP
- **Compares** two users side-by-side in depth
- **Tracks** progress and identifies improvement areas

## 🏗️ Architecture

```
LeetGuide/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB
├── nlp-service/       # Python + FastAPI + Gemini API
└── docs/              # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + ApexCharts
- **State**: React Context + Hooks

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **API**: RESTful + WebSocket

### NLP Service
- **Framework**: Python FastAPI
- **AI**: Gemini API
- **ML**: Hugging Face Transformers
- **Embeddings**: Sentence Transformers

## 🚀 Features

### Phase 1: Core Dashboard ✅
- [ ] User stats visualization
- [ ] Difficulty distribution charts
- [ ] Submission timeline
- [ ] Tag analysis

### Phase 2: User Comparison
- [ ] Side-by-side comparison
- [ ] Strength/weakness analysis
- [ ] Progress trends
- [ ] Shared problems analysis

### Phase 3: Smart Recommendations
- [ ] NLP-powered suggestions
- [ ] Weakness-based recommendations
- [ ] Difficulty progression
- [ ] Topic-based filtering

### Phase 4: Advanced Features
- [ ] User profiles & preferences
- [ ] Daily activity heatmaps
- [ ] Achievement system
- [ ] Export capabilities

## 🏃‍♂️ Quick Start

```bash
# Clone and setup
git clone https://github.com/OmKumar07/LeetGuide.git
cd LeetGuide

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
npm install
npm run dev

# NLP Service
cd ../nlp-service
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📈 Development Progress

This project follows a modular development approach with 30+ focused commits tracking each feature implementation.

---

**Built with ❤️ for the LeetCode community**