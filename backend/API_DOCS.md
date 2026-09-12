MenoVerse AI Backend API Documentation

Base URL: http://127.0.0.1:8000

Authentication
POST /register

Creates a new user account.

Body: { "Name": string, "Age": int, "Email": string, "Password": string }

Returns: { "UserID", "Name", "Age", "Email" }

POST /login

Logs in an existing user and returns a JWT access token.

Body: { "Email": string, "Password": string }

Returns: { "access_token", "token_type", "UserID", "Name" }

GET /users

Returns a list of registered users without passwords.

Requires a valid JWT access token.

Cycles
POST /cycles

Logs a new menstrual/menopause cycle entry.

Body: { "UserID", "StartDate", "EndDate", "CycleLength", "Notes" }

Requires a valid JWT access token. The UserID is taken from the authenticated user.

GET /cycles/{user_id}

Returns all cycle entries for the authenticated user.

Requires a valid JWT access token. Users cannot access another user's cycle records.

PUT /cycles/{cycle_id}

Updates an existing cycle entry.

Requires a valid JWT access token and ownership of the cycle record.

DELETE /cycles/{cycle_id}

Deletes a cycle entry.

Requires a valid JWT access token and ownership of the cycle record.

Symptoms
POST /symptoms

Logs a new symptom entry.

Body: { "UserID", "LogDate", "HotFlashes", "Mood", "SleepQuality", "Fatigue", "Headache" }

Requires a valid JWT access token. The UserID is taken from the authenticated user.

GET /symptoms/{user_id}

Returns all symptom entries for the authenticated user.

Requires a valid JWT access token. Users cannot access another user's symptom records.

PUT /symptoms/{symptom_id}

Updates an existing symptom entry.

Requires a valid JWT access token and ownership of the symptom record.

DELETE /symptoms/{symptom_id}

Deletes a symptom entry.

Requires a valid JWT access token and ownership of the symptom record.

Risk Assessment
POST /risk

Stores an AI-generated risk result.

Body: { "UserID", "RiskScore", "RiskLevel", "Explanation" }

Requires a valid JWT access token. The UserID is taken from the authenticated user.

GET /risk/{user_id}

Returns all risk assessments for the authenticated user.

Requires a valid JWT access token. Users cannot access another user's risk records.

PUT /risk/{risk_id}

Updates an existing risk assessment.

Requires a valid JWT access token and ownership of the risk record.

DELETE /risk/{risk_id}

Deletes a risk assessment.

Requires a valid JWT access token and ownership of the risk record.

Recommendation
POST /recommendation

Stores personalized recommendations.

Body: { "UserID", "DietPlan", "ExercisePlan", "YogaPlan", "LifestyleTips" }

Requires a valid JWT access token. The UserID is taken from the authenticated user.

GET /recommendation/{user_id}

Returns all recommendations for the authenticated user.

Requires a valid JWT access token. Users cannot access another user's recommendations.

PUT /recommendation/{recommendation_id}

Updates an existing recommendation.

Requires a valid JWT access token and ownership of the recommendation record.

DELETE /recommendation/{recommendation_id}

Deletes a recommendation.

Requires a valid JWT access token and ownership of the recommendation record.

Notes
Protected endpoints require a valid JWT access token.
Users can only access and modify their own user-specific records.
Cross-user access attempts return 403 Forbidden.
UserID values submitted when creating protected records are replaced with the authenticated user's UserID.
All endpoints validate input automatically. Invalid inputs return 422 errors.
Passwords are hashed with bcrypt before storage.
Full interactive testing is available at /docs (Swagger UI).
AI Prediction
POST /predict

Runs the trained Random Forest model on survey responses, saves the result to RiskAssessment and Recommendation, and returns the prediction result.

Body:

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
  "Stress_Level": number,
  "Diagnosed_Conditions": "None of the Above" | "condition name",
  "Family_History_Early_Menopause": "No" | "Yes"
}

Requires a valid JWT access token. The prediction is performed for the authenticated user.

Returns:

{
  "RiskLevel": "Low" | "Moderate" | "High",
  "Confidence": float,
  "SavedRiskID": int,
  "SavedRecommendationID": int,
  "Recommendation": {
    "DietPlan": string,
    "ExercisePlan": string,
    "YogaPlan": string,
    "LifestyleTips": string
  }
}

