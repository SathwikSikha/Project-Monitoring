from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, AnalysisLog
from ..schemas import ProjectResponse, ProjectCreate, ProjectUpdate
from ..services.prediction_service import prediction_engine
import datetime

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by project category"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (LOW, MEDIUM, HIGH, CRITICAL)"),
    search: Optional[str] = Query(None, description="Search by name, code, or location"),
    sort_by: Optional[str] = Query("risk", description="Sort by: risk, cost, progress, health, name"),
    order: Optional[str] = Query("desc", description="asc or desc"),
    db: Session = Depends(get_db)
):
    query = db.query(Project)

    if category and category.lower() != "all":
        query = query.filter(Project.category == category)
        
    if risk_level and risk_level.upper() != "ALL":
        query = query.filter(Project.risk_level == risk_level.upper())
        
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Project.name.ilike(search_pattern)) |
            (Project.code.ilike(search_pattern)) |
            (Project.location.ilike(search_pattern)) |
            (Project.contractor_name.ilike(search_pattern))
        )

    projects = query.all()

    # In-memory sorting for custom rank weights
    risk_weight = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
    reverse = (order.lower() == "desc")

    if sort_by == "risk":
        projects.sort(key=lambda p: risk_weight.get(p.risk_level, 0), reverse=reverse)
    elif sort_by == "health":
        projects.sort(key=lambda p: p.health_score, reverse=reverse)
    elif sort_by == "progress":
        projects.sort(key=lambda p: p.actual_progress, reverse=reverse)
    elif sort_by == "cost":
        projects.sort(key=lambda p: p.project_cost, reverse=reverse)
    elif sort_by == "delay":
        projects.sort(key=lambda p: p.predicted_delay_months, reverse=reverse)
    elif sort_by == "name":
        projects.sort(key=lambda p: p.name.lower(), reverse=reverse)

    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectResponse)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    # Generate code if missing
    count = db.query(Project).count() + 1
    code = project_in.code or f"PRJ-IND-NEW-{count:03d}"

    data_dict = project_in.dict()
    analysis = prediction_engine.predict(data_dict)

    project = Project(
        **data_dict,
        code=code,
        risk_level=analysis["risk_level"],
        health_score=analysis["health_score"],
        predicted_delay_months=analysis["predicted_delay_months"],
        predicted_cost_overrun_percentage=analysis["predicted_cost_overrun_percentage"],
        confidence=analysis["confidence"],
        last_analyzed=datetime.datetime.utcnow()
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project_in: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(project, field, val)

    # Re-evaluate AI predictions on update
    current_data = {c.name: getattr(project, c.name) for c in project.__table__.columns}
    analysis = prediction_engine.predict(current_data)
    
    project.risk_level = analysis["risk_level"]
    project.health_score = analysis["health_score"]
    project.predicted_delay_months = analysis["predicted_delay_months"]
    project.predicted_cost_overrun_percentage = analysis["predicted_cost_overrun_percentage"]
    project.confidence = analysis["confidence"]
    project.last_analyzed = datetime.datetime.utcnow()

    db.commit()
    db.refresh(project)
    return project
