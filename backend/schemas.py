from pydantic import BaseModel, EmailStr, Field
from datetime import date

class UserOut(BaseModel):
    UserID: int
    Name: str
    Age: int
    Email: EmailStr

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    Name: str
    Age: int = Field(..., gt=0, lt=120)
    Email: EmailStr
    Password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    Email: EmailStr
    Password: str

class CycleCreate(BaseModel):
    UserID: int
    StartDate: date
    EndDate: date | None = None
    CycleLength: int | None = None
    Notes: str | None = None

class CycleOut(CycleCreate):
    CycleID: int
    class Config:
        from_attributes = True

class SymptomCreate(BaseModel):
    UserID: int
    LogDate: date
    HotFlashes: int | None = None
    Mood: str | None = None
    SleepQuality: str | None = None
    Fatigue: int | None = None
    Headache: int | None = None

class SymptomOut(SymptomCreate):
    SymptomID: int
    class Config:
        from_attributes = True

class RiskAssessmentCreate(BaseModel):
    UserID: int
    RiskScore: float
    RiskLevel: str
    Explanation: str

class RiskAssessmentOut(RiskAssessmentCreate):
    RiskID: int
    class Config:
        from_attributes = True

class RecommendationCreate(BaseModel):
    UserID: int
    DietPlan: str
    ExercisePlan: str
    YogaPlan: str
    LifestyleTips: str

class RecommendationOut(RecommendationCreate):
    RecommendationID: int
    class Config:
        from_attributes = True

class PredictInput(BaseModel):
    UserID: int
    Age_Group: str
    Weight_kg: float
    Menstrual_Cycle_Regular: str
    Avg_Menstrual_Cycle_Length: str
    Hot_Flashes: str
    Night_Sweats: str
    Sleep_Disturbances: str
    Fatigue: str
    Anxiety: str
    Headaches: str
    Heart_Palpitations: str
    Exercise_Yoga_Frequency: str
    Avg_Sleep_Duration: str
    Stress_Level: int
    Diagnosed_Conditions: str
    Family_History_Early_Menopause: str