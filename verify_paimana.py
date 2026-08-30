import os
import sys
import joblib
import pandas as pd
from backend.database import SessionLocal
from backend.models import Project, Alert, AnalysisLog
from backend.services.prediction_service import prediction_engine

print("=== 1. CHECKING ML DATASET & MODELS ===")
assert os.path.exists("ml/data/projects.csv"), "Dataset missing"
df = pd.read_csv("ml/data/projects.csv")
print(f"Projects dataset verified: {len(df)} rows, shape: {df.shape}")
assert len(df) >= 5000, "Dataset should have at least 5000 records"

assert os.path.exists("ml/models/risk_model.pkl"), "Risk model missing"
assert os.path.exists("ml/models/delay_model.pkl"), "Delay model missing"
assert os.path.exists("ml/models/cost_model.pkl"), "Cost model missing"
assert os.path.exists("ml/models/feature_meta.pkl"), "Feature meta missing"
print("All 3 ML models and metadata verified on disk.")

print("\n=== 2. CHECKING SQLITE DATABASE SEED DATA ===")
db = SessionLocal()
projects = db.query(Project).all()
alerts = db.query(Alert).all()
logs = db.query(AnalysisLog).all()
print(f"Database records: {len(projects)} Projects, {len(alerts)} Alerts, {len(logs)} Analysis Logs")
assert len(projects) >= 15, "Should have at least 15 seeded projects"
db.close()

print("\n=== 3. TESTING LIVE INFERENCE & ROOT CAUSE EXPLANATIONS ===")
sample_input = {
    "name": "Pune Metro Line 3 Extension",
    "category": "Metro",
    "project_cost": 8313.0,
    "planned_duration_months": 42,
    "planned_progress": 72.0,
    "actual_progress": 46.5,
    "expenditure_percentage": 68.2,
    "resource_availability": 52.0,
    "material_availability": 48.0,
    "workforce_availability": 55.0,
    "contractor_performance": 51.0,
    "delay_days": 135,
    "milestone_completion_rate": 50.0,
    "change_requests": 6,
    "weather_impact": 5.8,
    "previous_delay_count": 3,
    "risk_history": 7.5
}
result = prediction_engine.predict(sample_input)
print("Live Prediction Output:")
print(f"  - Risk Level: {result['risk_level']}")
print(f"  - Confidence: {result['confidence']*100:.1f}%")
print(f"  - Predicted Delay: {result['predicted_delay_months']} Months")
print(f"  - Cost Overrun: {result['predicted_cost_overrun_percentage']}%")
print(f"  - Health Score: {result['health_score']}/100")
print(f"  - Root Cause Factors count: {len(result['risk_factors'])}")
for idx, factor in enumerate(result['risk_factors'], 1):
    print(f"     {idx}. {factor}")
print(f"  - AI Prescriptive Recommendations count: {len(result['recommendations'])}")
for idx, rec in enumerate(result['recommendations'][:3], 1):
    print(f"     {idx}. [{rec['priority']}] {rec['title']} -> {rec['action']}")

print("\n=== 4. CHECKING FRONTEND BUILD ASSETS ===")
assert os.path.exists("frontend/dist/index.html"), "Frontend build index.html missing"
print("Frontend production build verified in frontend/dist/")
print("\n>>> ALL PAIMANA SYSTEM INTEGRITY TESTS PASSED! <<<")
