from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    category: str
    location: str
    executing_agency: Optional[str] = "National Infrastructure Authority"
    contractor_name: Optional[str] = "Premier Engineering Corp"
    project_cost: float
    planned_duration_months: int
    start_date: str
    target_completion_date: str
    planned_progress: float = 0.0
    actual_progress: float = 0.0
    expenditure_percentage: float = 0.0
    resource_availability: float = 100.0
    material_availability: float = 100.0
    workforce_availability: float = 100.0
    contractor_performance: float = 80.0
    delay_days: int = 0
    milestone_completion_rate: float = 100.0
    change_requests: int = 0
    weather_impact: float = 0.0
    previous_delay_count: int = 0
    risk_history: float = 0.0

class ProjectCreate(ProjectBase):
    code: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    project_cost: Optional[float] = None
    planned_duration_months: Optional[int] = None
    planned_progress: Optional[float] = None
    actual_progress: Optional[float] = None
    expenditure_percentage: Optional[float] = None
    resource_availability: Optional[float] = None
    material_availability: Optional[float] = None
    workforce_availability: Optional[float] = None
    contractor_performance: Optional[float] = None
    delay_days: Optional[int] = None
    milestone_completion_rate: Optional[float] = None
    change_requests: Optional[int] = None
    weather_impact: Optional[float] = None
    previous_delay_count: Optional[int] = None
    risk_history: Optional[float] = None

class ProjectResponse(ProjectBase):
    id: int
    code: str
    risk_level: str
    health_score: float
    predicted_delay_months: float
    predicted_cost_overrun_percentage: float
    confidence: float
    last_analyzed: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class HealthBreakdown(BaseModel):
    overall_health: float
    schedule_health: float
    cost_health: float
    resource_health: float
    contractor_health: float
    milestone_health: float
    status_label: str

class RiskComponentBreakdown(BaseModel):
    schedule_risk_pct: float
    cost_risk_pct: float
    resource_risk_pct: float
    contractor_risk_pct: float
    weather_risk_pct: float

class TimelineProjection(BaseModel):
    period: str
    risk_level: str
    predicted_delay_months: float
    predicted_cost_overrun_percentage: float
    health_score: float
    description: str

class PredictionRequest(BaseModel):
    project_id: Optional[int] = None
    category: str = "Highway"
    project_cost: float = 1000.0
    planned_duration_months: int = 36
    planned_progress: float = 50.0
    actual_progress: float = 40.0
    expenditure_percentage: float = 48.0
    resource_availability: float = 75.0
    material_availability: float = 70.0
    workforce_availability: float = 80.0
    contractor_performance: float = 70.0
    delay_days: int = 35
    milestone_completion_rate: float = 65.0
    change_requests: int = 2
    weather_impact: float = 2.0
    previous_delay_count: int = 1
    risk_history: float = 3.0

class PredictionResponse(BaseModel):
    project_id: Optional[int] = None
    project_name: Optional[str] = None
    risk_level: str
    confidence: float
    predicted_delay_months: float
    predicted_cost_overrun_percentage: float
    health_score: float
    health_breakdown: HealthBreakdown
    risk_component_breakdown: RiskComponentBreakdown
    risk_factors: List[str]
    recommendations: List[Dict[str, Any]]
    timeline_projections: List[TimelineProjection]
    analysis_timestamp: str

class DashboardStats(BaseModel):
    total_projects: int
    on_track_count: int
    at_risk_count: int
    critical_count: int
    average_progress: float
    average_health_score: float
    projects_with_delay: int
    total_budget_cr: float
    risk_distribution: Dict[str, int]
    category_distribution: Dict[str, int]
    progress_overview: List[Dict[str, Any]]
    cost_vs_progress: List[Dict[str, Any]]
    projects_requiring_attention: List[Dict[str, Any]]
    recent_analyses: List[Dict[str, Any]]

class AlertResponse(BaseModel):
    id: int
    project_id: Optional[int]
    project_name: str
    severity: str
    title: str
    message: str
    category: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
