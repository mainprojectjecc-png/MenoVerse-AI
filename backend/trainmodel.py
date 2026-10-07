from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import GridSearchCV, StratifiedKFold, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


script_dir = Path(__file__).resolve().parent
dataset_path = (
    script_dir.parent / "dataset" / "menopause_synthetic_500_age45-49_v4.xlsx"
)
model_path = script_dir / "random_forest_model.pkl"
test_samples = 350
target = "Menopause Stage (Label)"
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
    "Family History of Early Menopause?",
]

if not dataset_path.is_file() or dataset_path.stat().st_size == 0:
    raise FileNotFoundError(f"Dataset is missing or empty: {dataset_path}")

df = pd.read_excel(dataset_path)
df.columns = df.columns.str.strip()
missing_columns = sorted(set(features + [target]) - set(df.columns))
if missing_columns:
    raise ValueError(f"Dataset is missing required columns: {missing_columns}")

df = df.dropna(subset=[target]).copy()
if df[target].nunique() < 2:
    raise ValueError("The dataset must contain at least two target classes.")
if len(df) <= test_samples:
    raise ValueError(
        f"At least {test_samples + 1} labeled rows are required to reserve "
        f"{test_samples} test samples; found {len(df)}."
    )

X = df[features]
y = df[target].astype(str).str.strip()
categorical_features = X.select_dtypes(exclude="number").columns.tolist()
numerical_features = X.select_dtypes(include="number").columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            Pipeline(steps=[("imputer", SimpleImputer(strategy="median"))]),
            numerical_features,
        ),
        (
            "categorical",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("encoder", OneHotEncoder(handle_unknown="ignore")),
                ]
            ),
            categorical_features,
        ),
    ]
)

classifier = RandomForestClassifier(
    n_estimators=300,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)
model = Pipeline(
    steps=[("preprocessor", preprocessor), ("classifier", classifier)]
)
parameter_grid = {
    "classifier__n_estimators": [300, 500],
    "classifier__max_depth": [None, 12],
    "classifier__min_samples_leaf": [1, 2, 4],
    "classifier__max_features": ["sqrt", 0.8],
}

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=test_samples,
    random_state=42,
    stratify=y,
)
search = GridSearchCV(
    model,
    parameter_grid,
    scoring="accuracy",
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
    n_jobs=-1,
)
search.fit(X_train, y_train)
best_model = search.best_estimator_
y_pred = best_model.predict(X_test)

print(f"Dataset: {dataset_path}")
print(f"Rows: {len(df)}")
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
print(f"Best training cross-validation accuracy: {search.best_score_:.2%}")
print(f"Best parameters: {search.best_params_}")
print(f"Target distribution:\n{y.value_counts().to_string()}")
print(f"\nHoldout accuracy: {accuracy_score(y_test, y_pred):.2%}")
print(
    "\nClassification report:\n",
    classification_report(y_test, y_pred, zero_division=0),
)
print(
    "Confusion matrix:\n",
    confusion_matrix(y_test, y_pred, labels=sorted(y.unique())),
)

# Evaluate on the held-out split, then train the deployable model on all rows.
best_model.fit(X, y)
joblib.dump({"model": best_model, "features": features}, model_path)
print(f"\nFull-data model saved to: {model_path}")
