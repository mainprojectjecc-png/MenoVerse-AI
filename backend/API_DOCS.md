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