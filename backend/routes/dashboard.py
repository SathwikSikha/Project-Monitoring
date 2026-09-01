import json
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Project, AnalysisLog
from ..schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    total_projects = len(projects)

    if total_projects == 0:
        return {
            "total_projects": 0,
            "on_track_count": 0,
            "at_risk_count": 0,
            "critical_count": 0,
            "average_progress": 0.0,
            "average_health_score": 0.0,
            "projects_with_delay": 0,
            "total_budget_cr": 0.0,
            "risk_distribution": {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0},
            "category_distribution": {},
            "progress_overview": [],
            "cost_vs_progress": [],
            "projects_requiring_attention": [],
            "recent_analyses": []
        }

    on_track_count = sum(1 for p in projects if p.risk_level == "LOW")
    medium_count = sum(1 for p in projects if p.risk_level == "MEDIUM")
    high_count = sum(1 for p in projects if p.risk_level == "HIGH")
    critical_count = sum(1 for p in projects if p.risk_level == "CRITICAL")
    at_risk_count = medium_count + high_count + critical_count

    avg_progress = round(sum(p.actual_progress for p in projects) / total_projects, 1)
    avg_health = round(sum(p.health_score for p in projects) / total_projects, 1)
    delayed_count = sum(1 for p in projects if p.predicted_delay_months > 0.5 or p.delay_days > 10)
    total_budget = round(sum(p.project_cost for p in projects), 2)

    risk_dist = {
        "LOW": on_track_count,
        "MEDIUM": medium_count,
        "HIGH": high_count,
        "CRITICAL": critical_count
    }

    # Category distribution
    cat_dist = {}
    for p in projects:
        cat_dist[p.category] = cat_dist.get(p.category, 0) + 1

    # Progress Overview (Planned vs Actual for top projects)
    progress_overview = [
        {
            "id": p.id,
            "name": p.name[:25] + ("..." if len(p.name) > 25 else ""),
            "planned": p.planned_progress,
            "actual": p.actual_progress,
            "risk_level": p.risk_level
        }
        for p in sorted(projects, key=lambda x: x.planned_progress - x.actual_progress, reverse=True)[:8]
    ]

    # Cost vs Progress scatter/bubble data
    cost_vs_progress = [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "cost": p.project_cost,
            "actual_progress": p.actual_progress,
            "expenditure": p.expenditure_percentage,
            "risk_level": p.risk_level,
            "predicted_delay": p.predicted_delay_months,
            "predicted_overrun": p.predicted_cost_overrun_percentage
        }
        for p in projects
    ]

    # Projects requiring immediate attention (Critical + High risk)
    attention_projects = [
        {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "category": p.category,
            "location": p.location,
            "risk_level": p.risk_level,
            "health_score": p.health_score,
            "actual_progress": p.actual_progress,
            "planned_progress": p.planned_progress,
            "delay_days": p.delay_days,
            "predicted_delay_months": p.predicted_delay_months,
            "predicted_cost_overrun_percentage": p.predicted_cost_overrun_percentage,
            "contractor_performance": p.contractor_performance
        }
        for p in sorted(projects, key=lambda x: (4 if x.risk_level=="CRITICAL" else 3 if x.risk_level=="HIGH" else 2 if x.risk_level=="MEDIUM" else 1, x.delay_days), reverse=True)
        if p.risk_level in ["CRITICAL", "HIGH", "MEDIUM"]
    ]

    # Recent analysis history
    recent_logs = db.query(AnalysisLog).order_by(AnalysisLog.created_at.desc()).limit(6).all()
    recent_analyses = []
    for log in recent_logs:
        p = db.query(Project).filter(Project.id == log.project_id).first()
        if p:
            recent_analyses.append({
                "id": log.id,
                "project_id": p.id,
                "project_name": p.name,
                "category": p.category,
                "risk_level": log.risk_level,
                "confidence": log.confidence,
                "predicted_delay_months": log.predicted_delay_months,
                "predicted_cost_overrun_percentage": log.predicted_cost_overrun_percentage,
                "health_score": log.health_score,
                "timestamp": log.created_at.strftime("%Y-%m-%d %H:%M")
            })

    # Recommended Intervention Priority ranking for all projects
    intervention_priority = compute_intervention_priority(projects)

    return {
        "total_projects": total_projects,
        "on_track_count": on_track_count,
        "at_risk_count": at_risk_count,
        "critical_count": critical_count,
        "average_progress": avg_progress,
        "average_health_score": avg_health,
        "projects_with_delay": delayed_count,
        "total_budget_cr": total_budget,
        "risk_distribution": risk_dist,
        "category_distribution": cat_dist,
        "progress_overview": progress_overview,
        "cost_vs_progress": cost_vs_progress,
        "projects_requiring_attention": attention_projects,
        "recent_analyses": recent_analyses,
        "intervention_priority": intervention_priority
    }


