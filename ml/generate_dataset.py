"""
PAIMANA - Synthetic Infrastructure Project Dataset Generator
Generates realistic infrastructure project monitoring data with non-linear correlations
between project indicators (schedule, budget, contractor, resources) and risk/delay/cost outcomes.
Balanced distribution across LOW, MEDIUM, HIGH, and CRITICAL risk tiers.
"""

import os
import random
import numpy as np
import pandas as pd

def generate_synthetic_projects(n_samples: int = 6500, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    random.seed(random_state)

    categories = [
        "Highway", "Railway", "Metro", "Bridge", "Airport",
        "Irrigation", "Water Supply", "Power Infrastructure", "Urban Development"
    ]
    
    locations = [
        "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Gujarat", "Karnataka",
        "Bihar", "West Bengal", "Rajasthan", "Madhya Pradesh", "Telangana",
        "Andhra Pradesh", "Kerala", "Assam", "Odisha", "Delhi NCR",
        "Jammu & Kashmir", "Uttarakhand", "Himachal Pradesh"
    ]

    records = []
    
    # 4 distinct operational regimes
    tiers = ["EXCELLENT", "MODERATE", "ELEVATED", "DISTRESSED"]
    tier_probs = [0.28, 0.32, 0.24, 0.16]

    for i in range(1, n_samples + 1):
        category = random.choice(categories)
        location = random.choice(locations)
        tier = np.random.choice(tiers, p=tier_probs)

        # Baseline project parameters by category complexity
        if category in ["Metro", "Railway", "Airport"]:
            base_cost = np.random.exponential(scale=3500) + 1200  # ₹1200 Cr - ₹20,000+ Cr
            planned_duration = int(np.random.normal(loc=48, scale=14))
            planned_duration = max(24, min(120, planned_duration))
            base_complexity = 1.3
        elif category in ["Bridge", "Power Infrastructure", "Highway"]:
            base_cost = np.random.exponential(scale=1800) + 450
            planned_duration = int(np.random.normal(loc=36, scale=10))
            planned_duration = max(18, min(84, planned_duration))
            base_complexity = 1.15
        else: # Irrigation, Water Supply, Urban Development
            base_cost = np.random.exponential(scale=850) + 150
            planned_duration = int(np.random.normal(loc=28, scale=8))
            planned_duration = max(12, min(60, planned_duration))
            base_complexity = 1.0

        project_cost = round(float(base_cost), 2)
        planned_progress = round(float(np.random.uniform(20.0, 92.0)), 1)

        # Health latent variable based on operational regime
        if tier == "EXCELLENT":
            health_factor = np.random.uniform(0.85, 0.98)
            contractor_performance = round(float(np.random.uniform(85.0, 98.0)), 1)
            resource_availability = round(float(np.random.uniform(88.0, 99.0)), 1)
            material_availability = round(float(np.random.uniform(86.0, 99.0)), 1)
            workforce_availability = round(float(np.random.uniform(88.0, 100.0)), 1)
            weather_impact = round(float(np.random.uniform(0.2, 2.5)), 1)
            change_requests = int(np.random.poisson(0.4))
            previous_delay_count = 0
            risk_history = round(float(np.random.uniform(0.5, 2.2)), 1)
            lag_penalty = max(0.0, np.random.normal(0.0, 1.2))
            
        elif tier == "MODERATE":
            health_factor = np.random.uniform(0.68, 0.84)
            contractor_performance = round(float(np.random.uniform(70.0, 84.0)), 1)
            resource_availability = round(float(np.random.uniform(72.0, 86.0)), 1)
            material_availability = round(float(np.random.uniform(70.0, 85.0)), 1)
            workforce_availability = round(float(np.random.uniform(72.0, 87.0)), 1)
            weather_impact = round(float(np.random.uniform(1.5, 4.5)), 1)
            change_requests = int(np.random.poisson(1.6))
            previous_delay_count = int(np.random.choice([0, 1]))
            risk_history = round(float(np.random.uniform(2.5, 4.8)), 1)
            lag_penalty = max(1.5, float(np.random.normal(5.0, 2.2)))

        elif tier == "ELEVATED":
            health_factor = np.random.uniform(0.48, 0.67)
            contractor_performance = round(float(np.random.uniform(55.0, 69.0)), 1)
            resource_availability = round(float(np.random.uniform(55.0, 71.0)), 1)
            material_availability = round(float(np.random.uniform(52.0, 69.0)), 1)
            workforce_availability = round(float(np.random.uniform(54.0, 70.0)), 1)
            weather_impact = round(float(np.random.uniform(3.0, 7.0)), 1)
            change_requests = int(np.random.poisson(3.5))
            previous_delay_count = int(np.random.choice([1, 2, 3]))
            risk_history = round(float(np.random.uniform(5.0, 7.2)), 1)
            lag_penalty = max(8.0, float(np.random.normal(15.0, 3.8)))

        else: # DISTRESSED
            health_factor = np.random.uniform(0.20, 0.46)
            contractor_performance = round(float(np.random.uniform(32.0, 54.0)), 1)
            resource_availability = round(float(np.random.uniform(35.0, 54.0)), 1)
            material_availability = round(float(np.random.uniform(30.0, 52.0)), 1)
            workforce_availability = round(float(np.random.uniform(35.0, 55.0)), 1)
            weather_impact = round(float(np.random.uniform(5.0, 9.5)), 1)
            change_requests = int(np.random.poisson(5.5))
            previous_delay_count = int(np.random.choice([2, 3, 4, 5]))
            risk_history = round(float(np.random.uniform(7.0, 9.5)), 1)
            lag_penalty = max(18.0, float(np.random.normal(27.0, 5.5)))

        if location in ["Assam", "Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir", "Kerala"]:
            weather_impact = min(10.0, round(weather_impact + np.random.uniform(0.8, 1.8), 1))

        actual_progress = max(2.0, min(planned_progress + 1.0, planned_progress - lag_penalty))
        actual_progress = round(float(actual_progress), 1)
        progress_deviation = round(float(planned_progress - actual_progress), 1)

        # Milestone completion rate
        milestone_ratio = (actual_progress / max(planned_progress, 1.0)) * 100.0
        milestone_completion_rate = round(float(np.clip(milestone_ratio + np.random.normal(0, 3), 15.0, 100.0)), 1)

        # Accumulated delay days
        if tier == "EXCELLENT":
            delay_days = max(0, int(np.random.normal(2, 3)))
        elif tier == "MODERATE":
            delay_days = max(10, int(np.random.normal(32, 8)))
        elif tier == "ELEVATED":
            delay_days = max(45, int(np.random.normal(80, 18)))
        else:
            delay_days = max(90, int(np.random.normal(160, 35)))

        # Expenditure percentage
        cost_creep = 1.0 + max(0.0, progress_deviation * 0.008) + (change_requests * 0.015) + np.random.normal(0, 0.03)
        expenditure_percentage = round(float(np.clip(actual_progress * cost_creep, 5.0, 120.0)), 1)
        cost_progress_ratio = round(float(expenditure_percentage / max(actual_progress, 1.0)), 3)

        # Multi-class ground truth target
        if tier == "EXCELLENT":
            risk_level = "LOW"
            predicted_delay = max(0.0, np.random.normal(0.2, 0.2))
            predicted_cost_overrun = max(0.0, np.random.normal(1.2, 0.8))
        elif tier == "MODERATE":
            risk_level = "MEDIUM"
            predicted_delay = max(0.8, np.random.normal(2.4, 0.6))
            predicted_cost_overrun = max(2.5, np.random.normal(6.5, 1.5))
        elif tier == "ELEVATED":
            risk_level = "HIGH"
            predicted_delay = max(3.0, np.random.normal(5.8, 1.0))
            predicted_cost_overrun = max(7.0, np.random.normal(14.2, 2.2))
        else:
            risk_level = "CRITICAL"
            predicted_delay = max(6.5, np.random.normal(11.5, 2.2))
            predicted_cost_overrun = max(15.0, np.random.normal(26.8, 4.0))

        predicted_delay_months = round(float(predicted_delay), 1)
        predicted_cost_overrun_pct = round(float(predicted_cost_overrun), 1)

        record = {
            "project_id": f"PRJ-{1000 + i}",
            "category": category,
            "location": location,
            "project_cost": project_cost,
            "planned_duration_months": planned_duration,
            "planned_progress": planned_progress,
            "actual_progress": actual_progress,
            "progress_deviation": progress_deviation,
            "expenditure_percentage": expenditure_percentage,
            "cost_progress_ratio": cost_progress_ratio,
            "resource_availability": resource_availability,
            "material_availability": material_availability,
            "workforce_availability": workforce_availability,
            "contractor_performance": contractor_performance,
            "delay_days": delay_days,
            "milestone_completion_rate": milestone_completion_rate,
            "change_requests": change_requests,
            "weather_impact": weather_impact,
            "previous_delay_count": previous_delay_count,
            "risk_history": risk_history,
            "risk_level": risk_level,
            "predicted_delay_months": predicted_delay_months,
            "predicted_cost_overrun_percentage": predicted_cost_overrun_pct
        }
        records.append(record)

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, "projects.csv")
    
    print(f"Generating 6,500 realistic infrastructure project records...")
    df = generate_synthetic_projects(n_samples=6500)
    df.to_csv(csv_path, index=False)
    
    print(f"Dataset successfully created at: {csv_path}")
    print(f"Dataset shape: {df.shape}")
    print("\nRisk Level Distribution:")
    print(df["risk_level"].value_counts(normalize=True) * 100)
