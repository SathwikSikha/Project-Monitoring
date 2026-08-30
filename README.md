# PAIMANA (Project Assessment, Intelligence, Monitoring & Analytics)
### AI-Powered Infrastructure Project Monitoring & Risk Prediction Platform
**Smart India Hackathon (SIH) 2026 Prototype**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.9+-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 🏛️ Executive Summary

**PAIMANA** is an enterprise-grade, government decision-support platform designed to monitor mega-infrastructure projects in real time and detect operational bottlenecks **before they become critical crises**.

Built for infrastructure authorities, nodal ministries, and project management cells, PAIMANA systematically answers **four fundamental questions**:
1. **What is happening with the project?** — Live multi-factor tracking of physical progress, schedule slippage, expenditure velocity, and contractor performance.
2. **Why is the project at risk?** — Dynamic root-cause diagnostics mathematically pinpointing primary bottleneck drivers (material stockouts, workforce deficit, weather impact, scope changes).
3. **What is likely to happen in the future?** — Multi-model Machine Learning forecasts predicting delays in calendar months, cost overrun percentages, and compounding 1–6 month risk trajectories.
4. **What action should be taken?** — Prescriptive AI recommendations providing prioritized, owner-assigned corrective interventions with quantified recovery targets.

> **Data Disclosure Note**: Prototype predictions are powered by trained Machine Learning models (`RandomForestClassifier` and `RandomForestRegressor`) utilizing a representative 6,500-record synthetic infrastructure dataset modeling non-linear structural correlations between project variables, due to limited public availability of labeled historical government project records.

---

## 🏗️ System Architecture

```
                                  PAIMANA ARCHITECTURE
                                  
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           React 18 + Vite Frontend                          │
  │  (Tailwind CSS, Recharts Analytics, Lucide Icons, Enterprise Government UI) │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │  HTTP / REST JSON
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         FastAPI Asynchronous Backend                        │
  │     (Pydantic Schemas, CORS Middleware, Dynamic Explanation Engine)          │
  └───────────────────┬─────────────────────────────────────┬───────────────────┘
                      │                                     │
                      ▼                                     ▼
  ┌──────────────────────────────────────┐   ┌──────────────────────────────────┐
  │           SQLite Database            │   │      Machine Learning Layer      │
  │  (SQLAlchemy ORM, 18 Seed Projects,  │   │  (Joblib Pipelines, Scikit-Learn │
  │   Alert Logs, Telemetry History)     │   │   RandomForest Class & Regress)  │
  └──────────────────────────────────────┘   └──────────────────────────────────┘
```

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 3.4, Recharts (Visual Analytics), Lucide React (Enterprise Icons)
- **Backend**: Python 3.10+, FastAPI, Uvicorn (ASGI), Pydantic v2, SQLAlchemy
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib
- **Database**: SQLite 3

---

## 🧠 Machine Learning Engine & Validation

PAIMANA trains and serves **3 production ML models**:

1. **Multi-Class Risk Classifier** (`RandomForestClassifier`):
   - Categorizes projects into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` risk tiers.
   - Evaluated Performance: **100% Accuracy / 100% F1-Score** on holdout test split.
2. **Project Delay Regressor** (`RandomForestRegressor`):
   - Predicts future schedule slippage continuously in **calendar months**.
   - Evaluated Performance: **0.68 Months MAE** ($R^2 = 0.9309$).
3. **Cost Overrun Regressor** (`RandomForestRegressor`):
   - Forecasts total budget escalation as a continuous **percentage of baseline cost**.
   - Evaluated Performance: **1.53% Overrun MAE** ($R^2 = 0.9411$).

### Key Features Ingested by ML:
- `project_cost` (₹ Crores)
- `planned_duration_months`
- `planned_progress` vs. `actual_progress` & `progress_deviation`
- `expenditure_percentage` & `cost_progress_ratio` (Burn velocity)
- `resource_availability`, `material_availability`, `workforce_availability` (%)
- `contractor_performance` score (0–100)
- `delay_days` & `milestone_completion_rate` (%)
- `change_requests` count & `weather_impact` rating (0–10)
- `previous_delay_count` & `risk_history`

---

## 📦 Project Directory Structure

```
PAIMANA/
├── backend/
│   ├── main.py                  # FastAPI entry point, CORS, routing
│   ├── database.py              # SQLite connection & session management
│   ├── models.py                # SQLAlchemy DB models (Projects, AnalysisLogs, Alerts)
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── seed_data.py             # 18 realistic Indian infrastructure projects seeder
│   ├── routes/
│   │   ├── projects.py          # CRUD & multi-factor filtering for projects
│   │   ├── predictions.py       # Live ML risk inference & dynamic explanations
│   │   ├── dashboard.py         # Aggregated KPI stats & charts analytics
│   │   └── alerts.py            # Early-warning alert management API
│   ├── services/
│   │   ├── prediction_service.py # Model loader, inference engine, health scores
│   │   └── recommendation_service.py # Context-aware prescriptive actions engine
│   └── requirements.txt         # Backend Python dependencies
│
├── ml/
│   ├── data/
│   │   └── projects.csv         # 6,500-record synthetic training dataset
│   ├── models/
│   │   ├── risk_model.pkl       # Serialized RandomForest classifier
│   │   ├── delay_model.pkl      # Serialized delay regressor
│   │   ├── cost_model.pkl       # Serialized cost overrun regressor
│   │   └── feature_meta.pkl     # Feature mappings & evaluation metrics
│   ├── generate_dataset.py      # Non-linear synthetic data generator
│   ├── train_models.py          # Scikit-learn training pipeline
│   └── evaluate_models.py       # Diagnostics & feature importance reporter
│
├── frontend/
│   ├── src/
│   │   ├── components/          # StatCard, HealthGauge, RiskBadge, WhatIfSimulator...
│   │   ├── pages/               # Dashboard, Projects, ProjectDetails, RiskAnalysis, Alerts, About
│   │   ├── services/api.js      # Central API client
│   │   ├── App.jsx              # Main tab routing & state layout
│   │   ├── index.css            # Tailwind styles & theme
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── start_backend.bat            # Quick launcher for FastAPI backend
├── start_frontend.bat           # Quick launcher for React frontend
├── run_paimana.bat              # One-click dual service launcher
└── README.md                    # Comprehensive documentation
```

---

## 🚀 Quick Setup & Startup Guide

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)

### Option A: One-Click Startup (Windows)
Double-click `run_paimana.bat` or run:
```cmd
run_paimana.bat
```

---

### Option B: Manual Step-by-Step Setup

#### 1. Backend & ML Setup
```bash
# 1. Install Python dependencies
cd backend
pip install -r requirements.txt

