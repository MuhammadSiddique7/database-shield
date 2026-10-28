# 🛡️ Database Shield

**Protect Every Query.**

1

---

## 🏗️ Architecture

```
Developer Application
        ↓
Database Shield SDK (Node.js, etc.)
        ↓
Database Shield API (Node.js/Express)
        ↓
Python Detection Engine (FastAPI)
        ↓
    ALLOW or BLOCK
        ↓
Developer Application Context
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT |
| Detection | Python, FastAPI, Rule-based SQL Analysis |

## 📁 Project Structure

```
database-shield/
├── backend/          # Node.js Express API
├── detection-engine/ # Python FastAPI SQL Detection
├── frontend/         # React Vite Frontend
├── packages/         # Developer Integration Platform
│   └── node-sdk/     # Official Node.js SDK
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Python Engine
cd ../detection-engine
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env` files in each directory and configure:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/database-shield
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PYTHON_ENGINE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

### 3. Start Services

```bash
# Terminal 1 - Python Detection Engine
cd detection-engine
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Backend API
cd backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 4. Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Detection Engine**: http://localhost:8000

## 🔌 API Usage

### Analyze a Query

```bash
curl -X POST http://localhost:5000/api/analyze-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM users WHERE id = 1 OR 1=1",
    "databaseType": "MySQL",
    "ip": "192.168.1.1",
    "projectApiKey": "ds_live_your_api_key_here"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "status": "block",
    "risk": "high",
    "confidence": 94.5,
    "reason": "SQL Injection Detected: Boolean-based injection",
    "threats": [
      {
        "type": "Boolean Injection",
        "description": "OR 1=1 tautology detected",
        "severity": "high"
      }
    ]
  }
}
```

## 📋 Features

- ✅ User Authentication (Register, Login, JWT, Password Reset)
- ✅ Project Management with API Key Generation
- ✅ SQL Injection Detection (30+ patterns)
- ✅ Developer Integration Platform (Official Node.js SDK)
- ✅ Real-time Query Analysis API
- ✅ Dashboard with Charts & Statistics
- ✅ Comprehensive Query Logging
- ✅ API Documentation Portal
- ✅ Professional Landing Page
- ✅ Fully Responsive Design
- ✅ Dark Cybersecurity Theme

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
