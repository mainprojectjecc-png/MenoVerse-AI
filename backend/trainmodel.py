import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

script_dir = Path(__file__).resolve().parent
file_path = script_dir / "menopause_survey_random2.xlsx"

if not file_path.exists() or file_path.stat().st_size == 0:
    raise FileNotFoundError(
        f"Dataset is missing or empty: {file_path}. "
        "Place a valid menopause_survey_random2.xlsx file in the ml folder."
    )

df = pd.read_excel(file_path)
print("Dataset shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

df.columns = df.columns.str.strip()

def calculate_risk(row):
    score = 0
    age = str(row["Age Group"]).lower()
    if "45" in age or "55" in age or "over 55" in age:
        score += 2
    elif "35" in age:
        score += 1
    cycle_regular = str(row["Menstrual Cycle Regular?"]).lower()
    if cycle_regular == "no":
        score += 2
    cycle_length = str(row["Avg Menstrual Cycle Length"]).lower()
    if "more than 35" in cycle_length:
        score += 2
    elif "29" in cycle_length:
        score += 1
    symptoms = [
        "Hot Flashes", "Night Sweats", "Sleep Disturbances",
        "Fatigue", "Anxiety", "Headaches", "Heart Palpitations"
    ]
    for symptom in symptoms:
        value = str(row[symptom]).lower()
        if "severe" in value:
            score += 2
        elif "moderate" in value:
            score += 1
    family = str(row["Family History of Early Menopause?"]).lower()
    if family == "yes":
        score += 1
    if score >= 8:
        return "High"
    elif score >= 4:
        return "Moderate"
    else:
        return "Low"

df["Perimenopause_Risk"] = df.apply(calculate_risk, axis=1)
print("\nRisk distribution:")
print(df["Perimenopause_Risk"].value_counts())

features = [
    "Age Group", "Weight (kg)", "Menstrual Cycle Regular?",
    "Avg Menstrual Cycle Length", "Hot Flashes", "Night Sweats",
    "Sleep Disturbances", "Fatigue", "Anxiety", "Headaches",
    "Heart Palpitations", "Exercise/Yoga Frequency", "Avg Sleep Duration",
    "Stress Level", "Diagnosed Conditions", "Family History of Early Menopause?"
]

X = df[features]
y = df["Perimenopause_Risk"]

categorical_features = X.select_dtypes(include=["object"]).columns.tolist()
numerical_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

print("\nCategorical features:")
print(categorical_features)
print("\nNumerical features:")
print(numerical_features)

numeric_pipeline = Pipeline(steps=[("imputer", SimpleImputer(strategy="median"))])
categorical_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(transformers=[
    ("numeric", numeric_pipeline, numerical_features),
    ("categorical", categorical_pipeline, categorical_features)
])

random_forest = RandomForestClassifier(
    n_estimators=200, max_depth=10, random_state=42, class_weight="balanced"
)

model = Pipeline(steps=[("preprocessor", preprocessor), ("classifier", random_forest)])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)
print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

print("\nTraining Random Forest...")
model.fit(X_train, y_train)
print("Training completed!")

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("\n================================")
print("MODEL RESULTS")
print("================================")
print(f"Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

joblib.dump(model, script_dir / "random_forest_model.pkl")
print("\nModel saved as: random_forest_model.pkl")

df.to_excel(script_dir / "menopause_dataset_with_risk.xlsx", index=False)
print("\nLabeled dataset saved as: menopause_dataset_with_risk.xlsx")