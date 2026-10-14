# Setup & Deployment Guide

This guide provides step-by-step instructions to run **SmartTimetable** locally for development and deploy it into production environments.

---

## 1. Prerequisites

Before starting, ensure your system has:
- **Python 3.10+** (Python 3.11 or 3.12 recommended)
- **Node.js v18+** (Optional, for tooling or frontend preview servers)
- **MongoDB** (Local instance or free MongoDB Atlas cloud cluster)
- **Google Gemini API Key** (Optional, for AI assistant features)

---

## 2. Quick Local Run (Frontend Standalone)

The frontend application is completely self-sufficient and can run immediately in any modern web browser without a backend:

1. Navigate to the `frontend/` folder.
2. Double-click or open `SmartTimetable (1).html` in Chrome, Edge, Firefox, or Safari.
3. Or launch a local static server:
   ```bash
   python -m http.server 3000 --directory frontend
   ```
   Open `http://localhost:3000/SmartTimetable%20(1).html` in your browser.

---

## 3. Backend Setup (FastAPI & MongoDB)

### Step 1: Create and Activate Virtual Environment

**Windows (PowerShell)**:
```powershell
cd c:\Users\K.THIRUPATHI\OneDrive\Desktop\cvr\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

---

### Step 2: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 3: Configure Environment Variables (`.env`)

Create or update `.env` in the `backend/` directory:

```env
# ========================
# MongoDB Atlas / Local
# ========================
MONGODB_URI=mongodb://localhost:27017
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=smarttimetable

# ========================
# Google Gemini API
# ========================
GEMINI_API_KEY=your_gemini_api_key_here

# ========================
# Supabase Auth (Optional)
# ========================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ========================
# Application Settings
# ========================
SECRET_KEY=super-secret-jwt-key-for-session-tokens
APP_ENV=development
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5500,http://127.0.0.1:3000,http://127.0.0.1:5500
```

---

### Step 4: Start the Backend Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Output:
```
============================================================
  SmartTimetable Backend Starting...
============================================================
  MongoDB connection successful
  CORS origins: ['http://localhost:3000', 'http://localhost:5500']
  Server: http://0.0.0.0:8000
  API Docs: http://0.0.0.0:8000/docs
============================================================
```

Visit `http://localhost:8000/docs` to test interactive API calls.

---

## 4. Production Deployment

### Option A: Systemd + Gunicorn / Uvicorn (Linux Server)

Create `/etc/systemd/system/smarttimetable.service`:
```ini
[Unit]
Description=SmartTimetable FastAPI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/smarttimetable/backend
ExecStart=/var/www/smarttimetable/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### Option B: Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name timetable.yourcollege.edu;

    # Serve static frontend
    location / {
        root /var/www/smarttimetable/frontend;
        index "SmartTimetable (1).html";
        try_files $uri $uri/ /SmartTimetable\ \(1\).html;
    }

    # Proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Documentation
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
    }
}
```

---

## 5. Health Checks & Diagnostics

- **Backend Health Check**: `curl -s http://localhost:8000/health`
- **Database Status**: The server logs automatically report MongoDB ping latency upon startup.
- **AI Service Status**: If the Gemini API key is missing or invalid, the backend gracefully flags `gemini_model = None` without terminating the process.
