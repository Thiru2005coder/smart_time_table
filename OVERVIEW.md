# SmartTimetable — System Overview

**SmartTimetable** is a next-generation, institutional-grade automated academic scheduling and timetable management platform. Designed specifically to meet the rigorous accreditation standards and operational workflows of Indian and international universities, engineering colleges, autonomous degree colleges, junior/intermediate colleges, and schools.

---

## 1. System Vision & Objective

Academic scheduling in colleges and universities is an NP-hard combinatorial optimization challenge:
- Hundreds of faculty members with varying workloads and leave availabilities.
- Dozens of student batches and sections across multiple semesters and branches.
- Specialized laboratories (Computer, Electrical, Chemistry, Physics) with limited capacities.
- Strict regulatory norms (AICTE, UGC, BIE, State Technical Boards) specifying credit hours, lecture-to-lab ratios, continuous 2-to-3-period laboratory blocks, and mandatory lunch gaps.

**SmartTimetable** bridges mathematical constraint optimization (Google OR-Tools), generative artificial intelligence (Google Gemini 1.5 Flash), and an authentic, institutional-grade web interface to deliver:
1. **Conflict-Free Automatic Scheduling**: Eliminates double-booking of teachers, rooms, and batches in seconds.
2. **Multi-Institution Flexibility**: Native out-of-the-box support for Engineering Colleges (B.Tech), Autonomous Universities, Degree Colleges (B.Com/B.Sc), Intermediate Colleges (Junior Colleges), and Secondary Schools.
3. **Official Institutional Sheet Formatting**: Produces government and university regulation-compliant timetable printouts matching real college standards (headers, meta table, yellow LUNCH rowspan column, multi-period lab blocks, and course-faculty reference tables).
4. **Natural Language AI Assistance**: Interactive conversational AI powered by Google Gemini to analyze timetable bottlenecks, suggest substitutions, and diagnose scheduling conflicts.

---

## 2. High-Level Architecture

SmartTimetable follows a clean decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT                          │
│                                                                 │
│  ┌───────────────────────┐  ┌────────────────────────────────┐  │
│  │ Single-File HTML5 App │  │ Modular Architecture (api.js,  │  │
│  │ SmartTimetable.html   │  │ style.css)                     │  │
│  └───────────┬───────────┘  └───────────────┬────────────────┘  │
└──────────────┼──────────────────────────────┼───────────────────┘
               │ JSON / REST API              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES (FastAPI)                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ REST Endpoints: /auth, /faculty, /subjects, /rooms,       │  │
│  │ /batches, /timetables, /scheduling, /reports, /ai         │  │
│  └─────────────┬─────────────────────────────┬───────────────┘  │
│                │                             │                  │
│                ▼                             ▼                  │
│  ┌───────────────────────────┐ ┌─────────────────────────────┐  │
│  │ Google OR-Tools Engine    │ │ Google Gemini 1.5 Flash AI  │  │
│  │ - Hard Constraints Check  │ │ - Conflict Diagnostic Chat  │  │
│  │ - CP-SAT Solver Algorithm │ │ - Natural Language Query    │  │
│  │ - Workload Distribution   │ │ - Smart Recommendations     │  │
│  └─────────────┬─────────────┘ └─────────────┬───────────────┘  │
└────────────────┼─────────────────────────────┼──────────────────┘
                 │                             │
                 ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE & AUTHENTICATION                    │
│                                                                 │
│  ┌───────────────────────────┐ ┌─────────────────────────────┐  │
│  │ MongoDB Atlas             │ │ Supabase / JWT Auth         │  │
│  │ (Async Motor Client)      │ │ Role-Based Access Control   │  │
│  └───────────────────────────┘ └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Feature Modules

| Module | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Student Timetable (`#stt`)** | Official college master timetable sheet | 1-click institution switcher, LUNCH spanning, 2-period lab blocks, course-faculty reference table, landscape print. |
| **Faculty Timetable (`#ftt`)** | Personal weekly teaching schedule | Per-teacher weekly workload breakdown, assigned lecture rooms, lab allocations, total hours. |
| **Room Timetable (`#rtt`)** | Room and lab occupancy tracker | Free-slot discovery, classroom seating audit, lab hardware capacity checks. |
| **Scheduling Engine** | Automatic schedule generation | OR-Tools CP-SAT constraint solver, slot availability matching, faculty limit respect. |
| **Interactive Editor** | Manual drag-and-move fine tuning | Reassign slots with live conflict validator and instant rollbacks. |
| **Version & Approval** | Academic governance workflow | Draft creation, HOD submission, Dean/Principal review, 1-click publishing. |
| **Gemini AI Assistant** | Conversational scheduling intelligence | Explain conflicts in plain English, recommend teacher substitutions for leaves. |
| **Master Data Management** | Comprehensive resource directory | Departments, Faculty, Subjects (Lecture/Lab), Batches/Sections, Rooms, Teaching Requirements. |

---

## 4. Documentation Index

For detailed documentation, explore the specialized guides in the `readme/` directory:

1. [Frontend Guide](./FRONTEND_GUIDE.md) — UI structure, templates, styling, and official sheet renderer.
2. [Backend API Specification](./BACKEND_API.md) — FastAPI route catalog, endpoints, schemas, and status codes.
3. [Scheduling & Constraint Engine](./SCHEDULING_ENGINE.md) — Constraint programming, CP-SAT solver, and conflict rules.
4. [Gemini AI Integration](./GEMINI_AI_INTEGRATION.md) — Natural language AI workflows, prompt engineering, and assistants.
5. [Database Models & Schemas](./DATABASE_MODELS.md) — MongoDB collections, document structures, and indexes.
6. [Roles & Permissions (RBAC)](./ROLES_AND_PERMISSIONS.md) — Role definitions (Dean, HOD, Faculty, Student) and access matrices.
7. [Setup & Deployment Guide](./SETUP_AND_DEPLOYMENT.md) — Environment setup, Python virtualenv, dependencies, and deployment.
