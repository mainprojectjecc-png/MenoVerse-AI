import pandas as pd

df = pd.read_excel("menopause_survey_random2.xlsx")
df.columns = df.columns.str.strip()

features = [
    "Age Group", "Weight (kg)", "Menstrual Cycle Regular?",
    "Avg Menstrual Cycle Length", "Hot Flashes", "Night Sweats",
    "Sleep Disturbances", "Fatigue", "Anxiety", "Headaches",
    "Heart Palpitations", "Exercise/Yoga Frequency", "Avg Sleep Duration",
    "Stress Level", "Diagnosed Conditions", "Family History of Early Menopause?"
]

for col in features:
    print(f"\n--- {col} ---")
    print("Data type:", df[col].dtype)
    print("Sample values:", df[col].dropna().unique()[:8])