"""
Traxis - Project Assessment, Intelligence, Monitoring & Analytics
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
    title="Traxis API",
    description="AI-Powered Infrastructure Project Monitoring & Risk Prediction Platform",
    version="1.0.0"
)

# CORS — in production, restrict to the deployed Vercel frontend URL.
# Set FRONTEND_URL env var on Render to e.g. https://paimana.vercel.app
# In dev (env var not set), allow all origins so local workflow is unaffected.
_frontend_url = os.environ.get("FRONTEND_URL", "")
_allowed_origins = (
    [_frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"]
    if _frontend_url
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
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
        "platform": "Traxis",
        "tagline": "AI-Powered Infrastructure Project Monitoring & Risk Prediction",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Traxis Backend API"}

if __name__ == "__main__":
    import uvicorn
    import sys
    # Ensure project root is in sys.path when executed directly
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)

