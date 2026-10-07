from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).resolve().parent / "menopause_stage_model.pkl"
INPUT_COLUMNS = {
    "Age Group": "Age_Group",
    "Weight (kg)": "Weight_kg",
    "Menstrual Cycle Regular?": "Menstrual_Cycle_Regular",
    "Avg Menstrual Cycle Length": "Avg_Menstrual_Cycle_Length",
    "Hot Flashes": "Hot_Flashes",
    "Night Sweats": "Night_Sweats",
    "Sleep Disturbances": "Sleep_Disturbances",
    "Fatigue": "Fatigue",
    "Anxiety": "Anxiety",
    "Headaches": "Headaches",
    "Heart Palpitations": "Heart_Palpitations",
    "Exercise/Yoga Frequency": "Exercise_Yoga_Frequency",
    "Avg Sleep Duration": "Avg_Sleep_Duration",
    "Stress Level": "Stress_Level",
    "Diagnosed Conditions": "Diagnosed_Conditions",
    "Family History of Early Menopause?": "Family_History_Early_Menopause",
}


def predict_stage(values: dict) -> tuple[str, float]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"ML model not found at {MODEL_PATH}"
        )

    artifact = joblib.load(MODEL_PATH)
    if not isinstance(artifact, dict) or "model" not in artifact:
        raise ValueError(
            "The model artifact is outdated. Retrain it with backend/trainmodel.py."
        )

    features = artifact.get("features")
    if not isinstance(features, list) or any(
        column not in INPUT_COLUMNS for column in features
    ):
        raise ValueError("The trained model contains unsupported input features.")

    model_input = pd.DataFrame(
        [
            {
                column: values[INPUT_COLUMNS[column]]
                for column in features
            }
        ],
        columns=features,
    )
    model = artifact["model"]
    prediction = model.predict(model_input)[0]
    confidence = float(model.predict_proba(model_input)[0].max())

    return str(prediction), confidence