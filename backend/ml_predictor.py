from pathlib import Path

import joblib
import numpy as np
import pandas as pd


BACKEND_DIR = Path(__file__).resolve().parent
MODEL_PATH = BACKEND_DIR / "menopause_stage_model.pkl"
DATA_PATH = (
    BACKEND_DIR.parent
    / "dataset"
    / "menopause_synthetic_500_age45-49_v4.xlsx"
)
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
FEATURE_LABELS = {
    "Age Group": "Age group",
    "Weight (kg)": "Weight",
    "Menstrual Cycle Regular?": "Menstrual cycle regularity",
    "Avg Menstrual Cycle Length": "Average cycle length",
    "Hot Flashes": "Hot flashes",
    "Night Sweats": "Night sweats",
    "Sleep Disturbances": "Sleep disturbances",
    "Fatigue": "Fatigue",
    "Anxiety": "Anxiety",
    "Headaches": "Headaches",
    "Heart Palpitations": "Heart palpitations",
    "Exercise/Yoga Frequency": "Exercise or yoga frequency",
    "Avg Sleep Duration": "Average sleep duration",
    "Stress Level": "Stress level",
    "Diagnosed Conditions": "Diagnosed conditions",
    "Family History of Early Menopause?": "Family history of early menopause",
}
STAGE_ORDER = {
    "Premenopause": 0,
    "Early perimenopause": 0,
    "Early": 0,
    "Late perimenopause": 1,
    "Perimenopause": 1,
    "Postmenopause": 2,
}
EXPLANATION_METHOD = (
    "For each answer, the model's expected menopause-stage position was "
    "compared with estimates after substituting values observed for that "
    "question in the training data. This local sensitivity comparison "
    "describes model behavior, not causation."
)


def _load_model() -> tuple[object, list[str]]:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(f"ML model not found at {MODEL_PATH}")

    artifact = joblib.load(MODEL_PATH)
    if not isinstance(artifact, dict) or "model" not in artifact:
        raise ValueError(
            "The model artifact is outdated. Retrain it with backend/trainmodel.py."
        )

    features = artifact.get("features")
    if (
        not isinstance(features, list)
        or not features
        or any(not isinstance(feature, str) or feature not in INPUT_COLUMNS for feature in features)
    ):
        raise ValueError("The trained model contains unsupported input features.")

    return artifact["model"], features


def _model_input(values: dict, features: list[str]) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                feature: values[INPUT_COLUMNS[feature]]
                for feature in features
            }
        ],
        columns=features,
    )


def _stage_expectation(model, probabilities) -> float:
    try:
        return float(sum(
            float(probability) * STAGE_ORDER[str(label)]
            for label, probability in zip(model.classes_, probabilities)
        ))
    except KeyError as error:
        raise ValueError(
            f"The trained model contains an unsupported menopause stage: {error.args[0]}"
        ) from error


def explain_stage(values: dict) -> dict:
    if not DATA_PATH.is_file():
        raise FileNotFoundError(f"ML training dataset not found at {DATA_PATH}")

    model, features = _load_model()
    model_input = _model_input(values, features)
    probabilities = model.predict_proba(model_input)[0]
    predicted_index = int(np.argmax(probabilities))
    menopause_stage = str(model.classes_[predicted_index])
    confidence = float(probabilities[predicted_index])
    current_expectation = _stage_expectation(model, probabilities)

    background = pd.read_excel(DATA_PATH)
    background.columns = background.columns.str.strip()
    missing_features = sorted(set(features) - set(background.columns))
    if missing_features:
        raise ValueError(
            f"Training data is missing model features: {missing_features}"
        )

    effects = []
    for feature in features:
        observed = background[feature].dropna()
        if observed.empty:
            effect = 0.0
        else:
            value_counts = observed.value_counts(sort=False)
            alternatives = pd.concat(
                [model_input] * len(value_counts),
                ignore_index=True,
            )
            alternatives[feature] = value_counts.index.tolist()
            alternative_probabilities = model.predict_proba(alternatives)
            alternative_expectations = [
                _stage_expectation(model, row)
                for row in alternative_probabilities
            ]
            reference_expectation = float(
                np.average(
                    alternative_expectations,
                    weights=value_counts.to_numpy(),
                )
            )
            effect = current_expectation - reference_expectation

        effects.append({
            "key": INPUT_COLUMNS[feature],
            "feature": FEATURE_LABELS[feature],
            "value": values[INPUT_COLUMNS[feature]],
            "effect": effect,
            "contribution": abs(effect),
        })

    largest_effect = max(
        (factor["contribution"] for factor in effects),
        default=0.0,
    )
    for factor in effects:
        contribution = factor["contribution"]
        if contribution <= 1e-8:
            factor["impact"] = "low"
            factor["direction"] = "no_material_change"
            factor["explanation"] = (
                f"{factor['feature']} ({factor['value']}) made little "
                "measurable difference in this local comparison."
            )
            continue

        relative_strength = contribution / largest_effect
        factor["impact"] = (
            "high" if relative_strength >= 0.66
            else "moderate" if relative_strength >= 0.33
            else "low"
        )
        factor["direction"] = (
            "moves_to_later_stage" if factor["effect"] > 0
            else "moves_to_earlier_stage"
        )
        direction_text = "later" if factor["effect"] > 0 else "earlier"
        factor["explanation"] = (
            f"{factor['feature']} ({factor['value']}) shifted the model's "
            f"expected stage {direction_text} compared with alternatives "
            "observed for this answer in the training data."
        )

    effects.sort(key=lambda factor: factor["contribution"], reverse=True)
    public_factors = [
        {key: value for key, value in factor.items() if key != "effect"}
        for factor in effects
    ]
    later_factor = next(
        (
            factor for factor in public_factors
            if factor["direction"] == "moves_to_later_stage"
        ),
        None,
    )
    earlier_factor = next(
        (
            factor for factor in public_factors
            if factor["direction"] == "moves_to_earlier_stage"
        ),
        None,
    )

    if later_factor and earlier_factor:
        insight = (
            f"The model matched your answers most closely with {menopause_stage}. "
            f"{later_factor['feature']} had the strongest influence toward a "
            f"later stage, while {earlier_factor['feature']} shifted the "
            "estimate earlier in this comparison."
        )
    elif later_factor:
        insight = (
            f"The model matched your answers most closely with {menopause_stage}. "
            f"{later_factor['feature']} had the strongest influence toward a "
            "later stage in this comparison."
        )
    elif earlier_factor:
        insight = (
            f"The model matched your answers most closely with {menopause_stage}. "
            f"{earlier_factor['feature']} had the strongest influence toward "
            "an earlier stage in this comparison."
        )
    else:
        insight = (
            f"The model matched your answers most closely with {menopause_stage}. "
            "No individual answer shifted the expected stage substantially "
            "compared with observed alternatives."
        )

    return {
        "MenopauseStage": menopause_stage,
        "RiskLevel": menopause_stage,
        "Confidence": confidence,
        "Factors": public_factors,
        "PersonalizedInsight": insight,
        "ExplanationMethod": EXPLANATION_METHOD,
    }


def predict_stage(values: dict) -> tuple[str, float]:
    prediction = explain_stage(values)
    return prediction["MenopauseStage"], prediction["Confidence"]
