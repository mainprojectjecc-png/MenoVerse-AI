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

Frontend Integration and Recent Updates
Authentication
- Email/password login is handled through POST /login.
- Successful responses include an access token stored in localStorage as part of the authenticated user object.
- The frontend axios client automatically attaches the JWT to the Authorization header as a Bearer token for protected requests.

Dashboard
- The dashboard reads the authenticated user from localStorage and uses the authenticated UserID to request backend data.
- It fetches the latest risk assessment via GET /risk/{user_id}, recommendations via GET /recommendation/{user_id}, cycle data via GET /cycles/{user_id}, and symptom data via GET /symptoms/{user_id}.
- The frontend does not display fake heart-rate, sleep, or step values; only backend-backed risk, cycle, and symptom data is shown.

Insights
- The insights page displays real risk assessment data from GET /risk/{user_id}.
- It displays the latest symptom entries from GET /symptoms/{user_id}.
- It displays the latest cycle information from GET /cycles/{user_id}.
- It displays recommendations from GET /recommendation/{user_id}.
- When wearable or device data is unavailable, the frontend shows an honest empty state instead of inventing metrics.

Profile
- User profile details are loaded from GET /users/{user_id} and merged into the stored authenticated user object.
- Profile updates are sent through PUT /users/{user_id} for the authenticated user.
- Notification preference toggles persist locally in localStorage and are restored when the Profile page mounts. These settings are frontend-only and do not imply a live delivery service.

Exercise
- The featured routine Play/Pause interaction is functional on the frontend and cycles through the existing routine steps without any backend dependency.
- The View All control expands and collapses the visible exercise routines already represented on the page.
- Category filtering remains functional and stays within the existing frontend-only routine list.

Voice Journal
- The View All control expands and collapses the set of existing journal entries already available in the page.
- The frontend does not claim unsupported AI analysis, automatic health scoring, or automatic risk detection from journal entries.

Nutrition
- The page presents general wellness guidance, not personalized medical claims or unsupported health optimization claims.
- Nutrition content remains intentionally non-personalized and avoids unsupported medical assertions.

Frontend cleanup
- Unsupported demo or fictional health measurements were removed from the frontend.
- Unsupported medical statistics and fake health metrics were removed.
- Fictional AI claims were removed from the user-facing interface.
- Unsupported Google/Apple OAuth shortcuts and Forgot Password shortcuts were removed from the login experience.

Verification
- The frontend production build was successfully verified with:
  npm run build

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
User Profile

PUT /users/{user_id}

Updates the authenticated user's profile information.

Path Parameter:

user_id: int

Body:

{
  "Name": "Updated Name",
  "Age": 48,
  "Email": "updated@example.com"
}

Requires a valid JWT access token.

Users can only update their own profile. Attempting to update another user's profile returns 403 Forbidden.

Age is optional when updating the profile.

Returns:

{
  "UserID": int,
  "Name": string,
  "Age": int,
  "Email": string
}


Cycle Tracking

POST /cycles

Creates a new cycle record for the authenticated user.

Body:

{
  "UserID": int,
  "StartDate": "2026-09-12",
  "EndDate": "2026-09-15",
  "CycleLength": 28,
  "Notes": "Cycle entry"
}

Requires a valid JWT access token.

The UserID is taken from the authenticated user and cannot be used to create a cycle for another user.


GET /cycles/{user_id}

Returns cycle records belonging to the authenticated user.

Requires a valid JWT access token.

Users cannot access another user's cycle records.


PUT /cycles/{cycle_id}

Updates an existing cycle record.

Requires a valid JWT access token and ownership of the cycle record.


DELETE /cycles/{cycle_id}

Deletes an existing cycle record.

Requires a valid JWT access token and ownership of the cycle record.

The frontend Cycle Tracking page supports adding, viewing, and deleting cycle records.


Profile and Cycle Tracking Integration

The Profile page is connected to the authenticated user's account information.

Users can edit their Name and Email through the frontend. Profile updates are saved to the Users database table through PUT /users/{user_id}.

The Cycle Tracking page is connected to the backend and supports creating, viewing, and deleting cycle records.


Latest API Testing Updates

PUT /users/{user_id} tested successfully for the authenticated user's own profile.

Cross-user profile update requests are protected by ownership checks.

Cycle entry creation tested successfully from the frontend.

Cycle deletion tested successfully from the frontend.

Profile changes tested successfully and verified through the backend.