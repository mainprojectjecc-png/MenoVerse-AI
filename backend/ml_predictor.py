from pathlib import Path
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent / "random_forest_model.pkl"

def predict_risk(values: dict) -> tuple[str, float]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"ML model not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)
    model_input = pd.DataFrame([{
        "Age Group": values["Age_Group"],
        "Weight (kg)": values["Weight_kg"],
        "Menstrual Cycle Regular?": values["Menstrual_Cycle_Regular"],
        "Avg Menstrual Cycle Length": values["Avg_Menstrual_Cycle_Length"],
        "Hot Flashes": values["Hot_Flashes"],
        "Night Sweats": values["Night_Sweats"],
        "Sleep Disturbances": values["Sleep_Disturbances"],
        "Fatigue": values["Fatigue"],
        "Anxiety": values["Anxiety"],
        "Headaches": values["Headaches"],
        "Heart Palpitations": values["Heart_Palpitations"],
        "Exercise/Yoga Frequency": values["Exercise_Yoga_Frequency"],
        "Avg Sleep Duration": values["Avg_Sleep_Duration"],
        "Stress Level": values["Stress_Level"],
        "Diagnosed Conditions": values["Diagnosed_Conditions"],
        "Family History of Early Menopause?": values["Family_History_Early_Menopause"],
    }])
    prediction = model.predict(model_input)[0]
    probabilities = model.predict_proba(model_input)[0]
    confidence = float(max(probabilities))
    return str(prediction), confidence