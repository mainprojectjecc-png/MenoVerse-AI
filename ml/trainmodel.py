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

# ============================================================
# 1. LOAD DATASET
# ============================================================

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


# ============================================================
# 2. CLEAN COLUMN NAMES
# ============================================================

df.columns = df.columns.str.strip()


# ============================================================
# 3. CREATE PROTOTYPE SCREENING LABEL
# ============================================================

def calculate_risk(row):

    score = 0

    # Age
    age = str(row["Age Group"]).lower()

    if "45" in age or "55" in age or "over 55" in age:
        score += 2
    elif "35" in age:
        score += 1

    # Menstrual cycle regularity
    cycle_regular = str(
        row["Menstrual Cycle Regular?"]
    ).lower()

    if cycle_regular == "no":
        score += 2

    # Cycle length
    cycle_length = str(
        row["Avg Menstrual Cycle Length"]
    ).lower()

    if "more than 35" in cycle_length:
        score += 2
    elif "29" in cycle_length:
        score += 1

    # Symptoms
    symptoms = [
        "Hot Flashes",
        "Night Sweats",
        "Sleep Disturbances",
        "Fatigue",
        "Anxiety",
        "Headaches",
        "Heart Palpitations"
    ]

    for symptom in symptoms:

        value = str(row[symptom]).lower()

        if "severe" in value:
            score += 2

        elif "moderate" in value:
            score += 1

    # Family history
    family = str(
        row["Family History of Early Menopause?"]
    ).lower()

    if family == "yes":
        score += 1

    # Convert score to risk category
    if score >= 8:
        return "High"

    elif score >= 4:
        return "Moderate"

    else:
        return "Low"


df["Perimenopause_Risk"] = df.apply(
    calculate_risk,
    axis=1
)

print("\nRisk distribution:")
print(df["Perimenopause_Risk"].value_counts())


# ============================================================
# 4. SELECT FEATURES
# ============================================================

features = [
    "Age Group",
    "Weight (kg)",
    "Menstrual Cycle Regular?",
    "Avg Menstrual Cycle Length",
    "Hot Flashes",
    "Night Sweats",
    "Sleep Disturbances",
    "Fatigue",
    "Anxiety",
    "Headaches",
    "Heart Palpitations",
    "Exercise/Yoga Frequency",
    "Avg Sleep Duration",
    "Stress Level",
    "Diagnosed Conditions",
    "Family History of Early Menopause?"
]

X = df[features]

y = df["Perimenopause_Risk"]


# ============================================================
# 5. IDENTIFY DATA TYPES
# ============================================================

categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_features = X.select_dtypes(
    include=["int64", "float64"]
).columns.tolist()

print("\nCategorical features:")
print(categorical_features)

print("\nNumerical features:")
print(numerical_features)


# ============================================================
# 6. PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median")
        )
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent")
        ),
        (
            "encoder",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            numeric_pipeline,
            numerical_features
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_features
        )
    ]
)


# ============================================================
# 7. RANDOM FOREST
# ============================================================

random_forest = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)


# ============================================================
# 8. COMPLETE ML PIPELINE
# ============================================================

model = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "classifier",
            random_forest
        )
    ]
)


# ============================================================
# 9. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 10. TRAIN MODEL
# ============================================================

print("\nTraining Random Forest...")

model.fit(
    X_train,
    y_train
)

print("Training completed!")


# ============================================================
# 11. PREDICTION
# ============================================================

y_pred = model.predict(X_test)


# ============================================================
# 12. EVALUATION
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n================================")
print("MODEL RESULTS")
print("================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ============================================================
# 13. SAVE MODEL
# ============================================================

joblib.dump(
    model,
    script_dir / "random_forest_model.pkl"
)

print("\nModel saved as:")
print("random_forest_model.pkl")


# ============================================================
# 14. SAVE LABELED DATASET
# ============================================================

df.to_excel(
    script_dir / "menopause_dataset_with_risk.xlsx",
    index=False
)

print("\nLabeled dataset saved as:")
print("menopause_dataset_with_risk.xlsx")