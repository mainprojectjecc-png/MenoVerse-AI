from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User, Cycle, Symptom, RiskAssessment, Recommendation
from schemas import (
    UserOut, UserCreate, UserLogin, CycleCreate, CycleOut,
    SymptomCreate, SymptomOut, RiskAssessmentCreate, RiskAssessmentOut,
    RecommendationCreate, RecommendationOut
)
from auth import hash_password, verify_password

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "MenoVerse AI Backend Running"}

@app.get("/users", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.Email == user.Email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        Name=user.Name,
        Age=user.Age,
        Email=user.Email,
        Password=hash_password(user.Password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.Email == credentials.Email).first()
    if not user or not verify_password(credentials.Password, user.Password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "UserID": user.UserID, "Name": user.Name}

@app.post("/cycles", response_model=CycleOut)
def create_cycle(cycle: CycleCreate, db: Session = Depends(get_db)):
    new_cycle = Cycle(**cycle.dict())
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    return new_cycle

@app.get("/cycles/{user_id}", response_model=List[CycleOut])
def get_cycles(user_id: int, db: Session = Depends(get_db)):
    return db.query(Cycle).filter(Cycle.UserID == user_id).all()

@app.post("/symptoms", response_model=SymptomOut)
def create_symptom(symptom: SymptomCreate, db: Session = Depends(get_db)):
    new_symptom = Symptom(**symptom.dict())
    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)
    return new_symptom

@app.get("/symptoms/{user_id}", response_model=List[SymptomOut])
def get_symptoms(user_id: int, db: Session = Depends(get_db)):
    return db.query(Symptom).filter(Symptom.UserID == user_id).all()

@app.post("/riskassessment", response_model=RiskAssessmentOut)
def create_risk(risk: RiskAssessmentCreate, db: Session = Depends(get_db)):
    new_risk = RiskAssessment(**risk.dict())
    db.add(new_risk)
    db.commit()
    db.refresh(new_risk)
    return new_risk

@app.get("/riskassessment/{user_id}", response_model=List[RiskAssessmentOut])
def get_risk(user_id: int, db: Session = Depends(get_db)):
    return db.query(RiskAssessment).filter(RiskAssessment.UserID == user_id).all()

@app.post("/recommendation", response_model=RecommendationOut)
def create_recommendation(rec: RecommendationCreate, db: Session = Depends(get_db)):
    new_rec = Recommendation(**rec.dict())
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    return new_rec

@app.get("/recommendation/{user_id}", response_model=List[RecommendationOut])
def get_recommendation(user_id: int, db: Session = Depends(get_db)):
    return db.query(Recommendation).filter(Recommendation.UserID == user_id).all()

@app.put("/cycles/{cycle_id}", response_model=CycleOut)
def update_cycle(cycle_id: int, cycle: CycleCreate, db: Session = Depends(get_db)):
    existing = db.query(Cycle).filter(Cycle.CycleID == cycle_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Cycle not found")
    for key, value in cycle.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@app.delete("/cycles/{cycle_id}")
def delete_cycle(cycle_id: int, db: Session = Depends(get_db)):
    existing = db.query(Cycle).filter(Cycle.CycleID == cycle_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Cycle not found")
    db.delete(existing)
    db.commit()
    return {"message": "Cycle deleted successfully"}

@app.put("/symptoms/{symptom_id}", response_model=SymptomOut)
def update_symptom(symptom_id: int, symptom: SymptomCreate, db: Session = Depends(get_db)):
    existing = db.query(Symptom).filter(Symptom.SymptomID == symptom_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Symptom not found")
    for key, value in symptom.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@app.delete("/symptoms/{symptom_id}")
def delete_symptom(symptom_id: int, db: Session = Depends(get_db)):
    existing = db.query(Symptom).filter(Symptom.SymptomID == symptom_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Symptom not found")
    db.delete(existing)
    db.commit()
    return {"message": "Symptom deleted successfully"}

@app.put("/recommendation/{recommendation_id}", response_model=RecommendationOut)
def update_recommendation(recommendation_id: int, rec: RecommendationCreate, db: Session = Depends(get_db)):
    existing = db.query(Recommendation).filter(Recommendation.RecommendationID == recommendation_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    for key, value in rec.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@app.delete("/recommendation/{recommendation_id}")
def delete_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    existing = db.query(Recommendation).filter(Recommendation.RecommendationID == recommendation_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    db.delete(existing)
    db.commit()
    return {"message": "Recommendation deleted successfully"}

@app.put("/riskassessment/{risk_id}", response_model=RiskAssessmentOut)
def update_risk(risk_id: int, risk: RiskAssessmentCreate, db: Session = Depends(get_db)):
    existing = db.query(RiskAssessment).filter(RiskAssessment.RiskID == risk_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    for key, value in risk.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@app.delete("/riskassessment/{risk_id}")
def delete_risk(risk_id: int, db: Session = Depends(get_db)):
    existing = db.query(RiskAssessment).filter(RiskAssessment.RiskID == risk_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    db.delete(existing)
    db.commit()
    return {"message": "Risk assessment deleted successfully"}