Notes:

Text values must match the categories expected by the trained model.
Weight_kg and Stress_Level must be numbers.
The result is automatically saved to the RiskAssessment table under the authenticated user's UserID.
A personalized Recommendation is automatically generated and saved.
Recommendations consider the individual's survey responses and relevant symptoms.
Voice Journal
POST /voicejournal

Creates a new journal entry (text or audio reference).

Body: { "UserID", "EntryDate", "Content", "AudioURL" }

Requires a valid JWT access token. The UserID is taken from the authenticated user.

GET /voicejournal/{user_id}

Returns all journal entries for the authenticated user.

Requires a valid JWT access token. Users cannot access another user's journal records.

PUT /voicejournal/{journal_id}

Updates an existing journal entry.

Requires a valid JWT access token and ownership of the journal record.

DELETE /voicejournal/{journal_id}

Deletes a journal entry.

Requires a valid JWT access token and ownership of the journal record.

Project Status Summary
Completed
User registration and login with bcrypt password hashing.
JWT authentication for protected API endpoints.
JWT ownership and authorization checks for user-specific records.
CRUD operations for Cycles, Symptoms, RiskAssessment, Recommendation, and VoiceJournal.
Users endpoint protected with JWT authentication.
/predict runs the trained Random Forest model on the required survey inputs.
/predict automatically saves a RiskAssessment and matching Recommendation.
Personalized recommendations are generated from survey responses and relevant symptoms.
Input validation through Pydantic.
CORS configured for frontend integration.
Frontend registration and login connected to the backend.
Assessment page connected to /predict.
Symptoms page connected to /symptoms.
Dashboard connected to risk, recommendation, cycle, and latest symptom data.
Database backed up.
Backend and frontend flows manually tested.
Swagger UI available for interactive API testing.
Known Limitations
Model accuracy is 67.95%, with a known weakness on the "Low" risk category due to class imbalance in the training dataset.
The model training dataset contains significantly more High-risk examples than Low-risk examples.
Users table currently has limited profile-management functionality; there is no dedicated endpoint for updating or deleting a user's own profile.
Wearable health metrics such as heart rate, sleep tracking, steps, and watch battery/sync data are not currently connected to a real wearable device.
Cycle tracking currently supports backend storage and retrieval, while the frontend does not yet provide a complete cycle-entry form.
API Testing Updates
POST /register tested successfully.
POST /login tested successfully with JWT token generation.
GET /users tested successfully with authentication.
Cycle CRUD endpoints tested successfully.
Symptom CRUD endpoints tested successfully.
Risk assessment endpoints tested successfully.
Recommendation endpoints tested successfully.
Voice journal endpoints tested successfully.
POST /predict tested successfully with the trained Random Forest model.
Cross-user GET requests were tested and correctly returned 403 Forbidden.
Cross-user PUT requests were tested and correctly returned 403 Forbidden.
POST requests were tested to confirm that submitted UserID values are overridden with the authenticated user's UserID.
Frontend symptom saving was tested and verified in the database.
Dashboard retrieval of the latest saved symptoms was tested successfully.
Frontend Integration
Frontend registration and login are connected to the backend authentication system.
JWT access tokens are automatically attached to protected API requests.
Users can log in through the frontend and access the Dashboard.
The Assessment page sends survey responses to the POST /predict endpoint.
The frontend displays the returned risk level, confidence score, and personalized recommendations.
The Symptoms page sends symptom data to the POST /symptoms endpoint.
The Dashboard retrieves and displays the user's latest saved symptoms.
The Dashboard retrieves and displays the latest risk assessment and recommendation.
Current Status
Backend authentication, authorization, database operations, ML prediction, recommendation generation, symptom logging, and frontend integration have been implemented and tested.
The Assessment flow successfully connects the frontend to the ML prediction backend.
The Symptoms flow successfully saves data to the database and displays the latest symptoms on the Dashboard.
JWT authentication and ownership protection have been tested for protected endpoints.
Swagger UI is available at /docs for interactive API testing.