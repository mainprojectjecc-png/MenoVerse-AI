from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import (
    User,
    Cycle,
    Symptom,
    RiskAssessment,
    Recommendation,
    VoiceJournal,
)

from schemas import (
    UserOut,
    UserCreate,
    UserUpdate,
    UserLogin,
    Token,
    CycleCreate,
    CycleOut,
    SymptomCreate,
    SymptomOut,
    RiskAssessmentCreate,
    RiskAssessmentOut,
    RecommendationCreate,
    RecommendationOut,
    PredictInput,
    VoiceJournalCreate,
    VoiceJournalOut,
)

from ml_predictor import predict_risk
from auth import hash_password, verify_password, get_current_user, create_access_token


# --------------------------------------------------
# RECOMMENDATION GENERATOR
# --------------------------------------------------

def generate_recommendation(risk_level: str, data: dict) -> dict:
    diet_tips = []
    exercise_tips = []
    yoga_tips = []
    lifestyle_tips = []

    # Risk-based recommendations
    if risk_level == "High":
        diet_tips.append(
            "Increase calcium, vitamin D, and phytoestrogen-rich foods "
            "(soy, flaxseed)"
        )
        lifestyle_tips.append(
            "Consider consulting a gynecologist for symptom management"
        )

    elif risk_level == "Moderate":
        diet_tips.append(
            "Maintain a calcium-rich, balanced diet"
        )

    else:
        diet_tips.append(
            "Maintain a balanced, nutrient-rich diet"
        )

    # Hot flashes
    if data.get("Hot_Flashes") == "Severe":
        diet_tips.append(
            "Reduce caffeine, alcohol, and spicy foods which can trigger hot flashes"
        )
        lifestyle_tips.append(
            "Dress in layers and keep your environment cool"
        )

    # Night sweats
    if data.get("Night_Sweats") == "Severe":
        lifestyle_tips.append(
            "Use breathable bedding and sleepwear to manage night sweats"
        )

    # Sleep
    if (
        data.get("Sleep_Disturbances") == "Severe"
        or data.get("Avg_Sleep_Duration")
        in ["Less than 5 hours", "5-6 hours"]
    ):
        lifestyle_tips.append(
            "Prioritize 7-8 hours of sleep with a consistent bedtime routine"
        )
        yoga_tips.append(
            "Try gentle bedtime yoga or breathing exercises to improve sleep"
        )

    # Anxiety
    if data.get("Anxiety") == "Severe":
        yoga_tips.append(
            "Daily meditation or restorative yoga to manage anxiety"
        )

    # Stress
    if data.get("Stress_Level", 0) >= 4:
        yoga_tips.append(
            "Practice stress-reduction techniques like deep breathing or mindfulness"
        )

    # Fatigue
    if data.get("Fatigue") == "Severe":
        diet_tips.append(
            "Include iron-rich foods and stay hydrated to combat fatigue"
        )

    # Headaches
    if data.get("Headaches") == "Severe":
        lifestyle_tips.append(
            "Track headache triggers and stay well-hydrated; consult a doctor if frequent"
        )

    # Heart palpitations
    if data.get("Heart_Palpitations") == "Severe":
        lifestyle_tips.append(
            "Severe heart palpitations warrant medical evaluation — please consult a doctor"
        )

    # Exercise
    if data.get("Exercise_Yoga_Frequency") == "Never":
        exercise_tips.append(
            "Start with 15-20 minutes of light walking 3x/week"
        )
    else:
        exercise_tips.append(
            "Continue regular exercise, aim for 30 minutes 3-5x/week "
            "including strength training"
        )

    # Family history
    if data.get("Family_History_Early_Menopause") == "Yes":
        lifestyle_tips.append(
            "Given family history, monitor symptoms closely and discuss with a doctor"
        )

    # Diagnosed conditions
    diagnosed_conditions = data.get("Diagnosed_Conditions")

    if diagnosed_conditions not in ["None of the Above", None]:
        lifestyle_tips.append(
            f"Coordinate with your doctor regarding "
            f"{diagnosed_conditions} and menopause symptom overlap"
        )

    # Default recommendations
    if not exercise_tips:
        exercise_tips.append(
            "Regular exercise 2-3x/week for general wellness"
        )

    if not yoga_tips:
        yoga_tips.append(
            "Optional yoga or light stretching"
        )

    if not lifestyle_tips:
        lifestyle_tips.append(
            "Continue healthy habits, monitor for any new symptoms"
        )

    return {
        "DietPlan": "; ".join(diet_tips),
        "ExercisePlan": "; ".join(exercise_tips),
        "YogaPlan": "; ".join(yoga_tips),
        "LifestyleTips": "; ".join(lifestyle_tips),
    }


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI()


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "MenoVerse AI Backend Running"
    }