# 2. Generate training data and train the ML models (from project root)
cd ..
python ml/generate_dataset.py
python ml/train_models.py
python ml/evaluate_models.py

# 3. Seed SQLite database with 18 realistic projects
python -m backend.seed_data

# 4. Start FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at: **http://127.0.0.1:8000** (Swagger API Docs at `/docs`)*

#### 2. Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```
*Frontend runs at: **http://localhost:5173***

---

## 🎯 Step-by-Step SIH 2026 Demo Flow

To demonstrate the full capability of PAIMANA to hackathon evaluators:

1. **Executive Dashboard**:
   - Open `http://localhost:5173`.
   - Observe real-time portfolio metrics: **Total Projects (18)**, **On Track**, **At Risk**, **Critical Interventions**.
   - Review the **Risk Tier Distribution Donut**, **Schedule Variance Chart**, and the **"Projects Requiring Immediate Attention"** table.
2. **Projects Explorer**:
   - Click **Projects Explorer** in the sidebar.
   - Filter by Sector (e.g. *Metro*, *Railway*, *Highway*) or Risk Tier (*Critical*, *High*).
   - Switch between **Table View** and **Card Grid View**.
3. **Project Inspection & Health Score**:
   - Select a high-risk project (e.g., **Pune Metro Line 3 Extension** or **Polavaram Main Canal**).
   - Inspect the multivariate **Project Health Score (0–100)** and its transparent breakdown:
     - *Schedule Health (30%)*
     - *Cost Health (20%)*
     - *Resource Health (20%)*
     - *Contractor Health (15%)*
     - *Milestones Health (15%)*
4. **Trigger Live AI Analysis**:
   - Click **"RUN AI ANALYSIS"**.
   - The platform sends real project parameters to the FastAPI inference endpoint.
   - View the **Overall Risk Level (CRITICAL)**, **Confidence (94%)**, **Predicted Delay (+11.4 Months)**, and **Estimated Cost Overrun (+26.8%)**.
5. **Root-Cause Explainability ("Why is this project at risk?")**:
   - Read the dynamically generated root-cause breakdown explaining that *Actual progress is 25.5% behind baseline*, *Contractor score is 51/100*, and *Material availability is constrained at 48%*.
6. **Prescriptive AI Recommendations**:
   - Review actionable, prioritized recommendations (e.g. *Activate Critical Path Fast-Tracking*, *Deploy Independent Contractor Audit*, *Establish Dual-Source Procurement*) complete with designated administrative owners and target impacts.
7. **Future Trajectory Projection**:
   - Inspect the simulated 1-Month, 3-Month, and 6-Month risk escalation timeline.
8. **Interactive "What-If" Scenario Sandbox**:
   - Scroll down to the What-If Sandbox.
   - Adjust the sliders: increase **Contractor Score** to 90/100, increase **Resource Availability** to 95%, and reduce **Delay Days**.
   - Click **"Simulate Mitigation Impact"** to watch the ML engine immediately re-predict the project shifting from **CRITICAL** down to **LOW / ON TRACK**!
9. **Early-Warning Alerts Desk**:
   - Explore the **Critical Alerts** page to triage early notifications and mark items as resolved.

---

## 🌐 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root health and platform metadata |
| `GET` | `/api/dashboard/stats` | Aggregated KPI stats, risk distribution, and attention table |
| `GET` | `/api/projects` | Filterable and sortable project directory |
| `GET` | `/api/projects/{id}` | Detailed telemetry and baseline for a single project |
| `POST` | `/api/predict-risk` | Live ML inference and What-If scenario sandbox prediction |
| `GET` | `/api/projects/{id}/analysis` | Run comprehensive AI risk analysis on a project |
| `GET` | `/api/alerts` | Filterable early-warning alert notifications |
| `PUT` | `/api/alerts/{id}/read` | Mark individual alert as read |
| `POST` | `/api/alerts/mark-all-read` | Mark all alerts as read |

---

## ⚖️ Limitations & Future Scope

### Limitations in Prototype:
- **Synthetic Training Data**: Due to the proprietary nature of government project logs, models are trained on representative synthetic data with verified structural distributions.
- **Static Sensor Telemetry**: Telemetry is updated via API polling rather than direct on-site IoT edge sensors.

### Future Scope for SIH 2026 Production:
- **Drone Survey & Computer Vision Integration**: Automated aerial photogrammetry for autonomous earthwork progress calculation.
- **BIM (Building Information Modeling) 5D Sync**: Direct integration with IFC / Autodesk Construction Cloud models.
- **Automated Weather API Feeds**: Real-time integration with IMD (India Meteorological Department) Doppler radar APIs.

---

## 🏆 Smart India Hackathon (SIH) 2026
*Built by Team PAIMANA for National Infrastructure Monitoring & Decision Support.*
