# LeetGuide 🚀

> **🌐 Live Demo**: [https://leetguide.netlify.app/](https://leetguide.netlify.app/)  
> **🔗 Backend API**: [https://leetguide-backend-puq1.onrender.com](https://leetguide-backend-puq1.onrender.com)

An interactive, professional dashboard for LeetCode analytics with smart recommendations and user comparisons.

## 🎯 Project Overview

LeetGuide is a comprehensive analytics platform that:
- **Visualizes** user LeetCode stats with intuitive charts
- **Recommends** next ideal questions using NLP
- **Compares** two users side-by-side in depth
- **Tracks** progress and identifies improvement areas

## � Live Deployment

- **Frontend**: Deployed on [Netlify](https://leetguide.netlify.app/)
- **Backend**: Deployed on [Render](https://leetguide-backend-puq1.onrender.com)
- **Status**: ✅ Production Ready
- **Last Updated**: August 2025

## �🏗️ Architecture

```
LeetGuide/
├── frontend/          # React + Vite + Tailwind CSS → Netlify
├── backend/           # Node.js + Express + MongoDB → Render
├── nlp-service/       # Python + FastAPI + Gemini API
└── docs/              # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + Material-UI
- **Charts**: Chart.js + MUI X-Charts
- **Routing**: React Router v7
- **Deployment**: Netlify

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB (planned)
- **API**: RESTful endpoints
- **Deployment**: Render

### NLP Service
- **Framework**: Python FastAPI
- **AI**: Gemini API for intelligent recommendations
- **ML**: Problem similarity analysis
- **Embeddings**: Smart content matching

## 🚀 Features

### ✅ Phase 1: Core Dashboard (Completed)
- ✅ User stats visualization
- ✅ Difficulty distribution charts
- ✅ Submission timeline
- ✅ Tag analysis
- ✅ SEO optimization
- ✅ PWA features
- ✅ Production deployment

### 🚧 Phase 2: User Comparison (In Progress)
- ✅ Side-by-side comparison UI
- ✅ Strength/weakness analysis
- ⏳ Progress trends
- ⏳ Shared problems analysis

### 📋 Phase 3: Smart Recommendations (Planned)
- ⏳ NLP-powered suggestions
- ⏳ Weakness-based recommendations
- ⏳ Difficulty progression
- ⏳ Topic-based filtering

### 🎯 Phase 4: Advanced Features (Future)
- ⏳ User profiles & preferences
- ⏳ Daily activity heatmaps
- ⏳ Achievement system
- ⏳ Export capabilities

## 🏃‍♂️ Quick Start

### Try it Live
Visit [https://leetguide.netlify.app/](https://leetguide.netlify.app/) to use the app immediately!

### Local Development

#### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

#### Setup

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

# NLP Service (Optional)
cd ../nlp-service
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env file
uvicorn main:app --reload
```

#### Environment Setup

1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Configure NLP Service**: 
   ```bash
   cd nlp-service
   cp .env.example .env
   # Edit .env and add: GEMINI_API_KEY=your_actual_key_here
   ```
3. **Start Services**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001  
   - NLP Service: http://localhost:8000

## � Deployment

### Production URLs
- **Frontend**: https://leetguide.netlify.app/
- **Backend**: https://leetguide-backend-puq1.onrender.com

### Deployment Stack
- **Frontend**: Netlify (Auto-deploy from main branch)
- **Backend**: Render (Auto-deploy from main branch)
- **Domain**: Custom domain ready
- **SSL**: Automatically provisioned

### Environment Variables
```bash
# Frontend (Netlify)
VITE_API_URL=https://leetguide-backend-puq1.onrender.com
NODE_VERSION=20

# Backend (Render)
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://leetguide.netlify.app,https://leetguide-app.netlify.app
```

## �📈 Development Progress

This project follows a modular development approach with comprehensive SEO optimization, PWA features, and production-ready deployment.

### Recent Updates
- ✅ Complete SEO implementation with meta tags, Open Graph, Twitter Cards
- ✅ PWA features with service worker and manifest
- ✅ Production deployment on Netlify + Render
- ✅ Performance optimization and caching strategies
- ✅ Social sharing and structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Om Kumar** - [GitHub](https://github.com/OmKumar07)

---

**Built with ❤️ for the LeetCode community**

---

⭐ **Star this repo if you find it helpful!**