"""
PAIMANA - Project Assessment, Intelligence, Monitoring & Analytics
FastAPI Backend Application Entrypoint
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import projects, predictions, dashboard, alerts
from .seed_data import seed_database
from .models import Project

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PAIMANA API",
    description="AI-Powered Infrastructure Project Monitoring & Risk Prediction Platform (SIH 2026)",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(projects.router)
app.include_router(predictions.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty
    from .database import SessionLocal
    db = SessionLocal()
    count = db.query(Project).count()
    db.close()
    if count == 0:
        print("Database is empty. Initializing with sample infrastructure projects...")
        seed_database()

@app.get("/")
def root():
    return {
        "platform": "PAIMANA",
        "tagline": "AI-Powered Infrastructure Project Monitoring & Risk Prediction",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
        "hackathon": "Smart India Hackathon (SIH) 2026"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "PAIMANA Backend API"}

if __name__ == "__main__":
    import uvicorn
    import sys
    # Ensure project root is in sys.path when executed directly
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
