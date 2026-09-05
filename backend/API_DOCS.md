# MenoVerse AI Backend API Documentation

Base URL: http://127.0.0.1:8000

## Authentication

### POST /register
Creates a new user account.
Body: { "Name": string, "Age": int, "Email": string, "Password": string }
Returns: { "UserID", "Name", "Age", "Email" }

### POST /login
Logs in an existing user.
Body: { "Email": string, "Password": string }
Returns: { "message", "UserID", "Name" }

### GET /users
Returns a list of all registered users (no passwords included).

## Cycles

### POST /cycles
Logs a new menstrual/menopause cycle entry.
Body: { "UserID", "StartDate", "EndDate", "CycleLength", "Notes" }

### GET /cycles/{user_id}
Returns all cycle entries for a given user.

### PUT /cycles/{cycle_id}
Updates an existing cycle entry.

### DELETE /cycles/{cycle_id}
Deletes a cycle entry.

## Symptoms

### POST /symptoms
Logs a new symptom entry.
Body: { "UserID", "LogDate", "HotFlashes", "Mood", "SleepQuality", "Fatigue", "Headache" }

### GET /symptoms/{user_id}
Returns all symptom entries for a given user.

### PUT /symptoms/{symptom_id}
Updates an existing symptom entry.

### DELETE /symptoms/{symptom_id}
Deletes a symptom entry.

## Risk Assessment

### POST /riskassessment
Stores an AI-generated risk result.
Body: { "UserID", "RiskScore", "RiskLevel", "Explanation" }

### GET /riskassessment/{user_id}
Returns all risk assessments for a given user.

### PUT /riskassessment/{risk_id}
Updates an existing risk assessment.

### DELETE /riskassessment/{risk_id}
Deletes a risk assessment.

## Recommendation

### POST /recommendation
Stores personalized recommendations.
Body: { "UserID", "DietPlan", "ExercisePlan", "YogaPlan", "LifestyleTips" }

### GET /recommendation/{user_id}
Returns all recommendations for a given user.

### PUT /recommendation/{recommendation_id}
Updates an existing recommendation.

### DELETE /recommendation/{recommendation_id}
Deletes a recommendation.

## Notes
- All endpoints validate input automatically (bad emails, invalid ages, etc. return 422 errors)
- Passwords are hashed with bcrypt before storage
- Full interactive testing available at /docs (Swagger UI)
## AI Prediction

### POST /predict
Runs the trained Random Forest model on survey responses, saves the result to RiskAssessment, and returns it.

Body (all 16 fields required):
```json
{
  "UserID": int,
  "Age_Group": "Over 55" | "35-45" | "46-55",
  "Weight_kg": number,
  "Menstrual_Cycle_Regular": "No" | "Yes" | "Completely over",
  "Avg_Menstrual_Cycle_Length": "More than 35 days" | "21–28 days" | "Not regular" | "Less than 21 days",
  "Hot_Flashes": "Mild" | "Severe",
  "Night_Sweats": "Mild" | "Severe",
  "Sleep_Disturbances": "Mild" | "Severe",
  "Fatigue": "Mild" | "Severe",
  "Anxiety": "Mild" | "Severe",
  "Headaches": "Mild" | "Severe",
  "Heart_Palpitations": "Mild" | "Severe",
  "Exercise_Yoga_Frequency": "Never" | "1-2 days" | "Weekly" | "Daily",
  "Avg_Sleep_Duration": "Less than 5 hours" | "5-6 hours" | "7-8 hours" | "More than 8 hours",
  "Stress_Level": number (1-5),
  "Diagnosed_Conditions": "None of the Above" | condition name (e.g. "PCOS", "Diabetes", "Hypertension"),
  "Family_History_Early_Menopause": "No" | "Yes"
}
```

Returns:
```json
{
  "RiskLevel": "Low" | "Moderate" | "High",
  "Confidence": float (0-1),
  "SavedRiskID": int
}
```

Notes:
- All text values must match exactly (case-sensitive) — these are fixed categories the model was trained on, not free text.
- Weight_kg and Stress_Level must be numbers, everything else is text.
- The result is automatically saved to the RiskAssessment table under the given UserID.