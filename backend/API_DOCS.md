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
  "SavedRiskID": int,
  "SavedRecommendationID": int,
  "Recommendation": {
    "DietPlan": string,
    "ExercisePlan": string,
    "YogaPlan": string,
    "LifestyleTips": string
  }
}
```

Notes:

- All text values must match exactly (case-sensitive) — these are fixed categories the model was trained on, not free text.
- Weight_kg and Stress_Level must be numbers, everything else is text.
- The result is automatically saved to the RiskAssessment table under the given UserID.
- Recommendations are now personalized based on the individual's specific symptoms (hot flashes, sleep, anxiety, stress level, headaches, heart palpitations, exercise habits, etc.) — not just the overall risk category.

## Voice Journal

### POST /voicejournal

Creates a new journal entry (text or audio reference).

Body: { "UserID", "EntryDate", "Content", "AudioURL" }

### GET /voicejournal/{user_id}

Returns all journal entries for a given user.

### PUT /voicejournal/{journal_id}

Updates an existing journal entry.

### DELETE /voicejournal/{journal_id}

Deletes a journal entry.

## Project Status Summary

### Completed

- Full authentication: register/login with bcrypt password hashing
- Full CRUD (Create/Read/Update/Delete) on: Users (partial), Cycles, Symptoms, RiskAssessment, Recommendation, VoiceJournal — 25 endpoints total
- /predict — runs the trained ML model on 16 survey inputs, automatically saves both a RiskAssessment AND a matching Recommendation in one call
- Input validation (email format, age range, password length) via Pydantic
- CORS configured for frontend integration
- Database backed up
- Manually tested via Swagger UI for every endpoint

### Known Limitations

- **No session/token authentication (JWT).** Login confirms credentials but does not issue a token, and endpoints do not verify that a request is coming from an authenticated user. This was deferred to avoid disrupting in-progress frontend work, and should be addressed before final production deployment.

- **Model accuracy is 67.95%**, with a known weakness on the "Low" risk category due to class imbalance in the training dataset (13 "Low" examples vs. 228 "High"). The model currently cannot correctly predict "Low" risk cases.

- **Users table has partial CRUD** — no endpoint yet to update or delete a user's own profile (e.g., change name/email, or a password reset flow).

Yes. You want the **new section in the exact same simple formatting style as the document you sent** — using `**##`, `**###`, and `\-`, not a differently formatted Markdown style.


**## Latest Updates**

**### JWT Authentication**

- JWT authentication has been added to the backend.

- **POST /login** now verifies the user's email and password and returns a JWT access token.

- Passwords continue to be securely hashed using bcrypt.

- JWT authentication provides secure authentication for protected API requests.

**### AI Prediction Updates**

- **POST /predict** has been successfully tested with the trained Random Forest model.

- The prediction automatically saves both a RiskAssessment and a Recommendation in the database.

- The response includes the RiskLevel, Confidence score, SavedRiskID, SavedRecommendationID, and personalized Recommendation.

- Recommendations are personalized based on the user's survey responses and symptoms, including hot flashes, sleep disturbances, fatigue, anxiety, stress level, headaches, heart palpitations, exercise habits, and other relevant factors.

**### API Testing Updates**

- The following endpoints have been manually tested successfully using Swagger UI:

- POST /register

- POST /login

- GET /users

- POST /cycles

- GET /cycles/{user_id}

- PUT /cycles/{cycle_id}

- DELETE /cycles/{cycle_id}

- POST /symptoms

- GET /symptoms/{user_id}

- POST /predict

- GET /recommendations/{user_id}

- GET /risk/{user_id}

- GET /home

**### Frontend Integration**

- Frontend registration and login are connected to the backend authentication system.

- Users can log in through the frontend and access the dashboard.

- The Assessment page sends survey responses to the **POST /predict** endpoint.

- The frontend displays the returned risk level, confidence score, and personalized recommendations.

**### Current Status**

- Backend authentication, database operations, ML prediction, recommendation generation, and frontend integration have been implemented and tested.

- Swagger UI is available at **/docs** for interactive API testing.

**Keep everything above unchanged.** Just paste this section at the bottom of your existing document, save it, and then we can push it to Git.

**## Latest Updates**

**### JWT Authentication**

\- JWT authentication has been added to the backend.

\- **POST /login** now verifies the user's email and password and returns a JWT access token.

\- Passwords continue to be securely hashed using bcrypt.

\- JWT authentication provides secure authentication for protected API requests.

**### Endpoint Authorization**

\- Protected endpoints now require a valid JWT access token.

\- Users can only access their own cycles, symptoms, risk assessments, recommendations, and voice journal records.

\- Users cannot access or modify another user's records.

\- UserID values submitted when creating records are overridden with the authenticated user's ID.

\- Cross-user access attempts return a **403 Forbidden** response.

**### AI Prediction Updates**

\- **POST /predict** has been successfully tested with the trained Random Forest model.

\- The prediction automatically saves both a RiskAssessment and a Recommendation in the database.

\- The response includes the RiskLevel, Confidence score, SavedRiskID, SavedRecommendationID, and personalized Recommendation.

\- Recommendations are personalized based on the user's survey responses and symptoms, including hot flashes, sleep disturbances, fatigue, anxiety, stress level, headaches, heart palpitations, exercise habits, and other relevant factors.

**### Symptoms Updates**

\- **POST /symptoms** is connected to the frontend Symptoms page.

\- Users can record hot flashes, mood, sleep quality, fatigue, and headache severity.

\- Symptom severity values are stored as numeric values from 0 to 3.

\- Successfully saved symptoms are stored in the database under the authenticated user's UserID.

\- The Dashboard retrieves and displays the user's latest saved symptoms.

**### Frontend Integration**

\- Frontend registration and login are connected to the backend authentication system.

\- Users can log in through the frontend and access the dashboard.

\- The Assessment page sends survey responses to the **POST /predict** endpoint.

\- The frontend displays the returned risk level, confidence score, and personalized recommendations.

\- The Symptoms page sends symptom data to the **POST /symptoms** endpoint.

\- The Dashboard displays the latest saved symptom information from the backend.

**### API Testing Updates**

\- Protected endpoints have been manually tested using JWT authentication.

\- Cross-user access attempts were tested and correctly returned **403 Forbidden**.

\- POST requests were tested to confirm that the authenticated user's UserID is enforced.

\- PUT requests were tested to confirm ownership protection.

\- **POST /predict** was tested successfully with authenticated users.

\- **POST /symptoms** was tested successfully and verified in the database.

**### Current Status**

\- Backend authentication, database operations, ML prediction, recommendation generation, symptom logging, endpoint authorization, and frontend integration have been implemented and tested.

\- The Assessment flow successfully connects the frontend to the ML prediction backend.

\- The Symptoms flow successfully saves data to the database and displays the latest symptoms on the Dashboard.

\- Swagger UI is available at **/docs** for interactive API testing.