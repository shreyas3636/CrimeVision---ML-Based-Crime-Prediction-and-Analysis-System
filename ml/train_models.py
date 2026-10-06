import pandas as pd
import numpy as np
import json
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_and_evaluate():
    # Path setup
    data_path = os.path.join("data", "crime_dataset.csv")
    if not os.path.exists(data_path):
        from generate_dataset import generate_crime_data
        df = generate_crime_data(5000)
        os.makedirs("data", exist_ok=True)
        df.to_csv(data_path, index=False)
        df.to_json(os.path.join("data", "crime_dataset.json"), orient="records", indent=2)
    else:
        df = pd.read_csv(data_path)
        
    print(f"Loaded dataset with {len(df)} samples.")

    # Categorical encoders
    encoders = {}
    cat_cols = ["location", "area_type", "day_of_week"]
    
    df_encoded = df.copy()
    for col in cat_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df[col])
        encoders[col] = {str(k): int(v) for k, v in zip(le.classes_, range(len(le.classes_)))}
        # Save fit encoder object
        os.makedirs("models", exist_ok=True)
        joblib.dump(le, f"models/encoder_{col}.joblib")

    # Target Encoders
    target_le = LabelEncoder()
    df_encoded["target_risk"] = target_le.fit_transform(df["risk_level"])
    joblib.dump(target_le, "models/encoder_target_risk.joblib")
    
    crime_le = LabelEncoder()
    df_encoded["target_crime"] = crime_le.fit_transform(df["crime_type"])
    joblib.dump(crime_le, "models/encoder_target_crime.joblib")
    
    encoders["risk_level_classes"] = list(target_le.classes_)
    encoders["crime_type_classes"] = list(crime_le.classes_)
    
    with open("models/label_encoders.json", "w") as f:
        json.dump(encoders, f, indent=2)

    # Features and Target
    feature_cols = [
        "location", "area_type", "hour", "day_of_week", 
        "is_weekend", "population_density", "previous_crime_records"
    ]
    
    X = df_encoded[feature_cols]
    y_risk = df_encoded["target_risk"]
    y_crime = df_encoded["target_crime"]

    # Train test split
    X_train, X_test, y_train_risk, y_test_risk = train_test_split(
        X, y_risk, test_size=0.2, random_state=42, stratify=y_risk
    )
    _, _, y_train_crime, y_test_crime = train_test_split(
        X, y_crime, test_size=0.2, random_state=42, stratify=y_crime
    )

    models = {
        "Random Forest": RandomForestClassifier(n_estimators=120, max_depth=12, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, eval_metric="mlogloss"),
        "Decision Tree": DecisionTreeClassifier(max_depth=8, random_state=42)
    }

    metrics_summary = {}

    print("\nTraining models for Crime Risk Level Prediction...")
    for name, model in models.items():
        # Fit risk model
        model.fit(X_train, y_train_risk)
        y_pred = model.predict(X_test)
        
        acc = float(accuracy_score(y_test_risk, y_pred))
        prec = float(precision_score(y_test_risk, y_pred, average="weighted"))
        rec = float(recall_score(y_test_risk, y_pred, average="weighted"))
        f1 = float(f1_score(y_test_risk, y_pred, average="weighted"))
        cm = confusion_matrix(y_test_risk, y_pred).tolist()
        
        # Save model
        clean_name = name.lower().replace(" ", "_")
        joblib.dump(model, f"models/{clean_name}_risk.joblib")
        
        # Train crime category secondary model
        crime_model = RandomForestClassifier(n_estimators=100, random_state=42) if name == "Random Forest" else (
            XGBClassifier(n_estimators=80, random_state=42, eval_metric="mlogloss") if name == "XGBoost" else DecisionTreeClassifier(random_state=42)
        )
        crime_model.fit(X_train, y_train_crime)
        joblib.dump(crime_model, f"models/{clean_name}_crime.joblib")
        
        # Feature importances
        if hasattr(model, "feature_importances_"):
            importances = [float(x) for x in model.feature_importances_]
        else:
            importances = [0.0] * len(feature_cols)

        metrics_summary[name] = {
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "confusion_matrix": cm,
            "feature_importances": {col: round(imp * 100, 2) for col, imp in zip(feature_cols, importances)}
        }
        
        print(f"[{name}] Accuracy: {acc*100:.2f}% | Precision: {prec*100:.2f}% | F1: {f1*100:.2f}%")

    with open("models/metrics.json", "w") as f:
        json.dump(metrics_summary, f, indent=2)

    print("\nAll models trained and saved to models/ successfully!")

if __name__ == "__main__":
    train_and_evaluate()
