"""
PAIMANA - AI Prescriptive Recommendation Engine
Generates context-aware, prioritized actionable interventions mapped to specific project root-cause risk factors.
"""

from typing import List, Dict, Any

def generate_recommendations(
    risk_level: str,
    progress_deviation: float,
    contractor_performance: float,
    resource_availability: float,
    material_availability: float,
    workforce_availability: float,
    delay_days: int,
    cost_progress_ratio: float,
    change_requests: int,
    weather_impact: float,
    milestone_rate: float
) -> List[Dict[str, Any]]:
    recommendations = []

    # 1. Schedule & Critical Path Interventions
    if progress_deviation > 15.0 or delay_days > 45:
        recommendations.append({
            "category": "Schedule Recovery",
            "priority": "CRITICAL" if progress_deviation > 25.0 else "HIGH",
            "title": "Activate Critical Path Fast-Tracking & Parallel Workstreams",
            "action": "Compress schedule by converting sequential activities to overlapping execution on key structural milestones.",
            "impact": "Can recover 15-25% of accumulated schedule slippage within 60 days.",
            "owner": "Project Director & Chief Resident Engineer"
        })
    elif progress_deviation > 5.0 or delay_days > 15:
        recommendations.append({
            "category": "Schedule Recovery",
            "priority": "MEDIUM",
            "title": "Calibrate Master Schedule Baseline & Milestone Catch-Up Plan",
            "action": "Implement targeted 30-day milestone sprint to close the current schedule deficit.",
            "impact": "Stabilizes schedule deviation before critical path impacts occur.",
            "owner": "Planning & Scheduling Cell"
        })

    # 2. Contractor Management
    if contractor_performance < 55.0:
        recommendations.append({
            "category": "Contractor Governance",
            "priority": "CRITICAL",
            "title": "Initiate Contractor Performance Audit & Issue Formal Notice",
            "action": "Deploy independent technical auditor to evaluate machinery uptime, staffing adequacy, and contractual non-compliance; consider liquidated damages clause if SLA fails.",
            "impact": "Enforces contractual accountability and resolves operational bottlenecks.",
            "owner": "Contract Administration Division"
        })
    elif contractor_performance < 75.0:
        recommendations.append({
            "category": "Contractor Governance",
            "priority": "HIGH",
            "title": "Institute Bi-Weekly Executive Review & Milestone SLA Milestones",
            "action": "Hold joint fortnightly steering reviews with senior leadership of executing contractors to resolve blockers.",
            "impact": "Improves responsiveness and accountability across package deliverables.",
            "owner": "Nodal Officer / Supervising Consultant"
        })

    # 3. Supply Chain & Material Procurement
    if material_availability < 65.0:
        recommendations.append({
            "category": "Supply Chain & Materials",
            "priority": "CRITICAL" if material_availability < 50.0 else "HIGH",
            "title": "Establish Dual-Source Material Procurement & Buffer Inventory",
            "action": "Authorize secondary localized vendors for cement, structural steel, and specialized aggregate to mitigate supply chain choke points.",
            "impact": "Eliminates work stoppages caused by material stockouts.",
            "owner": "Procurement & Materials Management Cell"
        })
    
    # 4. Workforce & Equipment Allocation
    if workforce_availability < 70.0:
        recommendations.append({
            "category": "Resource Mobilization",
            "priority": "HIGH",
            "title": "Authorize 24/7 Double-Shift Deployment & Labor Incentive Structure",
            "action": "Direct the contractor to augment skilled workforce by 25% and introduce productivity-linked milestone bonuses.",
            "impact": "Increases site throughput by up to 30% per month.",
            "owner": "Site Project Manager"
        })

    # 5. Financial & Budget Controls
    if cost_progress_ratio > 1.20 or change_requests > 4:
        recommendations.append({
            "category": "Financial Control",
            "priority": "HIGH" if cost_progress_ratio > 1.35 else "MEDIUM",
            "title": "Freeze Scope Creep & Conduct Value Engineering Audit",
            "action": "Impose strict approval threshold on non-essential change requests and conduct item-rate variance analysis to cap expenditure escalation.",
            "impact": "Curbs expenditure burn rate and prevents budget exhaustion.",
            "owner": "Finance & Audit Committee"
        })

    # 6. Environmental & Weather Safeguards
    if weather_impact > 5.0:
        recommendations.append({
            "category": "Risk Mitigation",
            "priority": "MEDIUM",
            "title": "Deploy Weather Resilience Protocol & Reschedule Earthworks",
            "action": "Prioritize all-weather pre-cast and indoor structural components while pausing vulnerable slope excavations during adverse seasonal conditions.",
            "impact": "Minimizes weather-induced idle time and site damage.",
            "owner": "Safety & Environmental Officer"
        })

    # 7. Milestone & Quality Governance
    if milestone_rate < 70.0:
        recommendations.append({
            "category": "Milestone Monitoring",
            "priority": "HIGH",
            "title": "Establish High-Frequency Daily Milestone War-Room",
            "action": "Implement IoT sensor telemetry, drone survey progress verification, and daily automated dashboard tracking for lagging milestones.",
            "impact": "Provides transparent ground-truth validation and immediate bottleneck detection.",
            "owner": "Digital Monitoring Unit (PAIMANA)"
        })

    # Baseline healthy recommendation if low risk
    if not recommendations or risk_level == "LOW":
        recommendations.append({
            "category": "Continuous Optimization",
            "priority": "LOW",
            "title": "Maintain Standard Quality Protocols & Proactive Preventative Checks",
            "action": "Project is tracking smoothly within planned thresholds. Maintain regular sensor checks and milestone sign-offs.",
            "impact": "Ensures on-time, within-budget completion.",
            "owner": "Quality Assurance Team"
        })

    return recommendations
