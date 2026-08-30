import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    location = Column(String(100), index=True, nullable=False)
    executing_agency = Column(String(150), default="National Infrastructure Authority")
    contractor_name = Column(String(150), default="Premier Engineering Corp")
    
    # Financial & Schedule Baseline
    project_cost = Column(Float, nullable=False)  # in ₹ Crores
    planned_duration_months = Column(Integer, nullable=False)
    start_date = Column(String(50), nullable=False)
    target_completion_date = Column(String(50), nullable=False)
    
    # Real-time Monitoring Indicators
    planned_progress = Column(Float, default=0.0)      # %
    actual_progress = Column(Float, default=0.0)       # %
    expenditure_percentage = Column(Float, default=0.0)# %
    resource_availability = Column(Float, default=100.0) # %
    material_availability = Column(Float, default=100.0) # %
    workforce_availability = Column(Float, default=100.0)# %
    contractor_performance = Column(Float, default=80.0) # 0-100 score
    delay_days = Column(Integer, default=0)
    milestone_completion_rate = Column(Float, default=100.0) # %
    change_requests = Column(Integer, default=0)
    weather_impact = Column(Float, default=0.0) # 0-10
    previous_delay_count = Column(Integer, default=0)
    risk_history = Column(Float, default=0.0) # 0-10
    
    # Calculated / ML Status
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    health_score = Column(Float, default=100.0) # 0-100
    predicted_delay_months = Column(Float, default=0.0)
    predicted_cost_overrun_percentage = Column(Float, default=0.0)
    confidence = Column(Float, default=0.9)
    last_analyzed = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    risk_level = Column(String(20))
    confidence = Column(Float)
    predicted_delay_months = Column(Float)
    predicted_cost_overrun_percentage = Column(Float)
    health_score = Column(Float)
    risk_factors = Column(Text) # JSON string array
    recommendations = Column(Text) # JSON string array
    timeline_projections = Column(Text) # JSON string object
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True, nullable=True)
    project_name = Column(String(200))
    severity = Column(String(20)) # CRITICAL, WARNING, WATCH, INFO
    title = Column(String(200))
    message = Column(Text)
    category = Column(String(50)) # Schedule, Cost, Contractor, Resource, Weather
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
