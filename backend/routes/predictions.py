import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, AnalysisLog
from ..schemas import PredictionRequest, PredictionResponse
from ..services.prediction_service import prediction_engine
import datetime

router = APIRouter(prefix="/api", tags=["Predictions & Risk Analysis"])

@router.post("/predict-risk", response_model=PredictionResponse)
def predict_project_risk(payload: PredictionRequest, db: Session = Depends(get_db)):
    """Runs live ML inference and explanation on any project parameter set (including sandbox/what-if)."""
    data = payload.dict()
    analysis = prediction_engine.predict(data)

    # If linked to an existing project, update project DB fields and log analysis history
    if payload.project_id:
        project = db.query(Project).filter(Project.id == payload.project_id).first()
        if project:
            analysis["project_name"] = project.name
            project.risk_level = analysis["risk_level"]
            project.health_score = analysis["health_score"]
            project.predicted_delay_months = analysis["predicted_delay_months"]
            project.predicted_cost_overrun_percentage = analysis["predicted_cost_overrun_percentage"]
            project.confidence = analysis["confidence"]
            project.last_analyzed = datetime.datetime.utcnow()

            # Record analysis log
            log = AnalysisLog(
                project_id=project.id,
                risk_level=analysis["risk_level"],
                confidence=analysis["confidence"],
                predicted_delay_months=analysis["predicted_delay_months"],
                predicted_cost_overrun_percentage=analysis["predicted_cost_overrun_percentage"],
                health_score=analysis["health_score"],
                risk_factors=json.dumps(analysis["risk_factors"]),
                recommendations=json.dumps(analysis["recommendations"]),
                timeline_projections=json.dumps(analysis["timeline_projections"]),
                created_at=datetime.datetime.utcnow()
            )
            db.add(log)
            db.commit()

    return analysis

@router.get("/projects/{project_id}/analysis", response_model=PredictionResponse)
def get_project_analysis(project_id: int, db: Session = Depends(get_db)):
    """Retrieves or executes fresh AI Risk Analysis for a specific project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = {
        "id": project.id,
        "name": project.name,
        "category": project.category,
        "project_cost": project.project_cost,
        "planned_duration_months": project.planned_duration_months,
        "planned_progress": project.planned_progress,
        "actual_progress": project.actual_progress,
        "expenditure_percentage": project.expenditure_percentage,
        "resource_availability": project.resource_availability,
        "material_availability": project.material_availability,
        "workforce_availability": project.workforce_availability,
        "contractor_performance": project.contractor_performance,
        "delay_days": project.delay_days,
        "milestone_completion_rate": project.milestone_completion_rate,
        "change_requests": project.change_requests,
        "weather_impact": project.weather_impact,
        "previous_delay_count": project.previous_delay_count,
        "risk_history": project.risk_history
    }

    analysis = prediction_engine.predict(project_data)

    # Save to AnalysisLog
    log = AnalysisLog(
        project_id=project.id,
        risk_level=analysis["risk_level"],
        confidence=analysis["confidence"],
        predicted_delay_months=analysis["predicted_delay_months"],
        predicted_cost_overrun_percentage=analysis["predicted_cost_overrun_percentage"],
        health_score=analysis["health_score"],
        risk_factors=json.dumps(analysis["risk_factors"]),
        recommendations=json.dumps(analysis["recommendations"]),
        timeline_projections=json.dumps(analysis["timeline_projections"]),
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    project.last_analyzed = datetime.datetime.utcnow()
    db.commit()

    return analysis