# --------------------------------------------------
# USERS
# --------------------------------------------------

@app.get("/users", response_model=List[UserOut])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).all()

@app.put("/users/{user_id}")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this user"
        )

    user = db.query(User).filter(
        User.UserID == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.Name = user_update.Name
    if user_update.Age is not None:
        user.Age = user_update.Age

    if user_update.Email is not None:
        user.Email = user_update.Email

    db.commit()
    db.refresh(user)

    return {
        "UserID": user.UserID,
        "Name": user.Name,
        "Age": user.Age,
        "Email": user.Email
    }

# --------------------------------------------------
# REGISTER
# --------------------------------------------------

@app.post("/register", response_model=UserOut)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(User)
        .filter(User.Email == user.Email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        Name=user.Name,
        Age=user.Age,
        Email=user.Email,
        Password=hash_password(user.Password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@app.post("/login", response_model=Token)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.Email == credentials.Email)
        .first()
    )

    if not user or not verify_password(
        credentials.Password,
        user.Password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(user.UserID, user.Email)

    return {
    "access_token": token,
    "token_type": "bearer",
    "UserID": user.UserID,
    "Name": user.Name,
}


# --------------------------------------------------
# CYCLES
# --------------------------------------------------

@app.post("/cycles", response_model=CycleOut)
def create_cycle(
    cycle: CycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = cycle.dict()
    data["UserID"] = current_user.UserID

    new_cycle = Cycle(**data)

    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)

    return new_cycle

@app.get("/cycles/{user_id}", response_model=List[CycleOut])
def get_cycles(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's cycles"
        )

    return (
        db.query(Cycle)
        .filter(Cycle.UserID == user_id)
        .all()
    )


@app.put("/cycles/{cycle_id}", response_model=CycleOut)
def update_cycle(
    cycle_id: int,
    cycle: CycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Cycle)
        .filter(Cycle.CycleID == cycle_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Cycle not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to modify this cycle"
        )

    for key, value in cycle.dict().items():
        if key != "UserID":
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@app.delete("/cycles/{cycle_id}")
def delete_cycle(
    cycle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Cycle)
        .filter(Cycle.CycleID == cycle_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Cycle not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this cycle"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Cycle deleted successfully"
    }

# --------------------------------------------------
# SYMPTOMS
# --------------------------------------------------

@app.post("/symptoms", response_model=SymptomOut)
def create_symptom(
    symptom: SymptomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = symptom.dict()
    data["UserID"] = current_user.UserID

    new_symptom = Symptom(**data)

    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)

    return new_symptom


@app.get("/symptoms/{user_id}", response_model=List[SymptomOut])
def get_symptoms(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's symptoms"
        )

    return (
        db.query(Symptom)
        .filter(Symptom.UserID == user_id)
        .all()
    )

@app.put("/symptoms/{symptom_id}", response_model=SymptomOut)
def update_symptom(
    symptom_id: int,
    symptom: SymptomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Symptom)
        .filter(Symptom.SymptomID == symptom_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Symptom not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to modify this symptom"
        )

    for key, value in symptom.dict().items():
        if key != "UserID":
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing

@app.delete("/symptoms/{symptom_id}")
def delete_symptom(
    symptom_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Symptom)
        .filter(Symptom.SymptomID == symptom_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Symptom not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this symptom"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Symptom deleted successfully"
    }

# --------------------------------------------------
# RISK ASSESSMENT
# --------------------------------------------------

@app.post("/riskassessment", response_model=RiskAssessmentOut)
def create_risk(
    risk: RiskAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = risk.dict()
    data["UserID"] = current_user.UserID

    new_risk = RiskAssessment(**data)

    db.add(new_risk)
    db.commit()
    db.refresh(new_risk)

    return new_risk

@app.get("/risk/{user_id}", response_model=List[RiskAssessmentOut])
def get_risk(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's risk data"
        )

    return (
        db.query(RiskAssessment)
        .filter(RiskAssessment.UserID == user_id)
        .all()
    )


@app.put("/riskassessment/{risk_id}", response_model=RiskAssessmentOut)
def update_risk(
    risk_id: int,
    risk: RiskAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(RiskAssessment)
        .filter(RiskAssessment.RiskID == risk_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Risk assessment not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to modify this risk assessment"
        )

    for key, value in risk.dict().items():
        if key != "UserID":
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@app.delete("/riskassessment/{risk_id}")
def delete_risk(
    risk_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(RiskAssessment)
        .filter(RiskAssessment.RiskID == risk_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Risk assessment not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this risk assessment"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Risk assessment deleted successfully"
    }

# --------------------------------------------------
# ML RISK PREDICTION
# --------------------------------------------------

@app.post("/predict")
def predict(
    data: PredictInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Make sure users can only predict for themselves
    if data.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to create a prediction for this user"
        )

    try:
        risk_level, confidence = predict_risk(
            data.dict()
        )

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    except (KeyError, ValueError, TypeError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid prediction input: {e}"
        )

    # Save risk assessment
    new_risk = RiskAssessment(
        UserID=current_user.UserID,
        RiskScore=confidence,
        RiskLevel=risk_level,
        Explanation=(
            f"AI-predicted {risk_level} risk based on "
            f"survey responses "
            f"(confidence: {confidence:.2f})"
        ),
    )

    db.add(new_risk)
    db.commit()
    db.refresh(new_risk)

    # Generate recommendations
    rec_content = generate_recommendation(
        risk_level,
        data.dict()
    )

    # Save recommendation
    new_rec = Recommendation(
        UserID=current_user.UserID,
        DietPlan=rec_content["DietPlan"],
        ExercisePlan=rec_content["ExercisePlan"],
        YogaPlan=rec_content["YogaPlan"],
        LifestyleTips=rec_content["LifestyleTips"],
    )

    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)

    return {
        "RiskLevel": risk_level,
        "Confidence": confidence,
        "SavedRiskID": new_risk.RiskID,
        "SavedRecommendationID": new_rec.RecommendationID,
        "Recommendation": rec_content
    }

# --------------------------------------------------
# RECOMMENDATIONS
# --------------------------------------------------

@app.post("/recommendation", response_model=RecommendationOut)
def create_recommendation(
    rec: RecommendationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = rec.dict()
    data["UserID"] = current_user.UserID

    new_rec = Recommendation(**data)

    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)

    return new_rec


@app.get(
    "/recommendation/{user_id}",
    response_model=List[RecommendationOut]
)
def get_recommendation(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's recommendation data"
        )

    return (
        db.query(Recommendation)
        .filter(Recommendation.UserID == user_id)
        .all()
    )


@app.put(
    "/recommendation/{recommendation_id}",
    response_model=RecommendationOut
)
def update_recommendation(
    recommendation_id: int,
    rec: RecommendationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Recommendation)
        .filter(
            Recommendation.RecommendationID == recommendation_id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to modify this recommendation"
        )

    for key, value in rec.dict().items():
        if key != "UserID":
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@app.delete("/recommendation/{recommendation_id}")
def delete_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(Recommendation)
        .filter(
            Recommendation.RecommendationID == recommendation_id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this recommendation"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Recommendation deleted successfully"
    }


# --------------------------------------------------
# VOICE JOURNAL
# --------------------------------------------------

@app.post("/voicejournal", response_model=VoiceJournalOut)
def create_journal(
    entry: VoiceJournalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = entry.dict()
    data["UserID"] = current_user.UserID

    new_entry = VoiceJournal(**data)

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@app.get(
    "/voicejournal/{user_id}",
    response_model=List[VoiceJournalOut]
)
def get_journals(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's journal"
        )

    return (
        db.query(VoiceJournal)
        .filter(VoiceJournal.UserID == user_id)
        .all()
    )


@app.put(
    "/voicejournal/{journal_id}",
    response_model=VoiceJournalOut
)
def update_journal(
    journal_id: int,
    entry: VoiceJournalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(VoiceJournal)
        .filter(VoiceJournal.JournalID == journal_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Journal entry not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to modify this journal entry"
        )

    for key, value in entry.dict().items():
        if key != "UserID":
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


@app.delete("/voicejournal/{journal_id}")
def delete_journal(
    journal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = (
        db.query(VoiceJournal)
        .filter(VoiceJournal.JournalID == journal_id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Journal entry not found"
        )

    if existing.UserID != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this journal entry"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Journal entry deleted successfully"
    }