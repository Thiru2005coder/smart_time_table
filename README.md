# SmartTimetable

> **Automated Academic Timetable Scheduling Platform for Universities, Engineering Colleges, Autonomous Institutions, Degree Colleges, Junior Colleges, and Schools.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue.svg?logo=python)](https://www.python.org)
[![Google OR-Tools](https://img.shields.io/badge/Google%20OR--Tools-9.8-4285F4.svg?logo=google)](https://developers.google.com/optimization)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-8E75C4.svg?logo=google)](https://ai.google.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

**SmartTimetable** is a comprehensive full-stack academic scheduling platform designed to solve the complex mathematical challenge of institution-wide timetable generation. It adheres strictly to accredited university guidelines (AICTE, UGC, BIE, State Technical Boards) and generates authentic, print-ready institutional timetable sheets.

---

## 🚀 Key Features

- **🏛️ Multi-Institution Architecture**:
  - **Engineering College (B.Tech)** *(Geethanjali College format)*
  - **University (Autonomous B.Tech / Computing)**
  - **Degree College (B.Com / B.Sc)**
  - **Intermediate College (Junior College MPC)**
  - **Senior Secondary School (CBSE / State Board)**
- **📑 Authentic Institutional Sheet View**:
  - College header with department title and semester details.
  - Bordered metadata box with highlighted room numbers, class teacher, version, and W.E.F.
  - Periodic timetable grid with **full-spanning yellow LUNCH column (`rowspan="6"`)**.
  - **Contiguous 2-to-3-period laboratory blocks (`colspan="2"`)** highlighted in gold.
  - Standard bottom **Course-Faculty Reference Table** with subject codes, names, faculty incharge, and weekly period counts.
  - 4-slot official designation signature footer (Class Teacher, Coordinator, HOD, Principal/Dean).
- **⚡ Dual Scheduling Engine**:
  - **Google OR-Tools CP-SAT Solver**: Solves thousands of multi-variable constraints without faculty, batch, or room double-booking.
  - **In-Memory Interactive Editor**: Move sessions live with real-time conflict diagnostics.
- **🤖 Google Gemini 1.5 Flash AI Assistant**:
  - Plain-English root cause analysis for scheduling deadlocks.
  - Smart teacher substitution recommendations for faculty on leave.
  - Natural language schedule discovery.
- **🖨️ Landscape Print / PDF Engine**:
  - 1-click clean export formatted for landscape A4/Legal paper.
  - Automatically suppresses navigation controls and background styling.
- **🔐 Enterprise Role-Based Access Control (RBAC)**:
  - Dean / Principal, Head of Department (HOD), Faculty, and Student workflows.

---

## 📂 Project Structure

```
cvr/
├── README.md                      # Primary project overview and documentation portal
├── readme/                        # Comprehensive documentation suite
│   ├── OVERVIEW.md                # System vision, architecture, and core modules
│   ├── FRONTEND_GUIDE.md          # UI layout, templates, design tokens, and print setup
│   ├── BACKEND_API.md             # Complete REST API reference, endpoints, and schemas
│   ├── SCHEDULING_ENGINE.md       # CSP formulation, OR-Tools solver, and hard constraints
│   ├── GEMINI_AI_INTEGRATION.md   # Gemini AI assistant, prompts, and substitution engine
│   ├── DATABASE_MODELS.md         # MongoDB collections, Pydantic schemas, and indexes
│   ├── ROLES_AND_PERMISSIONS.md   # RBAC permissions matrix and demo accounts
│   └── SETUP_AND_DEPLOYMENT.md    # Installation, local setup, and production deployment
├── frontend/                      # Client web applications and assets
│   ├── SmartTimetable (1).html    # Complete responsive SPA with official timetable sheets
│   ├── api.js                     # Centralized API service client
│   └── style.css                  # Modern UI design system
└── backend/                       # FastAPI asynchronous application
    ├── main.py                    # Server entry point & CORS configuration
    ├── config.py                  # Database connection, Supabase & Gemini AI setup
    ├── requirements.txt           # Python dependency specifications
    ├── models/                    # Pydantic & MongoDB models
    ├── routes/                    # API route handlers
    └── services/                  # Scheduling algorithms & AI services
```

---

## ⚡ Quick Start

### 1. Run the Frontend (Instant Standalone)
Open [`frontend/SmartTimetable (1).html`](file:///c:/Users/K.THIRUPATHI/OneDrive/Desktop/cvr/frontend/SmartTimetable%20%281%29.html) directly in any web browser, or serve it locally:

```bash
python -m http.server 3000 --directory frontend
```
Visit `http://localhost:3000/SmartTimetable%20(1).html`

### 2. Run the Backend API (FastAPI)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs available at: `http://localhost:8000/docs`

---

## 👥 Demo Accounts

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Principal / Dean** | `head@geethanjali.edu.in` | `dean123` | Full Administrative Privileges |
| **HOD (CSE)** | `hod.cse@geethanjali.edu.in` | `hod123` | CSE Department Management |
| **Faculty (Teacher)** | `teacher@geethanjali.edu.in` | `fac123` | Personal Timetable (`S Ramanjaneyulu`) |
| **Student (Section J)** | `student@geethanjali.edu.in` | `stu123` | Section J Timetable (`II-B.Tech-I-Sem-J`) |

---

## 📖 In-Depth Documentation

For detailed technical specifications, explore the guides in the [`readme/`](file:///c:/Users/K.THIRUPATHI/OneDrive/Desktop/cvr/readme) directory:

- [System Overview](readme/OVERVIEW.md)
- [Frontend & UI Guide](readme/FRONTEND_GUIDE.md)
- [Backend REST API Reference](readme/BACKEND_API.md)
- [Constraint & Scheduling Engine](readme/SCHEDULING_ENGINE.md)
- [Gemini AI Integration](readme/GEMINI_AI_INTEGRATION.md)
- [Database Models & Schemas](readme/DATABASE_MODELS.md)
- [Roles & Permissions (RBAC)](readme/ROLES_AND_PERMISSIONS.md)
- [Setup & Deployment Guide](readme/SETUP_AND_DEPLOYMENT.md)
