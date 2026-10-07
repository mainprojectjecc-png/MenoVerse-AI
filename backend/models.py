from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    Text,
    DateTime,
    UniqueConstraint,
)

from database import Base
from sqlalchemy import Column, Integer, String, Float, Date, Text
from database import Base

class User(Base):
    __tablename__ = "Users"
    __table_args__ = {"schema": "dbo"}

    UserID = Column("UserID", Integer, primary_key=True, index=True)
    Name = Column("Name", String)
    Age = Column("Age", Integer)
    Email = Column("Email", String)
    Password = Column("Password", String)

class Cycle(Base):
    __tablename__ = "Cycles"
    __table_args__ = {"schema": "dbo"}

    CycleID = Column("CycleID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    StartDate = Column("StartDate", Date)
    EndDate = Column("EndDate", Date)
    CycleLength = Column("CycleLength", Integer)
    Notes = Column("Notes", String)

class Symptom(Base):
    __tablename__ = "Symptoms"
    __table_args__ = {"schema": "dbo"}

    SymptomID = Column("SymptomID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    LogDate = Column("LogDate", Date)
    HotFlashes = Column("HotFlashes", Integer)
    Mood = Column("Mood", String)
    SleepQuality = Column("SleepQuality", String)
    Fatigue = Column("Fatigue", Integer)
    Headache = Column("Headache", Integer)

class RiskAssessment(Base):
    __tablename__ = "RiskAssessment"
    __table_args__ = {"schema": "dbo"}

    RiskID = Column("RiskID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    RiskScore = Column("RiskScore", Float)
    RiskLevel = Column("RiskLevel", String)
    Explanation = Column("Explanation", String)

    @property
    def MenopauseStage(self) -> str | None:
        stage_mapping = {
            "Premenopause": "Early",
            "Early perimenopause": "Early",
            "Early": "Early",
            "Late perimenopause": "Perimenopause",
            "Perimenopause": "Perimenopause",
            "Postmenopause": "Postmenopause",
        }
        return stage_mapping.get(self.RiskLevel)

class Recommendation(Base):
    __tablename__ = "Recommendation"
    __table_args__ = {"schema": "dbo"}

    RecommendationID = Column("RecommendationID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    DietPlan = Column("DietPlan", String)
    ExercisePlan = Column("ExercisePlan", String)
    YogaPlan = Column("YogaPlan", String)
    LifestyleTips = Column("LifestyleTips", String)

class VoiceJournal(Base):
    __tablename__ = "VoiceJournal"
    __table_args__ = {"schema": "dbo"}

    JournalID = Column("JournalID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    EntryDate = Column("EntryDate", Date)
    Content = Column("Content", String)
    AudioURL = Column("AudioURL", String)
    Mood = Column("Mood", String)
    Symptoms = Column("Symptoms", Text)
    Summary = Column("Summary", Text)

class DietSuggestion(Base):
    __tablename__ = "DietSuggestions"
    __table_args__ = {"schema": "dbo"}

    SuggestionID = Column("SuggestionID", Integer, primary_key=True, index=True)
    MealType = Column("MealType", String)
    Title = Column("Title", String)
    Summary = Column("Summary", Text)
    FoodIdea = Column("FoodIdea", Text)
    IsActive = Column("IsActive", Integer)

# --------------------------------------------------
# RECIPES
# --------------------------------------------------

class Recipe(Base):
    __tablename__ = "Recipes"
    __table_args__ = {"schema": "dbo"}

    RecipeID = Column("RecipeID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer, nullable=True, index=True)
    Name = Column("Name", String, nullable=False)
    MealType = Column("MealType", String, nullable=False)
    Ingredients = Column("Ingredients", Text, nullable=False)
    Instructions = Column("Instructions", Text, nullable=False)
    CookingTime = Column("CookingTime", String, nullable=True)
    Notes = Column("Notes", Text, nullable=True)
    IsFavorite = Column("IsFavorite", Integer, default=0)
    IsPublic = Column("IsPublic", Integer, default=0)

class RecipeFavorite(Base):
    __tablename__ = "RecipeFavorites"
    __table_args__ = (
        UniqueConstraint(
            "UserID",
            "RecipeID",
            name="uq_recipe_favorite_user_recipe",
        ),
        {"schema": "dbo"},
    )

    FavoriteID = Column(
        "FavoriteID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    RecipeID = Column(
        "RecipeID",
        Integer,
        nullable=False,
        index=True,
    )

    CreatedAt = Column(
        "CreatedAt",
        DateTime,
        default=datetime.utcnow,
    )

class DietLog(Base):
    __tablename__ = "DietLogs"
    __table_args__ = {"schema": "dbo"}

    DietLogID = Column(
        "DietLogID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    LogDate = Column(
        "LogDate",
        Date,
        nullable=False,
        index=True,
    )

    MealType = Column(
        "MealType",
        String,
        nullable=False,
    )

    Food = Column(
        "Food",
        Text,
        nullable=False,
    )
    Portion = Column(
        "Portion", 
        String, 
        nullable=True
    )

    Notes = Column(
        "Notes",
        Text,
        nullable=True,
    )

    CreatedAt = Column(
        "CreatedAt",
        DateTime,
        default=datetime.utcnow,
    )


class MealPlanner(Base):
    __tablename__ = "MealPlanner"
    __table_args__ = {"schema": "dbo"}

    PlannerID = Column(
        "PlannerID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    PlanDate = Column(
        "PlanDate",
        Date,
        nullable=False,
        index=True,
    )

    MealType = Column(
        "MealType",
        String,
        nullable=False,
    )

    RecipeID = Column(
        "RecipeID",
        Integer,
        nullable=False,
        index=True,
    )

    CreatedAt = Column(
        "CreatedAt",
        DateTime,
        default=datetime.utcnow,
    )


class PantryItem(Base):
    __tablename__ = "PantryItems"
    __table_args__ = {"schema": "dbo"}

    PantryItemID = Column(
        "PantryItemID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    ItemName = Column(
        "ItemName",
        String,
        nullable=False,
    )

    CreatedAt = Column(
        "CreatedAt",
        DateTime,
        default=datetime.utcnow,
    )


class ShoppingListItem(Base):
    __tablename__ = "ShoppingList"
    __table_args__ = {"schema": "dbo"}

    ShoppingItemID = Column(
        "ShoppingItemID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    ItemName = Column(
        "ItemName",
        String,
        nullable=False,
    )

    IsChecked = Column(
        "IsChecked",
        Integer,
        default=0,
    )

    CreatedAt = Column(
        "CreatedAt",
        DateTime,
        default=datetime.utcnow,
    )


class HydrationLog(Base):
    __tablename__ = "HydrationLogs"
    __table_args__ = (
        UniqueConstraint(
            "UserID",
            "LogDate",
            name="uq_hydration_user_date",
        ),
        {"schema": "dbo"},
    )

    HydrationID = Column(
        "HydrationID",
        Integer,
        primary_key=True,
        index=True,
    )

    UserID = Column(
        "UserID",
        Integer,
        nullable=False,
        index=True,
    )

    LogDate = Column(
        "LogDate",
        Date,
        nullable=False,
        index=True,
    )

    Glasses = Column(
        "Glasses",
        Integer,
        default=0,
    )

    UpdatedAt = Column(
        "UpdatedAt",
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )