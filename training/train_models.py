#!/usr/bin/env python3
"""
Agro Insight — Crop Recommendation ML Model Training Pipeline
Developed as part of agricultural decision support research at NIT Tiruchirappalli.

This script:
1. Loads the 2,200 sample Crop Recommendation benchmark dataset.
2. Performs stratified train/test split (80/20) with seed 42 to prevent data leakage.
3. Trains and benchmarks multiple candidate models:
   - Baseline Stratified Dummy Classifier
   - Multinomial Logistic Regression
   - Decision Tree Classifier
   - HistGradientBoosting Classifier
   - Random Forest Classifier (Primary Model)
4. Evaluates test set performance (Accuracy, Macro Precision, Macro Recall, Macro F1).
5. Executes 5-fold Stratified Cross-Validation on the training split.
6. Calculates Gini/MDI Feature Importances.
7. Saves artifacts to models/model_metrics.json and models/crop_rf_model.joblib.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
try:
    import joblib
except ImportError:
    joblib = None

def main():
    print("=" * 70)
    print("🌾 AGRO INSIGHT — MODEL TRAINING & BENCHMARKING PIPELINE")
    print("=" * 70)

    # 1. Path setup
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "crop_recommendation.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Creating benchmark dataset file...")
        from generate_dataset import generate_benchmark_dataset
        df = generate_benchmark_dataset(data_path)
    else:
        df = pd.read_csv(data_path)

    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    target = 'label'

    print(f"Loaded dataset: {len(df)} samples across {df[target].nunique()} crop classes.")
    print(f"Features: {features}")

    # 2. Stratified Train/Test Split
    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")

    # 3. Model Candidates
    models = {
        "Dummy Classifier": DummyClassifier(strategy="stratified", random_state=42),
        "Logistic Regression": Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=500, random_state=42))
        ]),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "HistGradientBoosting": HistGradientBoostingClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=14, random_state=42, n_jobs=-1)
    }

    results = []
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, clf in models.items():
        print(f"\nTraining and validating: {name}...")
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='macro', zero_division=0)
        rec = recall_score(y_test, y_pred, average='macro', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)

        cv_scores = cross_val_score(clf, X_train, y_train, cv=skf, scoring='accuracy', n_jobs=-1)

        print(f"  Test Accuracy:     {acc * 100:.2f}%")
        print(f"  Macro-F1 Score:    {f1:.4f}")
        print(f"  5-Fold CV Mean:    {cv_scores.mean() * 100:.2f}% (±{cv_scores.std() * 100:.2f}%)")

        results.append({
            "model": name,
            "accuracy": float(round(acc, 4)),
            "macro_precision": float(round(prec, 4)),
            "macro_recall": float(round(rec, 4)),
            "macro_f1": float(round(f1, 4)),
            "cv_mean": float(round(cv_scores.mean(), 4)),
            "cv_std": float(round(cv_scores.std(), 4)),
        })

    # 4. Detailed evaluation of best model (Random Forest)
    best_model = models["Random Forest"]
    y_test_pred = best_model.predict(X_test)
    labels = sorted(list(df[target].unique()))

    cm = confusion_matrix(y_test, y_test_pred, labels=labels)
    report = classification_report(y_test, y_test_pred, labels=labels, output_dict=True, zero_division=0)

    feature_importances = dict(zip(features, [float(round(v, 4)) for v in best_model.feature_importances_]))

    metrics_artifact = {
        "project": "Agro Insight",
        "institution": "NIT Tiruchirappalli",
        "dataset": {
            "total_samples": int(len(df)),
            "num_features": len(features),
            "num_classes": int(df[target].nunique()),
            "classes": labels
        },
        "model_comparison": results,
        "selected_model": "Random Forest",
        "feature_importances": feature_importances,
        "confusion_matrix": cm.tolist(),
        "classification_report": report
    }

    metrics_file = os.path.join(models_dir, "model_metrics.json")
    with open(metrics_file, "w") as f:
        json.dump(metrics_artifact, f, indent=2)
    print(f"\n[✓] Saved complete evaluation metrics to {metrics_file}")

    if joblib:
        model_file = os.path.join(models_dir, "crop_rf_model.joblib")
        joblib.dump(best_model, model_file)
        print(f"[✓] Saved serialized model artifact to {model_file}")

    print("\n✅ Training pipeline completed successfully.")

if __name__ == "__main__":
    main()
