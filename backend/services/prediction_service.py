"""
Traxis - Prediction Service & Explainability Engine
Loads trained RandomForest models, performs live inference, computes transparent health scores,
identifies dynamic root-cause risk factors, and calculates 1-6 month future trajectory projections.
"""

import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, List, Tuple
from .recommendation_service import generate_recommendations

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(os.path.dirname(BASE_DIR), "ml", "models")

class PredictionEngine:
    def __init__(self):
        self.risk_model = None
        self.delay_model = None
        self.cost_model = None
        self.metadata = None
        self.is_loaded = False
        self._load_models()

    def _load_models(self):
        try:
            risk_path = os.path.join(ML_DIR, "risk_model.pkl")
            delay_path = os.path.join(ML_DIR, "delay_model.pkl")
            cost_path = os.path.join(ML_DIR, "cost_model.pkl")
            meta_path = os.path.join(ML_DIR, "feature_meta.pkl")

            if os.path.exists(risk_path) and os.path.exists(meta_path):
                self.risk_model = joblib.load(risk_path)
                self.delay_model = joblib.load(delay_path)
                self.cost_model = joblib.load(cost_path)
                self.metadata = joblib.load(meta_path)
                self.is_loaded = True
                print("Traxis Prediction Engine: ML Models loaded successfully.")
            else:
                print("Traxis Prediction Engine: Model files not yet found on disk. Will load upon training.")
        except Exception as e:
            print(f"Traxis Prediction Engine loading error: {e}")
            self.is_loaded = False

    def ensure_models_loaded(self):
        if not self.is_loaded:
            self._load_models()

    def compute_health_score(
        self,
        progress_deviation: float,
        cost_progress_ratio: float,
        resource_availability: float,
        material_availability: float,
        workforce_availability: float,
        contractor_performance: float,
        milestone_completion_rate: float,
        delay_days: int
    ) -> Dict[str, Any]:
        """Transparent weighted health score from 0-100."""
        # 1. Schedule Health (30% weight)
        schedule_health = max(0.0, min(100.0, 100.0 - (progress_deviation * 2.5) - (delay_days / 6.0)))
        
        # 2. Cost Health (20% weight)
        cost_deviation = max(0.0, cost_progress_ratio - 1.0)
        cost_health = max(0.0, min(100.0, 100.0 - (cost_deviation * 140.0)))
        
        # 3. Resource Health (20% weight)
        resource_health = max(0.0, min(100.0, (
            resource_availability * 0.4 +
            material_availability * 0.3 +
            workforce_availability * 0.3
        )))
        
        # 4. Contractor Health (15% weight)
        contractor_health = max(0.0, min(100.0, contractor_performance))
        
        # 5. Milestone Health (15% weight)
        milestone_health = max(0.0, min(100.0, milestone_completion_rate))
        
        overall = (
            schedule_health * 0.30 +
            cost_health * 0.20 +
            resource_health * 0.20 +
            contractor_health * 0.15 +
            milestone_health * 0.15
        )
        overall = round(float(np.clip(overall, 0.0, 100.0)), 1)
        
        if overall >= 80.0:
            status_label = "ON TRACK"
        elif overall >= 60.0:
            status_label = "MODERATE"
        elif overall >= 40.0:
            status_label = "AT RISK"
        else:
            status_label = "CRITICAL"

        return {
            "overall_health": overall,
            "schedule_health": round(float(schedule_health), 1),
            "cost_health": round(float(cost_health), 1),
            "resource_health": round(float(resource_health), 1),
            "contractor_health": round(float(contractor_health), 1),
            "milestone_health": round(float(milestone_health), 1),
            "status_label": status_label
        }

    def compute_risk_components(
        self,
        progress_deviation: float,
        cost_progress_ratio: float,
        resource_availability: float,
        contractor_performance: float,
        weather_impact: float,
        delay_days: int
    ) -> Dict[str, float]:
        """Calculates specific risk percentages (0-100%) across dimensions."""
        schedule_risk = min(98.0, max(5.0, (progress_deviation * 2.4) + (delay_days / 4.0)))
        cost_risk = min(96.0, max(5.0, max(0.0, cost_progress_ratio - 1.0) * 110.0 + 8.0))
        resource_risk = min(98.0, max(5.0, 100.0 - resource_availability))
        contractor_risk = min(98.0, max(5.0, 100.0 - contractor_performance))
        weather_risk = min(95.0, max(5.0, weather_impact * 9.5))

        return {
            "schedule_risk_pct": round(float(schedule_risk), 1),
            "cost_risk_pct": round(float(cost_risk), 1),
            "resource_risk_pct": round(float(resource_risk), 1),
            "contractor_risk_pct": round(float(contractor_risk), 1),
            "weather_risk_pct": round(float(weather_risk), 1)
        }

    def extract_dynamic_risk_factors(
        self,
        progress_deviation: float,
        contractor_performance: float,
        resource_availability: float,
        material_availability: float,
        workforce_availability: float,
        delay_days: int,
        cost_progress_ratio: float,
        change_requests: int,
        weather_impact: float,
        milestone_completion_rate: float,
        previous_delay_count: int
    ) -> List[str]:
        """Generates dynamic root-cause explanations grounded in the actual project parameters."""
        factors = []
        
        if progress_deviation > 12.0:
            factors.append(f"Actual progress is significantly behind schedule by {progress_deviation:.1f}% deviation from planned baseline.")
        elif progress_deviation > 5.0:
            factors.append(f"Actual progress has moderate schedule slippage ({progress_deviation:.1f}% lag).")
            
        if contractor_performance < 60.0:
            factors.append(f"Contractor execution efficiency is low ({contractor_performance:.1f}/100), causing execution delays.")
        elif contractor_performance < 75.0:
            factors.append(f"Contractor performance index ({contractor_performance:.1f}/100) is below target SLA baseline.")
            
        if material_availability < 65.0:
            factors.append(f"Critical material availability is constrained at {material_availability:.1f}%, resulting in supply shortages.")
            
        if workforce_availability < 70.0:
            factors.append(f"Site workforce deployment is at {workforce_availability:.1f}%, below mandated staffing capacity.")
            
        if delay_days > 40:
            factors.append(f"Project has accumulated severe delay ({delay_days} calendar days) affecting downstream critical milestones.")
        elif delay_days > 15:
            factors.append(f"Accumulated delay of {delay_days} days is impacting milestone completion schedules.")
            
        if cost_progress_ratio > 1.20:
            factors.append(f"Expenditure velocity is disproportionately higher than physical progress ({cost_progress_ratio:.2f}x burn ratio).")
            
        if change_requests >= 4:
            factors.append(f"Elevated number of engineering change orders ({change_requests} revisions) has disrupted standard workflows.")
            
        if weather_impact >= 5.0:
            factors.append(f"Severe environmental / adverse weather conditions (impact rating: {weather_impact:.1f}/10) have restricted site operations.")
            
        if milestone_completion_rate < 65.0:
            factors.append(f"Milestone completion rate has slipped to {milestone_completion_rate:.1f}%, indicating systemic bottlenecking.")

        if not factors:
            factors.append("Project indicators are operating within normal tolerances with minimal deviation.")

        return factors

    def calculate_future_projections(
        self,
        current_risk: str,
        current_delay: float,
        current_cost_overrun: float,
        current_health: float,
        progress_deviation: float,
        contractor_performance: float
    ) -> List[Dict[str, Any]]:
        """Generates transparent 1, 3, and 6-month risk trajectory projections."""
        risk_hierarchy = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        current_idx = risk_hierarchy.index(current_risk) if current_risk in risk_hierarchy else 1
        
        # Escalation rate driven by contractor & progress gap
        escalation_speed = 0
        if progress_deviation > 10.0 or contractor_performance < 65.0:
            escalation_speed = 1
        if progress_deviation > 20.0 and contractor_performance < 55.0:
            escalation_speed = 2

        def get_risk_at_step(step_months: int):
            idx = min(3, current_idx + (1 if step_months >= 1 and escalation_speed >= 1 else 0) + (1 if step_months >= 3 and escalation_speed >= 2 else 0))
            return risk_hierarchy[idx]

        projections = [
            {
                "period": "CURRENT",
                "risk_level": current_risk,
                "predicted_delay_months": round(current_delay, 1),
                "predicted_cost_overrun_percentage": round(current_cost_overrun, 1),
                "health_score": current_health,
                "description": "Current status assessment based on live project telemetry."
            },
            {
                "period": "1 MONTH",
                "risk_level": get_risk_at_step(1),
                "predicted_delay_months": round(current_delay + (0.4 if escalation_speed > 0 else 0.1), 1),
                "predicted_cost_overrun_percentage": round(current_cost_overrun + (0.8 if escalation_speed > 0 else 0.2), 1),
                "health_score": round(max(15.0, current_health - (3.5 if escalation_speed > 0 else 0.5)), 1),
                "description": "Short-term forecast if current execution rate and resource levels persist."
            },
            {
                "period": "3 MONTHS",
                "risk_level": get_risk_at_step(3),
                "predicted_delay_months": round(current_delay + (1.2 if escalation_speed > 0 else 0.3), 1),
                "predicted_cost_overrun_percentage": round(current_cost_overrun + (2.4 if escalation_speed > 0 else 0.5), 1),
                "health_score": round(max(10.0, current_health - (8.0 if escalation_speed > 0 else 1.0)), 1),
                "description": "Mid-term forecast assuming no corrective management intervention is taken."
            },
            {
                "period": "6 MONTHS",
                "risk_level": get_risk_at_step(6),
                "predicted_delay_months": round(current_delay + (2.6 if escalation_speed > 0 else 0.6), 1),
                "predicted_cost_overrun_percentage": round(current_cost_overrun + (4.8 if escalation_speed > 0 else 1.0), 1),
                "health_score": round(max(5.0, current_health - (15.0 if escalation_speed > 0 else 2.0)), 1),
                "description": "Long-term compounded exposure without mitigation fast-tracking."
            }
        ]
        return projections

    def predict(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        self.ensure_models_loaded()

        # Compute derived features
        planned_progress = float(project_data.get("planned_progress", 0.0))
        actual_progress = float(project_data.get("actual_progress", 0.0))
        progress_deviation = round(float(planned_progress - actual_progress), 1)
        
        expenditure_percentage = float(project_data.get("expenditure_percentage", 0.0))
        cost_progress_ratio = round(float(expenditure_percentage / max(actual_progress, 1.0)), 3)

        resource_availability = float(project_data.get("resource_availability", 100.0))
        material_availability = float(project_data.get("material_availability", 100.0))
        workforce_availability = float(project_data.get("workforce_availability", 100.0))
        contractor_performance = float(project_data.get("contractor_performance", 80.0))
        delay_days = int(project_data.get("delay_days", 0))
        milestone_rate = float(project_data.get("milestone_completion_rate", 100.0))
        change_requests = int(project_data.get("change_requests", 0))
        weather_impact = float(project_data.get("weather_impact", 0.0))
        previous_delay_count = int(project_data.get("previous_delay_count", 0))
        risk_history = float(project_data.get("risk_history", 0.0))
        category = str(project_data.get("category", "Highway"))
        project_cost = float(project_data.get("project_cost", 1000.0))
        planned_duration = int(project_data.get("planned_duration_months", 36))

        # Build feature DataFrame matching model training pipeline
        feature_dict = {
            "project_cost": [project_cost],
            "planned_duration_months": [planned_duration],
            "planned_progress": [planned_progress],
            "actual_progress": [actual_progress],
            "progress_deviation": [progress_deviation],
            "expenditure_percentage": [expenditure_percentage],
            "cost_progress_ratio": [cost_progress_ratio],
            "resource_availability": [resource_availability],
            "material_availability": [material_availability],
            "workforce_availability": [workforce_availability],
            "contractor_performance": [contractor_performance],
            "delay_days": [delay_days],
            "milestone_completion_rate": [milestone_rate],
            "change_requests": [change_requests],
            "weather_impact": [weather_impact],
            "previous_delay_count": [previous_delay_count],
            "risk_history": [risk_history],
            "category": [category]
        }
        df_input = pd.DataFrame(feature_dict)

        # ML Inference
        if self.is_loaded and self.risk_model is not None:
            risk_preds = self.risk_model.predict(df_input)
            risk_level = str(risk_preds[0])
            proba = self.risk_model.predict_proba(df_input)[0]
            confidence = round(float(np.max(proba)), 2)

            predicted_delay = float(self.delay_model.predict(df_input)[0])
            predicted_delay_months = round(max(0.0, predicted_delay), 1)

            predicted_cost = float(self.cost_model.predict(df_input)[0])
            predicted_cost_overrun_percentage = round(max(0.0, predicted_cost), 1)
        else:
            # Deterministic fallback if model training is in progress
            score = (progress_deviation * 1.5) + (100 - contractor_performance) * 0.4 + (delay_days / 15.0)
            if score < 25: risk_level = "LOW"
            elif score < 50: risk_level = "MEDIUM"
            elif score < 75: risk_level = "HIGH"
            else: risk_level = "CRITICAL"
            confidence = 0.85
            predicted_delay_months = round(max(0.0, progress_deviation * 0.3 + delay_days / 30.0), 1)
            predicted_cost_overrun_percentage = round(max(0.0, (cost_progress_ratio - 1.0) * 15.0 + 3.0), 1)

        # Compute Health Breakdown
        health_breakdown = self.compute_health_score(
            progress_deviation=progress_deviation,
            cost_progress_ratio=cost_progress_ratio,
            resource_availability=resource_availability,
            material_availability=material_availability,
            workforce_availability=workforce_availability,
            contractor_performance=contractor_performance,
            milestone_completion_rate=milestone_rate,
            delay_days=delay_days
        )

        # Compute Risk Components
        risk_components = self.compute_risk_components(
            progress_deviation=progress_deviation,
            cost_progress_ratio=cost_progress_ratio,
            resource_availability=resource_availability,
            contractor_performance=contractor_performance,
            weather_impact=weather_impact,
            delay_days=delay_days
        )

        # Extract Dynamic Root Cause Explanations
        risk_factors = self.extract_dynamic_risk_factors(
            progress_deviation=progress_deviation,
            contractor_performance=contractor_performance,
            resource_availability=resource_availability,
            material_availability=material_availability,
            workforce_availability=workforce_availability,
            delay_days=delay_days,
            cost_progress_ratio=cost_progress_ratio,
            change_requests=change_requests,
            weather_impact=weather_impact,
            milestone_completion_rate=milestone_rate,
            previous_delay_count=previous_delay_count
        )

        # Generate Contextual Prescriptive Recommendations
        recommendations = generate_recommendations(
            risk_level=risk_level,
            progress_deviation=progress_deviation,
            contractor_performance=contractor_performance,
            resource_availability=resource_availability,
            material_availability=material_availability,
            workforce_availability=workforce_availability,
            delay_days=delay_days,
            cost_progress_ratio=cost_progress_ratio,
            change_requests=change_requests,
            weather_impact=weather_impact,
            milestone_rate=milestone_rate
        )

        # Calculate Future Projections
        timeline_projections = self.calculate_future_projections(
            current_risk=risk_level,
            current_delay=predicted_delay_months,
            current_cost_overrun=predicted_cost_overrun_percentage,
            current_health=health_breakdown["overall_health"],
            progress_deviation=progress_deviation,
            contractor_performance=contractor_performance
        )

        return {
            "project_id": project_data.get("id"),
            "project_name": project_data.get("name"),
            "risk_level": risk_level,
            "confidence": confidence,
            "predicted_delay_months": predicted_delay_months,
            "predicted_cost_overrun_percentage": predicted_cost_overrun_percentage,
            "health_score": health_breakdown["overall_health"],
            "health_breakdown": health_breakdown,
            "risk_component_breakdown": risk_components,
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "timeline_projections": timeline_projections,
            "analysis_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        }

# Global singleton instance
prediction_engine = PredictionEngine()
