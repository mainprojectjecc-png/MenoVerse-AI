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
# PATHS
# ============================================================

# Folder containing this Python file
SCRIPT_DIR = Path(__file__).resolve().parent

# Dataset is one folder above ml, inside dataset
DATASET_PATH = (
    SCRIPT_DIR.parent
    / "dataset"
    / "menopause_survey_random2.xlsx"
)


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("Looking for dataset at:")
print(DATASET_PATH)

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}\n"
        "Make sure menopause_survey_random2.xlsx is inside the dataset folder."
    )

if DATASET_PATH.stat().st_size == 0:
    raise FileNotFoundError(
        f"Dataset is empty: {DATASET_PATH}"
    )

print("\nLoading dataset...")

df = pd.read_excel(DATASET_PATH)

print("Dataset loaded successfully!")
print("Dataset shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# 2. CLEAN COLUMN NAMES
# ============================================================

df.columns = df.columns.astype(str).str.strip()

print("\nCleaned columns:")
print(df.columns.tolist())


# ============================================================
# 3. CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
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

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print("\nERROR: The following columns are missing:")
    for column in missing_columns:
        print("-", column)

    raise KeyError(
        "\nPlease check the column names in your Excel file."
    )


# ============================================================
# 4. CREATE PROTOTYPE SCREENING LABEL
# ============================================================

def calculate_risk(row):

    score = 0

    # --------------------------------------------------------
    # Age
    # --------------------------------------------------------

    age = str(row["Age Group"]).lower()

    if "45" in age or "55" in age or "over 55" in age:
        score += 2

    elif "35" in age:
        score += 1


    # --------------------------------------------------------
    # Menstrual cycle regularity
    # --------------------------------------------------------

    cycle_regular = str(
        row["Menstrual Cycle Regular?"]
    ).lower().strip()

    if cycle_regular == "no":
        score += 2


    # --------------------------------------------------------
    # Menstrual cycle length
    # --------------------------------------------------------

    cycle_length = str(
        row["Avg Menstrual Cycle Length"]
    ).lower()

    if "more than 35" in cycle_length:
        score += 2

    elif "29" in cycle_length:
        score += 1


    # --------------------------------------------------------
    # Symptoms
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Family history
    # --------------------------------------------------------

    family = str(
        row["Family History of Early Menopause?"]
    ).lower().strip()

    if family == "yes":
        score += 1


    # --------------------------------------------------------
    # Convert score into risk category
    # --------------------------------------------------------

    if score >= 8:
        return "High"

    elif score >= 4:
        return "Moderate"

    else:
        return "Low"


# Create risk label
df["Perimenopause_Risk"] = df.apply(
    calculate_risk,
    axis=1
)


print("\nRisk distribution:")
print(
    df["Perimenopause_Risk"].value_counts()
)


# ============================================================
# 5. SELECT FEATURES
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
# 6. IDENTIFY DATA TYPES
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
# 7. PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        )
    ]
)


categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
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
# 8. RANDOM FOREST MODEL
# ============================================================

random_forest = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)


# ============================================================
# 9. COMPLETE ML PIPELINE
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
# 10. TRAIN / TEST SPLIT
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
# 11. TRAIN MODEL
# ============================================================

print("\n================================")
print("TRAINING RANDOM FOREST")
print("================================")

model.fit(
    X_train,
    y_train
)

print("Training completed successfully!")


# ============================================================
# 12. PREDICTION
# ============================================================

print("\nMaking predictions...")

y_pred = model.predict(X_test)


# ============================================================
# 13. EVALUATION
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
# 14. SAVE TRAINED MODEL
# ============================================================

MODEL_PATH = (
    SCRIPT_DIR
    / "random_forest_model.pkl"
)

joblib.dump(
    model,
    MODEL_PATH
)

print("\n================================")
print("MODEL SAVED")
print("================================")

print(
    f"Model saved at:\n{MODEL_PATH}"
)


# ============================================================
# 15. SAVE LABELED DATASET
# ============================================================

LABELED_DATASET_PATH = (
    SCRIPT_DIR
    / "menopause_dataset_with_risk.xlsx"
)

df.to_excel(
    LABELED_DATASET_PATH,
    index=False
)

print("\n================================")
print("LABELED DATASET SAVED")
print("================================")

print(
    f"Dataset saved at:\n{LABELED_DATASET_PATH}"
)


# ============================================================
# 16. COMPLETE
# ============================================================

print("\n================================")
print("ML TRAINING COMPLETED!")
print("================================")