def compute_intervention_priority(projects: List[Project]) -> List[Dict[str, Any]]:
    """
    Calculates a transparent Priority Score and Intervention Order for all projects
    based on risk level, projected delay, cost overrun, baseline progress lag, and contractor score.
    """
    def calc_score(p: Project):
        risk_weights = {"CRITICAL": 40.0, "HIGH": 30.0, "MEDIUM": 18.0, "LOW": 5.0}
        r_score = risk_weights.get(p.risk_level, 10.0)
        delay_score = min(20.0, max(0.0, float(p.predicted_delay_months or 0.0) * 1.5))
        cost_score = min(15.0, max(0.0, float(p.predicted_cost_overrun_percentage or 0.0) * 0.5))
        lag = max(0.0, float(p.planned_progress or 0.0) - float(p.actual_progress or 0.0))
        lag_score = min(15.0, lag * 0.5)
        contractor_score = max(0.0, (100.0 - float(p.contractor_performance or 80.0)) * 0.10)
        
        raw_score = round(min(100.0, r_score + delay_score + cost_score + lag_score + contractor_score), 1)
        return raw_score, lag

    sorted_projects = sorted(projects, key=lambda x: (calc_score(x)[0], calc_score(x)[1]), reverse=True)

    ranked_items = []
    for rank, p in enumerate(sorted_projects, 1):
        score, lag = calc_score(p)

        if score >= 75.0 or p.risk_level == "CRITICAL":
            priority_label = "Immediate Intervention"
        elif score >= 55.0 or p.risk_level == "HIGH":
            priority_label = "High Attention"
        elif score >= 35.0 or p.risk_level == "MEDIUM":
            priority_label = "Moderate Priority"
        else:
            priority_label = "Routine Monitoring"

        delay_impact = "High" if (p.predicted_delay_months or 0) >= 6.0 or (p.delay_days or 0) >= 90 else ("Medium" if (p.predicted_delay_months or 0) >= 2.0 or (p.delay_days or 0) >= 30 else "Low")
        cost_impact = "High" if (p.predicted_cost_overrun_percentage or 0) >= 15.0 or (p.project_cost or 0) >= 2000 else ("Medium" if (p.predicted_cost_overrun_percentage or 0) >= 5.0 else "Low")

        if p.risk_level == "CRITICAL":
            explanation = f"Critical risk level combined with {lag:.1f}% baseline lag and severe projected delay (+{p.predicted_delay_months:.1f}m)."
        elif p.risk_level == "HIGH":
            explanation = f"High risk level driven by {lag:.1f}% schedule slippage and contractor score ({p.contractor_performance:.0f}/100)."
        elif p.risk_level == "MEDIUM":
            explanation = f"Moderate progress variance (+{p.predicted_delay_months:.1f}m delay) requiring focused supply chain oversight."
        else:
            explanation = f"On-track execution ({p.actual_progress:.1f}% actual progress) with low risk indicators."

        ranked_items.append({
            "rank": rank,
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "category": p.category,
            "location": p.location,
            "project_cost": p.project_cost,
            "risk_level": p.risk_level,
            "health_score": p.health_score,
            "actual_progress": p.actual_progress,
            "planned_progress": p.planned_progress,
            "progress_lag": round(lag, 1),
            "predicted_delay_months": p.predicted_delay_months,
            "predicted_cost_overrun_percentage": p.predicted_cost_overrun_percentage,
            "contractor_performance": p.contractor_performance,
            "priority_score": score,
            "priority_label": priority_label,
            "delay_impact": delay_impact,
            "cost_impact": cost_impact,
            "explanation": explanation
        })

    return ranked_items


@router.get("/intervention-priority")
def get_intervention_priority_endpoint(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return compute_intervention_priority(projects)

