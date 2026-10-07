from pathlib import Path

import joblib
import numpy as np
import pandas as pd


BACKEND_DIR = Path(__file__).resolve().parent
MODEL_PATH = BACKEND_DIR / "menopause_risk_model.pkl"
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
RISK_ORDER = {"Low": 0, "Moderate": 1, "High": 2}
EXPLANATION_METHOD = (
    "For each answer, the model's expected stage-derived proxy category was "
    "compared with estimates after substituting values observed for that "
    "question in the training data. These local sensitivity comparisons "
    "describe model behavior, not causation or clinical risk."
)


def _load_model() -> tuple[object, list[str]]:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(f"Risk model not found at {MODEL_PATH}")

    artifact = joblib.load(MODEL_PATH)
    if (
        not isinstance(artifact, dict)
        or "model" not in artifact
        or artifact.get("target") != "RiskLevel"
    ):
        raise ValueError(
            "The risk model artifact is missing or outdated. Retrain it with "
            "backend/trainmodel.py."
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
    model_input = pd.DataFrame(
        [
            {
                feature: values[INPUT_COLUMNS[feature]]
                for feature in features
            }
        ],
        columns=features,
    )
    for column in features:
        if model_input[column].dtype == "object":
            model_input[column] = model_input[column].astype(str).str.replace(
                "\ufffd", "–", regex=False
            )
    return model_input


def _risk_expectation(model, probabilities) -> float:
    try:
        return float(sum(
            float(probability) * RISK_ORDER[str(label)]
            for label, probability in zip(model.classes_, probabilities)
        ))
    except KeyError as error:
        raise ValueError(
            f"The trained model contains an unsupported risk category: {error.args[0]}"
        ) from error


def explain_risk(values: dict) -> dict:
    if not DATA_PATH.is_file():
        raise FileNotFoundError(f"ML training dataset not found at {DATA_PATH}")

    model, features = _load_model()
    model_input = _model_input(values, features)
    probabilities = model.predict_proba(model_input)[0]
    predicted_index = int(np.argmax(probabilities))
    risk_level = str(model.classes_[predicted_index])
    confidence = float(probabilities[predicted_index])
    current_expectation = _risk_expectation(model, probabilities)

    background = pd.read_excel(DATA_PATH)
    background.columns = background.columns.str.strip()
    for feature in features:
        if background[feature].dtype == "object":
            background[feature] = background[feature].astype(str).str.replace(
                "\ufffd", "–", regex=False
            )
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
                _risk_expectation(model, row)
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
        direction_text = "higher" if factor["effect"] > 0 else "lower"
        factor["explanation"] = (
            f"{factor['feature']} ({factor['value']}) shifted the model's "
            f"expected proxy category {direction_text} compared with alternatives "
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
            f"The model matched your answers most closely with the {risk_level} "
            f"proxy category. {later_factor['feature']} showed the strongest "
            f"shift toward a higher category, while {earlier_factor['feature']} "
            "shifted the estimate lower in this comparison."
        )
    elif later_factor:
        insight = (
            f"The model matched your answers most closely with the {risk_level} "
            f"proxy category. {later_factor['feature']} showed the strongest "
            "shift toward a higher category in this comparison."
        )
    elif earlier_factor:
        insight = (
            f"The model matched your answers most closely with the {risk_level} "
            f"proxy category. {earlier_factor['feature']} showed the strongest "
            "shift toward a lower category in this comparison."
        )
    else:
        insight = (
            f"The model matched your answers most closely with the {risk_level} "
            "proxy category. No individual answer shifted the expected "
            "category substantially compared with observed alternatives."
        )

    return {
        "RiskLevel": risk_level,
        "Confidence": confidence,
        "Factors": public_factors,
        "PersonalizedInsight": insight,
        "ExplanationMethod": EXPLANATION_METHOD,
    }


def predict_risk(values: dict) -> tuple[str, float]:
    prediction = explain_risk(values)
    return prediction["RiskLevel"], prediction["Confidence"]
