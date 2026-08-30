"""
PAIMANA - ML Model Evaluation and Feature Importance Inspector
Loads trained models and outputs diagnostic evaluation tables and feature importance rankings.
"""

import os
import joblib
import pandas as pd
import numpy as np

def evaluate_models():
    base_dir = os.path.dirname(__file__)
    models_dir = os.path.join(base_dir, "models")
    meta_path = os.path.join(models_dir, "feature_meta.pkl")
    risk_model_path = os.path.join(models_dir, "risk_model.pkl")
    
    if not os.path.exists(meta_path) or not os.path.exists(risk_model_path):
        print("Models not found. Run train_models.py first.")
        return

    meta = joblib.load(meta_path)
    risk_pipeline = joblib.load(risk_model_path)
    
    print("=" * 60)
    print("PAIMANA MODEL EVALUATION REPORT")
    print("=" * 60)
    print(f"Training Samples: {meta['metrics']['training_samples']} | Test Samples: {meta['metrics']['test_samples']}")
    print("-" * 60)
    print(f"1. Risk Classification Accuracy : {meta['metrics']['risk_accuracy']*100:.2f}%")
    print(f"   Risk Classification F1-Score : {meta['metrics']['risk_f1']*100:.2f}%")
    print(f"2. Delay Prediction MAE         : {meta['metrics']['delay_mae']:.2f} months (RMSE: {meta['metrics']['delay_rmse']:.2f}m, R²: {meta['metrics']['delay_r2']:.4f})")
    print(f"3. Cost Overrun Prediction MAE  : {meta['metrics']['cost_mae']:.2f}% (RMSE: {meta['metrics']['cost_rmse']:.2f}%, R²: {meta['metrics']['cost_r2']:.4f})")
    print("=" * 60)

    # Feature Importance
    rf_classifier = risk_pipeline.named_steps["classifier"]
    preprocessor = risk_pipeline.named_steps["preprocessor"]
    
    cat_feature_names = list(preprocessor.named_transformers_["cat"].get_feature_names_out(meta["categorical_features"]))
    feature_names = meta["numeric_features"] + cat_feature_names
    importances = rf_classifier.feature_importances_

    fi_df = pd.DataFrame({
        "Feature": feature_names,
        "Importance": importances
    }).sort_values(by="Importance", ascending=False)

    print("\nTop 10 Most Influential Risk Factors in ML Model:")
    for idx, row in fi_df.head(10).iterrows():
        print(f"  - {row['Feature']:<30} : {row['Importance']*100:.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    evaluate_models()
