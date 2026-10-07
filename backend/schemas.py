from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional

# --------------------------------------------------
# USER
# --------------------------------------------------

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

class UserUpdate(BaseModel):
    Name: str
    Age: Optional[int] = None
    Email: EmailStr

class UserLogin(BaseModel):
    Email: EmailStr
    Password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    UserID: int
    Name: str
# --------------------------------------------------
# CYCLE
# --------------------------------------------------



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


# --------------------------------------------------
# SYMPTOMS
# --------------------------------------------------

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


# --------------------------------------------------
# RISK ASSESSMENT
# --------------------------------------------------

class RiskAssessmentCreate(BaseModel):
    UserID: int
    RiskScore: float
    RiskLevel: str
    Explanation: str


class RiskAssessmentOut(RiskAssessmentCreate):
    RiskID: int
    MenopauseStage: str | None = None

    class Config:
        from_attributes = True


# --------------------------------------------------
# RECOMMENDATION
# --------------------------------------------------

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


# --------------------------------------------------
# ML PREDICTION INPUT
# --------------------------------------------------

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


# --------------------------------------------------
# VOICE JOURNAL
# --------------------------------------------------

class VoiceJournalCreate(BaseModel):
    UserID: int
    EntryDate: date
    Content: str | None = None
    AudioURL: str | None = None


class JournalAnalysisRequest(BaseModel):
    text: str


class VoiceJournalOut(VoiceJournalCreate):
    JournalID: int
    Mood: str | None = None
    Symptoms: str | None = None
    Summary: str | None = None

    class Config:
        from_attributes = True

# --------------------------------------------------
# DIET SUGGESTIONS
# --------------------------------------------------

class DietSuggestionOut(BaseModel):
    SuggestionID: int
    MealType: str
    Title: str
    Summary: str | None = None
    FoodIdea: str | None = None
    IsActive: int

    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    Name: str
    MealType: str
    Ingredients: str
    Instructions: str
    CookingTime: str | None = None
    Notes: str | None = None
    IsFavorite: int = 0
    IsPublic: int = 0


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    Name: str | None = None
    MealType: str | None = None
    Ingredients: str | None = None
    Instructions: str | None = None
    CookingTime: str | None = None
    Notes: str | None = None
    IsFavorite: int | None = None
    IsPublic: int | None = None


class RecipeOut(RecipeBase):
    RecipeID: int
    UserID: int | None = None

    class Config:
        from_attributes = True


class RecipeAssistantRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000)


class DietLogCreate(BaseModel):
    LogDate: date
    MealType: str
    Food: str
    Portion: str | None = None
    Notes: str | None = None


class DietLogUpdate(BaseModel):
    LogDate: date | None = None
    MealType: str | None = None
    Food: str | None = None
    Portion: str | None = None
    Notes: str | None = None


class DietLogOut(BaseModel):
    DietLogID: int
    UserID: int
    LogDate: date
    MealType: str
    Food: str
    Portion: str | None = None
    Notes: str | None = None
    CreatedAt: datetime | None = None

    class Config:
        from_attributes = True


class MealPlannerCreate(BaseModel):
    PlanDate: date
    MealType: str
    RecipeID: int


class MealPlannerOut(BaseModel):
    PlannerID: int
    UserID: int
    PlanDate: date
    MealType: str
    RecipeID: int
    CreatedAt: datetime | None = None

    class Config:
        from_attributes = True


class PantryItemCreate(BaseModel):
    ItemName: str


class PantryItemOut(BaseModel):
    PantryItemID: int
    UserID: int
    ItemName: str
    CreatedAt: datetime | None = None

    class Config:
        from_attributes = True


class ShoppingListCreate(BaseModel):
    ItemName: str
    IsChecked: int = 0


class ShoppingListUpdate(BaseModel):
    ItemName: str | None = None
    IsChecked: int | None = None


class ShoppingListOut(BaseModel):
    ShoppingItemID: int
    UserID: int
    ItemName: str
    IsChecked: int
    CreatedAt: datetime | None = None

    class Config:
        from_attributes = True


class HydrationUpdate(BaseModel):
    LogDate: date
    Glasses: int