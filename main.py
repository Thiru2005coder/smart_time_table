"""
SmartTimetable — Main Application Entry Point

Complete backend server with:
- MongoDB database connectivity
- Supabase authentication
- Gemini AI integration
- Intelligent timetable scheduling
- Full REST API
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from contextlib import asynccontextmanager
import time
import os

from config import CORS_ORIGINS, check_db_connection, HOST, PORT

# Import all route modules
from routes import (
    auth,
    faculty,
    subjects,
    classrooms,
    batches,
    timeslots,
    departments,
    timetable,
    scheduling,
    substitution,
    reports,
    ai_assistant,
    notifications,
    constraints,
    teaching_requirements,
    audit_logs,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    # Startup
    print("=" * 60)
    print("  SmartTimetable Backend Starting...")
    print("=" * 60)

    db_ok = await check_db_connection()
    if not db_ok:
        print("WARNING: MongoDB connection failed. Check your MONGODB_URI.")

    print(f"  CORS origins: {CORS_ORIGINS}")
    print(f"  Server: http://{HOST}:{PORT}")
    print(f"  API Docs: http://{HOST}:{PORT}/docs")
    print("=" * 60)

    yield

    # Shutdown
    print("SmartTimetable Backend shutting down...")


# ========================
# Create FastAPI Application
# ========================
app = FastAPI(
    title="SmartTimetable API",
    description=(
        "Intelligent Faculty and Class Scheduling System. "
        "Automatically generates clash-free timetables using constraint optimization. "
        "Powered by Google OR-Tools and Gemini AI."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ========================
# CORS Middleware
# ========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================
# Request Logging Middleware
# ========================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round(time.time() - start, 3)

    if request.url.path not in ("/health", "/favicon.ico"):
        print(f"  {request.method} {request.url.path} → {response.status_code} ({duration}s)")

    return response


# ========================
# Global Exception Handler
# ========================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"  ERROR: {request.method} {request.url.path} — {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )


# ========================
# Register All Routes (Dual prefix: /api/... and direct specifications)
# ========================
# Core API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(departments.router, prefix="/api/departments", tags=["Departments"])
app.include_router(faculty.router, prefix="/api/faculty", tags=["Faculty"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(classrooms.router, prefix="/api/classrooms", tags=["Classrooms"])
app.include_router(batches.router, prefix="/api/batches", tags=["Batches"])
app.include_router(timeslots.router, prefix="/api/timeslots", tags=["Time Slots"])
app.include_router(teaching_requirements.router, prefix="/api/teaching-requirements", tags=["Teaching Requirements"])
app.include_router(timetable.router, prefix="/api/timetable", tags=["Timetable"])
app.include_router(scheduling.router, prefix="/api/scheduling", tags=["Scheduling"])
app.include_router(constraints.router, prefix="/api/constraints", tags=["Constraint Analysis"])
app.include_router(substitution.router, prefix="/api/substitution", tags=["Substitution"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(ai_assistant.router, prefix="/api/ai", tags=["AI Assistant"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(audit_logs.router, prefix="/api/audit-logs", tags=["Audit Logs"])

# Direct Spec Endpoints (Mounting directly for SmartTimetable specification parity)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(departments.router, prefix="/departments", tags=["Departments"])
app.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(classrooms.router, prefix="/rooms", tags=["Rooms"])
app.include_router(batches.router, prefix="/batches", tags=["Batches"])
app.include_router(timeslots.router, prefix="/time-slots", tags=["Time Slots"])
app.include_router(teaching_requirements.router, prefix="/teaching-requirements", tags=["Teaching Requirements"])
app.include_router(timetable.router, prefix="/timetables", tags=["Timetables"])
app.include_router(scheduling.router, prefix="/timetable-jobs", tags=["Timetable Jobs"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(audit_logs.router, prefix="/audit-logs", tags=["Audit Logs"])


# ========================
# Frontend Static Files & Serving
# ========================
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_dir):
    from fastapi.staticfiles import StaticFiles
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")


# ========================
# Root, App and Health Endpoints
# ========================
def get_primary_frontend_path():
    candidates = [
        os.path.join(frontend_dir, "SmartTimetable (1).html"),
        os.path.join(frontend_dir, "index.html"),
        os.path.join(frontend_dir, "login.html"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None


@app.get("/", tags=["System"])
async def root(request: Request):
    accept = request.headers.get("accept", "")
    target = get_primary_frontend_path()
    if "text/html" in accept and target:
        return FileResponse(target)
    return {
        "name": "SmartTimetable API",
        "version": "1.0.0",
        "description": "Intelligent Faculty and Class Scheduling System with Gemini AI",
        "app_ui": "/app",
        "portal_ui": "/portal",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/app", response_class=FileResponse, tags=["Frontend"])
@app.get("/login", response_class=FileResponse, tags=["Frontend"])
@app.get("/portal", response_class=FileResponse, tags=["Frontend"])
async def serve_frontend_page():
    target = get_primary_frontend_path()
    if target:
        return FileResponse(target)
    return JSONResponse(status_code=404, content={"detail": "Frontend HTML file not found"})


@app.get("/health", tags=["System"])
async def health_check():
    db_ok = await check_db_connection()
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "gemini_ai": "ready",
        "api": "running",
    }


# ========================
# Run the server
# ========================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level="info",
    )
