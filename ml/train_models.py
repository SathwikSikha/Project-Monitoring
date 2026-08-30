"""
PAIMANA - Machine Learning Training Pipeline
Trains 3 production ML models:
1. Multi-class Risk Level Classifier (RandomForestClassifier: LOW, MEDIUM, HIGH, CRITICAL)
2. Continuous Project Delay Regressor (RandomForestRegressor: Delay in Months)
3. Continuous Cost Overrun Regressor (RandomForestRegressor: Cost Overrun %)
Serializes trained models and metadata to ml/models/ using Joblib.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    classification_report, accuracy_score, f1_score,
    mean_absolute_error, root_mean_squared_error, r2_score
)

def train_paimana_models():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, "data", "projects.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Please run generate_dataset.py first.")

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)

    feature_cols_num = [
        "project_cost", "planned_duration_months", "planned_progress", "actual_progress",
        "progress_deviation", "expenditure_percentage", "cost_progress_ratio",
        "resource_availability", "material_availability", "workforce_availability",
        "contractor_performance", "delay_days", "milestone_completion_rate",
        "change_requests", "weather_impact", "previous_delay_count", "risk_history"
    ]
    feature_cols_cat = ["category"]
    all_features = feature_cols_num + feature_cols_cat

    X = df[all_features]
    y_risk = df["risk_level"]
    y_delay = df["predicted_delay_months"]
    y_cost = df["predicted_cost_overrun_percentage"]

    # Stratified split on risk level
    X_train, X_test, y_risk_train, y_risk_test, y_delay_train, y_delay_test, y_cost_train, y_cost_test = train_test_split(
        X, y_risk, y_delay, y_cost, test_size=0.2, random_state=42, stratify=y_risk
    )

    print(f"Training dataset size: {len(X_train)} samples | Test size: {len(X_test)} samples")

    # Column Transformer Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), feature_cols_num),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), feature_cols_cat)
        ]
    )

    # 1. Risk Classification Model
    print("\n--- Training Model 1: Risk Level Classifier (RandomForest) ---")
    risk_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(
            n_estimators=180,
            max_depth=14,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ))
    ])
    risk_pipeline.fit(X_train, y_risk_train)
    risk_preds = risk_pipeline.predict(X_test)
    risk_acc = accuracy_score(y_risk_test, risk_preds)
    risk_f1 = f1_score(y_risk_test, risk_preds, average="weighted")
    print(f"Risk Classifier Accuracy: {risk_acc * 100:.2f}% | F1 Score: {risk_f1 * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_risk_test, risk_preds))

    # 2. Delay Prediction Regressor
    print("\n--- Training Model 2: Delay Prediction Regressor (RandomForest) ---")
    delay_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=180,
            max_depth=14,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ))
    ])
    delay_pipeline.fit(X_train, y_delay_train)
    delay_preds = delay_pipeline.predict(X_test)
    delay_mae = mean_absolute_error(y_delay_test, delay_preds)
    delay_rmse = root_mean_squared_error(y_delay_test, delay_preds)
    delay_r2 = r2_score(y_delay_test, delay_preds)
    print(f"Delay Model MAE: {delay_mae:.2f} months | RMSE: {delay_rmse:.2f} months | R2 Score: {delay_r2:.4f}")

    # 3. Cost Overrun Regressor
    print("\n--- Training Model 3: Cost Overrun Regressor (RandomForest) ---")
    cost_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=180,
            max_depth=14,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ))
    ])
    cost_pipeline.fit(X_train, y_cost_train)
    cost_preds = cost_pipeline.predict(X_test)
    cost_mae = mean_absolute_error(y_cost_test, cost_preds)
    cost_rmse = root_mean_squared_error(y_cost_test, cost_preds)
    cost_r2 = r2_score(y_cost_test, cost_preds)
    print(f"Cost Model MAE: {cost_mae:.2f}% | RMSE: {cost_rmse:.2f}% | R2 Score: {cost_r2:.4f}")

    # Save Models and Metadata
    print("\nSaving trained models to disk...")
    joblib.dump(risk_pipeline, os.path.join(models_dir, "risk_model.pkl"))
    joblib.dump(delay_pipeline, os.path.join(models_dir, "delay_model.pkl"))
    joblib.dump(cost_pipeline, os.path.join(models_dir, "cost_model.pkl"))

    # Feature metadata for explainability & inference
    categories_list = sorted(df["category"].unique().tolist())
    metadata = {
        "numeric_features": feature_cols_num,
        "categorical_features": feature_cols_cat,
        "all_features": all_features,
        "categories": categories_list,
        "classes": sorted(list(risk_pipeline.named_steps["classifier"].classes_)),
        "metrics": {
            "risk_accuracy": float(risk_acc),
            "risk_f1": float(risk_f1),
            "delay_mae": float(delay_mae),
            "delay_rmse": float(delay_rmse),
            "delay_r2": float(delay_r2),
            "cost_mae": float(cost_mae),
            "cost_rmse": float(cost_rmse),
            "cost_r2": float(cost_r2),
            "training_samples": len(X_train),
            "test_samples": len(X_test)
        }
    }
    joblib.dump(metadata, os.path.join(models_dir, "feature_meta.pkl"))
    print("All models and metadata successfully saved!")

if __name__ == "__main__":
    train_paimana_models()
