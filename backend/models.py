from sqlalchemy import Column, Integer, String, Float, Date
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

class Recommendation(Base):
    __tablename__ = "Recommendation"
    __table_args__ = {"schema": "dbo"}

    RecommendationID = Column("RecommendationID", Integer, primary_key=True, index=True)
    UserID = Column("UserID", Integer)
    DietPlan = Column("DietPlan", String)
    ExercisePlan = Column("ExercisePlan", String)
    YogaPlan = Column("YogaPlan", String)
    LifestyleTips = Column("LifestyleTips", String)