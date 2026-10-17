import json
from datetime import date, datetime, timedelta, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import update
from typing import List
import hashlib

from database import (
    Base,
    engine,
    get_db,
    ensure_voice_journal_columns,
    ensure_diet_log_portion_column,
    ensure_recipe_image_column,
    SessionLocal,
)
from models import (
    User,
    PasswordResetToken,
    Cycle,
    Symptom,
    RiskAssessment,
    AssessmentExplanation,
    Recommendation,
    VoiceJournal,
    DietSuggestion, 
    Recipe,
    RecipeFavorite,
    DietLog,
    MealPlanner,
    PantryItem,
    ShoppingListItem,
    HydrationLog,
)

from schemas import (
    UserOut,
    UserCreate,
    UserUpdate,
    UserLogin,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordResetResponse,
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
    JournalAnalysisRequest, 
    DietSuggestionOut,
    RecipeCreate,
    RecipeUpdate, 
    RecipeOut,
    RecipeAssistantRequest,
    DietLogCreate,
    DietLogUpdate,
    DietLogOut,
    MealPlannerCreate,
    MealPlannerOut,
    PantryItemCreate,
    PantryItemOut,
    ShoppingListCreate,
    ShoppingListUpdate,
    ShoppingListOut,
    HydrationUpdate
)

from ml_predictor import explain_risk
from auth import hash_password, verify_password, get_current_user, create_access_token
from community import router as community_router, seed_community_groups
from password_reset import (
    PasswordResetConfigurationError,
    PasswordResetDeliveryError,
    create_password_reset_token,
    send_password_reset_email,
    validate_password_reset_configuration,
    verify_password_reset_token,
)


Base.metadata.create_all(bind=engine)
seed_community_groups()
ensure_voice_journal_columns()
ensure_diet_log_portion_column()
ensure_recipe_image_column()

# Seed default diet suggestions
def seed_diet_suggestions():
    db = SessionLocal()

    try:
        suggestions = [
            ("Breakfast", "Oats with fruit and seeds", "Combine a protein source with fibre-rich foods for a satisfying start.", "Oats with milk or fortified soy milk, fruit, nuts, and seeds"),
            ("Breakfast", "Eggs or tofu with vegetables", "A protein-rich breakfast with vegetables and a grain.", "Eggs or tofu with whole-grain toast and vegetables"),
            ("Lunch", "Dal, rice, and vegetables", "Build a balanced plate with vegetables, protein, and a grain.", "Dal, brown rice or roti, and a generous serving of vegetables"),
            ("Lunch", "Chickpea or paneer bowl", "Pair protein-rich chickpeas or paneer with vegetables and grains.", "Chickpea or paneer bowl with vegetables and whole grains"),
            ("Lunch", "Fish or chicken with rice", "A protein food with rice and vegetables, if included in your diet.", "Fish or chicken with vegetables and rice, if included in your diet"),
            ("Dinner", "Vegetable khichdi", "Choose a comfortable, nourishing meal that fits your schedule and appetite.", "Vegetable khichdi with yogurt or a fortified alternative"),
            ("Dinner", "Tofu, paneer, or beans", "Pair a protein food with cooked vegetables for a flexible dinner.", "Tofu, paneer, or beans with cooked vegetables"),
            ("Dinner", "Lentil soup and roti", "A warm soup with lentils and a satisfying grain.", "Soup with lentils and whole-grain bread or roti"),
            ("Breakfast", "Palappam with vegetable stew", "A soft, fermented rice-and-coconut appam with a mild vegetable stew.", "Palappam with vegetable stew or egg curry"),
            ("Breakfast", "Puttu and kadala curry", "Steamed rice flour and coconut served with black chickpea curry.", "Puttu with kadala curry; add banana or fruit if you like"),
            ("Breakfast", "Idiyappam with egg curry", "String hoppers pair well with egg curry or a coconut-based vegetable stew.", "Idiyappam with egg curry or vegetable stew"),
            ("Breakfast", "Dosa with sambar", "A familiar fermented rice-and-lentil breakfast with lentil and vegetable sambar.", "Dosa with sambar and coconut chutney"),
            ("Breakfast", "Idli with sambar", "Steamed rice-and-lentil idli with sambar makes a filling breakfast.", "Idli with sambar and a little coconut chutney"),
            ("Breakfast", "Appam with kadala curry", "Fermented appam with protein-rich black chickpeas in curry.", "Appam with kadala curry"),
            ("Breakfast", "Kanji with payar", "Rice porridge with green gram and a simple vegetable side.", "Rice kanji with cherupayar (green gram) and thoran"),
            ("Lunch", "Kerala matta rice meals", "Build a plate around red matta rice, vegetables, and a protein of choice.", "Matta rice with avial, thoran, and parippu or sambar"),
            ("Lunch", "Avial and matta rice", "Mixed vegetables in a coconut and yogurt-based avial served with matta rice.", "Matta rice with avial and a spoon of parippu"),
            ("Lunch", "Thoran with matta rice", "A vegetable thoran with grated coconut adds vegetables and texture to lunch.", "Matta rice with cabbage, beans, or carrot thoran and sambar"),
            ("Lunch", "Kerala fish curry meal", "A tangy fish curry served with rice and a vegetable side.", "Matta rice with Kerala fish curry and vegetable thoran"),
            ("Lunch", "Sambar and vegetable lunch", "A lentil-based curry with vegetables served alongside rice.", "Matta rice with sambar, avial, and a small serving of pickle"),
            ("Lunch", "Moru curry and vegetables", "A light yogurt-based moru curry pairs with rice and seasonal vegetables.", "Matta rice with moru curry and cabbage thoran"),
            ("Dinner", "Idiyappam with vegetable stew", "A gentle dinner of steamed string hoppers and coconut-milk vegetable stew.", "Idiyappam with vegetable stew"),
            ("Dinner", "Appam with egg curry", "Soft appam served with egg curry or a bean-based curry.", "Appam with egg curry and a side of vegetables"),
            ("Dinner", "Puttu with kadala curry", "Puttu and chickpea curry make a satisfying, familiar evening meal.", "Puttu with kadala curry and cucumber"),
            ("Dinner", "Kanji, payar, and thoran", "Rice kanji, green gram, and a vegetable side make a comforting dinner.", "Kanji with cherupayar and a small serving of thoran"),
            ("Dinner", "Fish curry with vegetables", "A home-style fish curry served with rice and vegetables.", "Kerala fish curry with matta rice and seasonal vegetables"),
            ("Snack", "Pazham pori", "Ripe banana fritters are a classic tea-time snack; enjoy freshly made.", "Pazham pori with tea or coffee"),
            ("Snack", "Parippu vada", "Crisp lentil fritters made with chana dal, onion, curry leaves, and spices.", "Parippu vada with unsweetened tea"),
            ("Snack", "Kerala-style samosa", "A savoury pastry snack with a spiced vegetable or meat filling.", "Vegetable samosa with mint or coconut chutney"),
            ("Snack", "Unniyappam", "Small rice, jaggery, and banana fritters flavored with cardamom.", "Unniyappam as a tea-time treat"),
            ("Snack", "Steamed kozhukatta", "A steamed rice dumpling filled with coconut and jaggery.", "Kozhukatta with tea"),
            ("Snack", "Roasted banana and nuts", "A quick snack pairing ripe banana with a small handful of nuts.", "Ripe banana with roasted peanuts or other nuts"),
        ]
        existing_names = {
            title.lower()
            for (title,) in db.query(DietSuggestion.Title)
            .filter(
                func.lower(DietSuggestion.Title).in_(
                    [item[1].lower() for item in suggestions]
                )
            )
            .all()
            if title
        }
        new_suggestions = [
            DietSuggestion(
                MealType=meal_type,
                Title=title,
                Summary=summary,
                FoodIdea=food_idea,
                IsActive=1,
            )
            for meal_type, title, summary, food_idea in suggestions
            if title.lower() not in existing_names
        ]

        if new_suggestions:
            db.add_all(new_suggestions)
            db.commit()
            print(f"Inserted {len(new_suggestions)} Kerala diet suggestions.")

    finally:
        db.close()


seed_diet_suggestions()


def seed_default_recipes():
    db = SessionLocal()

    try:
        recipes = [
            ("Palappam with Vegetable Stew", "Breakfast", "Raw rice, cooked rice, grated coconut or coconut milk, yeast, sugar, mixed vegetables, coconut milk, onion, ginger", "Soak and grind the rice with coconut and cooked rice; ferment the batter until bubbly. Swirl a ladle of batter in a hot appachatti to make a lacy appam. Simmer vegetables with onion, ginger, and coconut milk for the stew.", "45 minutes plus fermentation", "Kerala breakfast classic; fermentation time varies."),
            ("Puttu and Kadala Curry", "Breakfast", "Puttu podi (rice flour), grated coconut, water, salt, black chickpeas, onion, tomato, ginger, garlic, curry leaves, coriander, spices", "Soak black chickpeas and pressure-cook until tender. Prepare a curry with onion, tomato, ginger, garlic, curry leaves, and spices. Moisten rice flour with salted water until crumbly, layer with coconut in a puttu steamer, and steam until cooked.", "45 minutes", "Traditional Kerala breakfast with black chickpea curry."),
            ("Idiyappam with Egg Curry", "Breakfast", "Rice flour, hot water, salt, grated coconut, eggs, onion, tomato, ginger, garlic, curry leaves, spices", "Make a soft dough from rice flour, hot water, and salt. Press through an idiyappam maker onto steamer plates, top with coconut, and steam. Cook eggs in an onion, tomato, curry-leaf, and spice gravy.", "40 minutes", "Serve the string hoppers with egg curry or vegetable stew."),
            ("Idiyappam with Vegetable Stew", "Dinner", "Rice flour, hot water, salt, coconut, potato, carrot, green beans, onion, ginger, coconut milk, curry leaves", "Press a soft rice-flour dough into nests and steam until tender. Simmer the vegetables with onion, ginger, curry leaves, and thin coconut milk; finish with thick coconut milk.", "40 minutes", "A mild Kerala dinner option."),
            ("Appam with Egg Curry", "Dinner", "Raw rice, cooked rice, coconut milk, yeast, sugar, eggs, onion, tomato, ginger, curry leaves, spices", "Ferment a smooth rice-and-coconut batter and cook appams in a covered appachatti. Prepare an egg curry by simmering boiled eggs in an onion, tomato, ginger, and spice gravy.", "45 minutes plus fermentation", "A popular Kerala pairing."),
            ("Dosa with Sambar", "Breakfast", "Dosa batter (rice and urad dal), toor dal, mixed vegetables, tomato, tamarind, sambar powder, mustard seeds, curry leaves", "Spread fermented batter thinly on a hot griddle and cook until golden. Simmer cooked dal, vegetables, tamarind, and sambar powder; finish with a mustard-seed and curry-leaf tempering.", "35 minutes", "Serve with coconut chutney if desired."),
            ("Idli with Sambar", "Breakfast", "Idli batter (rice and urad dal), toor dal, mixed vegetables, tomato, tamarind, sambar powder, mustard seeds, curry leaves", "Steam the batter in idli moulds until set. Cook dal and vegetables with tamarind and sambar powder, then add a mustard-seed and curry-leaf tempering.", "30 minutes", "Steamed idli with a hearty lentil and vegetable sambar."),
            ("Kerala Matta Rice, Avial and Thoran", "Lunch", "Kerala matta rice, mixed vegetables (drumstick, carrot, beans, yam), grated coconut, yogurt, cumin, green chilli, cabbage, mustard seeds, curry leaves", "Rinse and cook matta rice until tender. Simmer mixed vegetables with a ground coconut, cumin, and chilli paste; finish avial with yogurt and coconut oil. Make cabbage thoran with coconut, mustard seeds, and curry leaves.", "50 minutes", "A vegetable-rich Kerala lunch; use seasonal vegetables."),
            ("Kerala Fish Curry with Matta Rice", "Lunch", "Fish (such as sardine or kingfish), Kerala matta rice, shallots, ginger, garlic, kudampuli (Malabar tamarind), chilli powder, turmeric, curry leaves", "Soak kudampuli. Simmer shallots, ginger, garlic, chilli, turmeric, and kudampuli with water. Add fish and cook gently until just done. Serve with cooked matta rice and a vegetable thoran.", "40 minutes", "Traditional tangy fish curry; adjust chilli to taste."),
            ("Avial with Matta Rice", "Lunch", "Kerala matta rice, mixed vegetables, grated coconut, cumin, green chilli, yogurt, curry leaves, coconut oil", "Cook the cut vegetables until just tender. Add a coarse coconut, cumin, and green-chilli paste; simmer briefly, then fold in yogurt, curry leaves, and coconut oil. Serve with matta rice.", "40 minutes", "Kerala mixed-vegetable avial."),
            ("Cabbage Thoran with Matta Rice", "Lunch", "Kerala matta rice, cabbage, grated coconut, shallots, green chilli, mustard seeds, curry leaves, turmeric", "Cook chopped cabbage with shallots, chilli, turmeric, and a splash of water. Stir in grated coconut. Temper mustard seeds and curry leaves, then toss through and serve with matta rice.", "35 minutes", "Use beans or carrot instead of cabbage if preferred."),
            ("Sambar with Matta Rice", "Lunch", "Kerala matta rice, toor dal, drumstick, pumpkin, carrot, tomato, tamarind, sambar powder, mustard seeds, curry leaves", "Cook the dal until soft. Simmer vegetables with tamarind and sambar powder, combine with dal, and finish with mustard seeds and curry leaves tempered in oil. Serve with matta rice.", "45 minutes", "A comforting lentil and vegetable curry."),
            ("Moru Curry with Cabbage Thoran", "Dinner", "Cooked rice or matta rice, yogurt, turmeric, ginger, green chilli, coconut, cumin, mustard seeds, curry leaves, cabbage", "Whisk yogurt with turmeric and water; warm gently with ginger and chilli without boiling. Add a ground coconut and cumin paste if desired. Serve with rice and a simple cabbage thoran.", "35 minutes", "Kerala yogurt-based curry; avoid boiling after adding yogurt."),
            ("Kanji with Cherupayar and Thoran", "Dinner", "Rice, water, whole green gram (cherupayar), grated coconut, garlic, cumin, cabbage or greens, curry leaves", "Simmer rice with plenty of water to make kanji. Cook soaked green gram until tender and season with garlic and cumin. Serve with a small vegetable thoran.", "50 minutes", "A homestyle rice porridge meal."),
            ("Pazham Pori (Banana Fritters)", "Snack", "Ripe nendran banana, all-purpose flour or rice flour, turmeric, sugar, salt, water, oil", "Slice the banana lengthwise. Make a smooth, lightly salted batter with flour, turmeric, and water. Dip each slice and shallow- or deep-fry until golden, turning once.", "25 minutes", "Classic Kerala tea-time snack; frying method affects oil content."),
            ("Parippu Vada (Lentil Fritters)", "Snack", "Chana dal, shallots, ginger, green chilli, curry leaves, fennel, salt, oil", "Soak chana dal, drain, and pulse most of it coarsely while leaving some whole. Mix with chopped shallots, ginger, chilli, curry leaves, fennel, and salt. Shape into patties and fry until crisp.", "45 minutes", "Serve warm with tea; can also be pan-fried."),
            ("Kerala Vegetable Samosa", "Snack", "Pastry sheets, potato, green peas, onion, ginger, green chilli, curry leaves, garam masala, coriander, oil", "Cook potato and peas with onion, ginger, chilli, curry leaves, and spices. Fill samosa pastry, seal the edges, and bake or fry until golden and crisp.", "45 minutes", "A savoury snack; use baked pastry for a lower-oil option."),
            ("Unniyappam", "Snack", "Rice flour, ripe banana, jaggery, grated coconut, sesame seeds, cardamom, ghee or oil", "Melt jaggery with a little water and cool. Mix with mashed banana, rice flour, coconut, sesame, and cardamom into a thick batter. Rest briefly and cook in an unniyappam pan until browned.", "35 minutes", "Traditional small rice-and-jaggery fritters."),
            ("Kozhukatta (Steamed Coconut Dumplings)", "Snack", "Rice flour, hot water, salt, grated coconut, jaggery, cardamom", "Make a soft dough with rice flour, hot water, and salt. Cook coconut with jaggery and cardamom for the filling. Shape dough around the filling and steam until cooked.", "40 minutes", "Steamed Kerala rice dumplings."),
            ("Puttu with Cherupayar Curry", "Breakfast", "Puttu podi (rice flour), grated coconut, water, salt, whole green gram, onion, tomato, curry leaves, spices", "Steam moistened rice flour in layers with grated coconut. Cook soaked green gram until tender and simmer with onion, tomato, curry leaves, and spices for a simple curry.", "45 minutes", "A variation on the classic puttu breakfast."),
            ("Kerala Vegetable Stew with Appam", "Dinner", "Raw rice, cooked rice, coconut milk, yeast, potato, carrot, green beans, onion, ginger, curry leaves, whole spices", "Prepare fermented appam batter and cook in a covered appachatti. Simmer vegetables with onion, ginger, curry leaves, and whole spices in coconut milk until tender.", "45 minutes plus fermentation", "Mild coconut-milk stew served with appam."),
            ("Oats and Banana Breakfast Bowl", "Breakfast", "Oats, milk or yogurt, banana, apple, chia seeds, cinnamon", "Cook oats with milk or water. Top with sliced banana, apple, chia seeds, and cinnamon.", "10 minutes", "Existing simple high-fibre breakfast."),
            ("Vegetable Omelette", "Breakfast", "Eggs, onion, tomato, capsicum, spinach, pepper", "Whisk the eggs. Add chopped vegetables and cook in a lightly greased pan until set.", "10 minutes", "Quick protein-rich breakfast option."),
            ("Chickpea Vegetable Salad", "Lunch", "Cooked chickpeas, cucumber, tomato, carrot, onion, lemon juice, herbs", "Combine all vegetables and chickpeas. Add lemon juice and herbs, then mix well.", "10 minutes", "Fresh and easy lunch."),
            ("Vegetable Rice Bowl", "Lunch", "Cooked rice, mixed vegetables, beans, garlic, herbs", "Cook vegetables with garlic. Add beans and serve over cooked rice.", "20 minutes", "Flexible meal using available vegetables."),
            ("Vegetable Soup", "Dinner", "Carrot, beans, cabbage, tomato, onion, garlic, vegetable stock", "Saute onion and garlic. Add vegetables and stock. Simmer until the vegetables are tender.", "25 minutes", "Warm and simple dinner option."),
            ("Paneer Vegetable Wrap", "Dinner", "Whole-wheat wrap, paneer, cucumber, tomato, lettuce, yogurt", "Cook paneer with simple spices. Add vegetables and paneer to the wrap and serve with yogurt.", "15 minutes", "Easy balanced wrap."),
            ("Fruit Yogurt Bowl", "Snack", "Plain yogurt, banana, berries or seasonal fruit, nuts", "Add yogurt to a bowl and top with chopped fruit and a small handful of nuts.", "5 minutes", "Simple snack with no cooking required."),
        ]
        removed_recipe_names = {
            "Palappam with Vegetable Stew",
            "Puttu and Kadala Curry",
            "Idiyappam with Egg Curry",
            "Idiyappam with Vegetable Stew",
            "Appam with Egg Curry",
            "Dosa with Sambar",
            "Idli with Sambar",
            "Kerala Matta Rice, Avial and Thoran",
            "Kerala Fish Curry with Matta Rice",
            "Avial with Matta Rice",
            "Cabbage Thoran with Matta Rice",
            "Sambar with Matta Rice",
            "Moru Curry with Cabbage Thoran",
            "Kanji with Cherupayar and Thoran",
            "Pazham Pori (Banana Fritters)",
            "Parippu Vada (Lentil Fritters)",
            "Kerala Vegetable Samosa",
            "Unniyappam",
            "Kozhukatta (Steamed Coconut Dumplings)",
            "Puttu with Cherupayar Curry",
            "Kerala Vegetable Stew with Appam",
        }

        removed_count = db.query(Recipe).filter(
            Recipe.UserID.is_(None),
            Recipe.IsPublic == 1,
            Recipe.Name.in_(removed_recipe_names),
        ).delete(synchronize_session=False)
        if removed_count:
            db.commit()
            print(f"Removed {removed_count} unrequested default recipes.")
        recipes = [
            recipe
            for recipe in recipes
            if recipe[0] not in removed_recipe_names
        ]

        existing_names = {
            name.lower()
            for (name,) in db.query(Recipe.Name)
            .filter(
                func.lower(Recipe.Name).in_(
                    [item[0].lower() for item in recipes]
                )
            )
            .all()
            if name
        }
        new_recipes = [
            Recipe(
                UserID=None,
                Name=name,
                MealType=meal_type,
                Ingredients=ingredients,
                Instructions=instructions,
                CookingTime=cooking_time,
                Notes=notes,
                IsFavorite=0,
                IsPublic=1,
            )
            for (
                name,
                meal_type,
                ingredients,
                instructions,
                cooking_time,
                notes,
            ) in recipes
            if name.lower() not in existing_names
        ]

        if new_recipes:
            db.add_all(new_recipes)
            db.commit()
            print(f"Inserted {len(new_recipes)} default recipes.")

    finally:
        db.close()

seed_default_recipes()
# --------------------------------------------------
# RECOMMENDATION GENERATOR
# --------------------------------------------------

def generate_recommendation(menopause_stage: str, data: dict) -> dict:
    diet_tips = []
    exercise_tips = []
    yoga_tips = []
    lifestyle_tips = []

    if menopause_stage == "Postmenopause":
        diet_tips.append(
            "Maintain a balanced diet with adequate calcium and vitamin D"
        )
        lifestyle_tips.append(
            "Discuss ongoing symptoms and preventive care with a healthcare professional"
        )
    elif menopause_stage in ("Early", "Perimenopause"):
        diet_tips.append(
            "Maintain a balanced diet and track changes in your symptoms and cycles"
        )
    else:
        diet_tips.append(
            "Maintain a balanced, nutrient-rich diet and continue routine health care"
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
app.include_router(community_router)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://[::1]:5173",
        "http://[::1]:5174",
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


@app.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user"
        )

    user = db.query(User).filter(
        User.UserID == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


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
    normalized_email = str(user.Email).strip().lower()
    existing = (
        db.query(User)
        .filter(func.lower(func.trim(User.Email)) == normalized_email)
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
        Email=normalized_email,
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
    normalized_email = str(credentials.Email).strip().lower()
    user = (
        db.query(User)
        .filter(func.lower(func.trim(User.Email)) == normalized_email)
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


@app.post("/password-reset/request", response_model=PasswordResetResponse)
def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    try:
        configuration = validate_password_reset_configuration()
    except PasswordResetConfigurationError as exc:
        raise HTTPException(
            status_code=503,
            detail="Password reset email is not configured. Please contact the administrator.",
        ) from exc
    normalized_email = str(request.Email).strip().lower()
    user = (
        db.query(User)
        .filter(func.lower(func.trim(User.Email)) == normalized_email)
        .first()
    )
    response = {
        "message": "If an account with that email exists, a password reset link has been sent."
    }
    if user is None:
        return response

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    db.query(PasswordResetToken).filter(
        PasswordResetToken.ExpiresAt < now - timedelta(days=1)
    ).delete(synchronize_session=False)
    recent_requests = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.UserID == user.UserID,
            PasswordResetToken.CreatedAt >= now - timedelta(hours=1),
        )
        .count()
    )
    if recent_requests >= 3:
        db.commit()
        return response

    token = create_password_reset_token(user.UserID, normalized_email)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    db.add(
        PasswordResetToken(
            UserID=user.UserID,
            TokenHash=token_hash,
            CreatedAt=now,
            ExpiresAt=now + timedelta(minutes=30),
        )
    )
    db.commit()

    try:
        send_password_reset_email(
            configuration,
            normalized_email,
            token,
        )
    except PasswordResetDeliveryError as exc:
        db.query(PasswordResetToken).filter(
            PasswordResetToken.TokenHash == token_hash,
            PasswordResetToken.UsedAt.is_(None),
        ).update(
            {PasswordResetToken.UsedAt: datetime.now(timezone.utc).replace(tzinfo=None)},
            synchronize_session=False,
        )
        db.commit()
        raise HTTPException(
            status_code=503,
            detail="Password reset email could not be sent. Please try again later.",
        ) from exc

    db.query(PasswordResetToken).filter(
        PasswordResetToken.UserID == user.UserID,
        PasswordResetToken.TokenHash != token_hash,
        PasswordResetToken.UsedAt.is_(None),
    ).update(
        {PasswordResetToken.UsedAt: datetime.now(timezone.utc).replace(tzinfo=None)},
        synchronize_session=False,
    )
    db.commit()
    return response


@app.post("/password-reset/confirm", response_model=PasswordResetResponse)
def confirm_password_reset(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db),
):
    try:
        claims = verify_password_reset_token(request.Token)
    except PasswordResetConfigurationError as exc:
        raise HTTPException(
            status_code=503,
            detail="Password reset is not configured. Please contact the administrator.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or expired. Request a new one.",
        ) from exc
    token_hash = hashlib.sha256(request.Token.encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    user_id = int(claims["sub"])
    consumed = db.execute(
        update(PasswordResetToken)
        .where(
            PasswordResetToken.TokenHash == token_hash,
            PasswordResetToken.UserID == user_id,
            PasswordResetToken.UsedAt.is_(None),
            PasswordResetToken.ExpiresAt > now,
        )
        .values(UsedAt=now)
    )
    if consumed.rowcount != 1:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or expired. Request a new one.",
        )

    user = (
        db.query(User)
        .filter(
            User.UserID == user_id,
            func.lower(func.trim(User.Email)) == claims["email"].lower(),
        )
        .first()
    )
    if user is None:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or expired. Request a new one.",
        )

    user.Password = hash_password(request.Password)
    db.query(PasswordResetToken).filter(
        PasswordResetToken.UserID == user.UserID,
        PasswordResetToken.UsedAt.is_(None),
    ).update(
        {PasswordResetToken.UsedAt: now},
        synchronize_session=False,
    )
    db.commit()
    return {"message": "Your password has been reset. You can now sign in."}


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

    try:
        db.add(new_cycle)
        db.commit()
        db.refresh(new_cycle)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Unable to save cycle: {exc}",
        ) from exc

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
        prediction = explain_risk(data.model_dump(exclude={"UserID"}))
        risk_level = prediction["RiskLevel"]
        confidence = prediction["Confidence"]

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

    new_risk = RiskAssessment(
        UserID=current_user.UserID,
        RiskScore=confidence,
        RiskLevel=risk_level,
        Explanation=(
            f"Random Forest predicted {risk_level} stage-derived proxy "
            f"category from survey responses "
            f"(model confidence: {confidence:.2f}); "
            "not a clinical risk estimate."
        ),
    )

    db.add(new_risk)
    db.flush()

    explanation_record = AssessmentExplanation(
        RiskID=new_risk.RiskID,
        UserID=current_user.UserID,
        InputData=json.dumps(
            data.model_dump(exclude={"UserID"}),
            ensure_ascii=False,
        ),
        Factors=json.dumps(prediction["Factors"], ensure_ascii=False),
        PersonalizedInsight=prediction["PersonalizedInsight"],
        ExplanationMethod=prediction["ExplanationMethod"],
    )
    db.add(explanation_record)
    db.commit()
    db.refresh(new_risk)

    # Generate recommendations
    rec_content = generate_recommendation(
        "Stage-derived risk proxy",
        data.model_dump()
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
        "PredictionType": "Stage-derived proxy; not clinical risk",
        "RiskMapping": {
            "Low": "Premenopause",
            "Moderate": "Early perimenopause",
            "High": "Late perimenopause or Postmenopause",
        },
        "SavedRiskID": new_risk.RiskID,
        "SavedRecommendationID": new_rec.RecommendationID,
        "Recommendation": rec_content,
        "Factors": prediction["Factors"],
        "PersonalizedInsight": prediction["PersonalizedInsight"],
        "ExplanationMethod": prediction["ExplanationMethod"],
    }


@app.get("/xai/{user_id}")
def get_latest_explanation(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_id != current_user.UserID:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this user's AI explanation",
        )

    explanation = (
        db.query(AssessmentExplanation)
        .filter(AssessmentExplanation.UserID == user_id)
        .order_by(AssessmentExplanation.ExplanationID.desc())
        .first()
    )
    if not explanation:
        raise HTTPException(
            status_code=404,
            detail="Complete an assessment to see your personalized AI explanation.",
        )

    risk = (
        db.query(RiskAssessment)
        .filter(
            RiskAssessment.RiskID == explanation.RiskID,
            RiskAssessment.UserID == user_id,
        )
        .first()
    )
    if not risk:
        raise HTTPException(
            status_code=404,
            detail="The assessment associated with this explanation is no longer available.",
        )

    return {
        "RiskLevel": risk.RiskLevel,
        "MenopauseStage": risk.MenopauseStage,
        "PredictionType": (
            "Stage-derived proxy; not clinical risk"
            if risk.RiskLevel in {"Low", "Moderate", "High"}
            else "Historical menopause-stage result"
        ),
        "Confidence": risk.RiskScore,
        "Factors": json.loads(explanation.Factors),
        "Inputs": json.loads(explanation.InputData),
        "PersonalizedInsight": explanation.PersonalizedInsight,
        "ExplanationMethod": explanation.ExplanationMethod,
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

def analyze_journal_text(text: str) -> dict:
    normalized = text.lower()
    symptoms = []

    symptom_terms = {
        "Hot Flash": ("hot flash", "hot flush", "flushed"),
        "Night Sweat": ("night sweat", "sweating at night"),
        "Headache": ("headache", "migraine"),
        "Insomnia": ("can't sleep", "cannot sleep", "insomnia", "awake"),
        "Fatigue": ("tired", "fatigue", "exhausted", "low energy"),
        "Mood Changes": ("irritable", "irritated", "mood swing"),
    }

    for label, terms in symptom_terms.items():
        if any(term in normalized for term in terms):
            symptoms.append(label)

    mood_terms = {
        "Anxious": ("anxious", "worried", "overwhelmed", "stressed", "stressful"),
        "Low": ("sad", "down", "lonely", "depressed", "upset"),
        "Balanced": ("calm", "good", "happy", "balanced", "peaceful"),
    }
    mood = next(
        (label for label, terms in mood_terms.items()
         if any(term in normalized for term in terms)),
        "Neutral",
    )

    return {
        "mood": mood,
        "symptoms": symptoms,
        "summary": text.strip(),
    }


@app.post("/voicejournal/analyze")
def analyze_journal(
    request: JournalAnalysisRequest,
    current_user: User = Depends(get_current_user),
):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Journal text cannot be empty")

    return analyze_journal_text(request.text)

@app.post("/voicejournal", response_model=VoiceJournalOut)
def create_journal(
    entry: VoiceJournalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = entry.dict()
    data["UserID"] = current_user.UserID
    analysis = analyze_journal_text(entry.Content or "")
    data["Mood"] = analysis["mood"]
    data["Symptoms"] = json.dumps(analysis["symptoms"])
    data["Summary"] = analysis["summary"]

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

    analysis = analyze_journal_text(entry.Content or "")
    for key, value in entry.dict().items():
        if key != "UserID":
            setattr(existing, key, value)
    existing.Mood = analysis["mood"]
    existing.Symptoms = json.dumps(analysis["symptoms"])
    existing.Summary = analysis["summary"]

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



@app.get("/diet/suggestions", response_model=List[DietSuggestionOut])
def get_diet_suggestions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(DietSuggestion)
        .filter(DietSuggestion.IsActive == 1)
        .order_by(DietSuggestion.SuggestionID)
        .all()
    )

# --------------------------------------------------
# RECIPES
# --------------------------------------------------

@app.get("/recipes", response_model=List[RecipeOut])
def get_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Recipe)
        .filter(
            (Recipe.UserID == current_user.UserID) |
            (Recipe.IsPublic == 1)
        )
        .order_by(Recipe.RecipeID.desc())
        .all()
    )


@app.post("/recipes", response_model=RecipeOut)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_recipe = Recipe(
        UserID=current_user.UserID,
        Name=recipe.Name,
        MealType=recipe.MealType,
        Ingredients=recipe.Ingredients,
        Instructions=recipe.Instructions,
        CookingTime=recipe.CookingTime,
        Notes=recipe.Notes,
        ImageData=recipe.ImageData,
        IsFavorite=0,
        IsPublic=0,
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    return new_recipe


@app.get("/recipes/favorites")
def get_recipe_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorites = (
        db.query(RecipeFavorite)
        .filter(
            RecipeFavorite.UserID == current_user.UserID
        )
        .order_by(RecipeFavorite.CreatedAt.desc())
        .all()
    )

    return [
        favorite.RecipeID
        for favorite in favorites
    ]


@app.post("/recipes/assistant")
def suggest_recipe(
    request: RecipeAssistantRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    import re

    prompt = request.prompt.strip()
    prompt_lower = prompt.lower()
    kerala_request = any(
        term in prompt_lower
        for term in ("kerala", "malabar", "south indian")
    )
    meal_type = next(
        (
            value
            for value in ("Breakfast", "Lunch", "Dinner", "Snack")
            if value.lower() in prompt_lower
        ),
        "Snack" if any(
            word in prompt_lower for word in ("snack", "bite")
        ) else "Dinner" if any(
            word in prompt_lower for word in ("dinner", "supper")
        ) else "Breakfast" if "breakfast" in prompt_lower else "Lunch",
    )
    meal_type_requested = any(
        value.lower() in prompt_lower
        for value in ("Breakfast", "Lunch", "Dinner", "Snack")
    )
    quick = any(
        phrase in prompt_lower
        for phrase in ("quick", "under 20", "20 minutes", "20 min")
    )

    candidate_words = [
        word
        for word in re.findall(r"[a-zA-Z]+", prompt_lower)
        if len(word) > 2
        and word not in {
            "have", "with", "make", "what", "from", "give", "quick",
            "under", "minutes", "minute", "min", "recipe", "please", "some",
            "using", "want", "need", "dinner", "lunch", "breakfast",
            "snack", "meal", "and", "the", "for", "ingredients",
            "ingredient", "available", "could", "would", "suggest",
            "show", "kerala", "malabar", "indian", "authentic",
        }
    ]
    recipes = (
        db.query(Recipe)
        .filter(
            (Recipe.UserID == current_user.UserID)
            | (Recipe.IsPublic == 1)
        )
        .order_by(Recipe.RecipeID)
        .all()
    )
    candidates = [
        recipe
        for recipe in recipes
        if (not meal_type_requested or recipe.MealType == meal_type)
        and (
            not quick
            or not re.search(r"\d+", recipe.CookingTime or "")
            or int(re.search(r"\d+", recipe.CookingTime or "").group()) <= 20
        )
    ]
    matching = sorted(
        candidates,
        key=lambda recipe: sum(
            1
            for word in candidate_words
            if word in (
                f"{recipe.Name} {recipe.Ingredients} "
                f"{recipe.Instructions} {recipe.Notes or ''}"
            ).lower()
        ),
        reverse=True,
    )
    direct_match = bool(
        matching
        and candidate_words
        and any(
            word in (
                f"{matching[0].Name} {matching[0].Ingredients} "
                f"{matching[0].Instructions} {matching[0].Notes or ''}"
            ).lower()
            for word in candidate_words
        )
    )
    if direct_match or (kerala_request and candidates):
        recipe = matching[0] if direct_match else next(
            (
                item
                for item in candidates
                if "kerala" in (
                    f"{item.Name} {item.Ingredients} {item.Notes or ''}"
                ).lower()
            ),
            candidates[0],
        )
        return {
            "Name": recipe.Name,
            "MealType": recipe.MealType,
            "Ingredients": recipe.Ingredients,
            "Instructions": recipe.Instructions,
            "CookingTime": recipe.CookingTime,
            "Notes": recipe.Notes,
            "SourceNote": "Matched from your saved and public recipes; no AI model was used.",
        }

    pantry = (
        db.query(PantryItem)
        .filter(PantryItem.UserID == current_user.UserID)
        .all()
    )
    pantry_matches = [
        item.ItemName
        for item in pantry
        if item.ItemName.lower() in prompt_lower
    ]
    ingredient_names = list(dict.fromkeys(pantry_matches or candidate_words))
    if not ingredient_names:
        ingredient_names = {
            "Breakfast": ["oats", "milk", "banana"],
            "Lunch": ["rice", "vegetables", "beans"],
            "Dinner": ["vegetables", "lentils", "rice"],
            "Snack": ["yogurt", "fruit", "nuts"],
        }[meal_type]

    def quantity_for(ingredient: str) -> str:
        normalized = ingredient.lower()
        if any(word in normalized for word in ("oat", "rice", "flour", "pasta")):
            return f"1/2 cup {ingredient}"
        if any(word in normalized for word in ("milk", "water", "broth")):
            return f"1 cup {ingredient}"
        if any(word in normalized for word in ("almond", "nut", "seed")):
            return f"1 tablespoon {ingredient}"
        if any(word in normalized for word in ("banana", "apple", "orange")):
            return f"1 medium {ingredient}"
        if any(word in normalized for word in ("salt", "pepper", "spice")):
            return f"{ingredient}, to taste"
        return f"1/2 cup {ingredient}, chopped if needed"

    display_ingredients = [quantity_for(name) for name in ingredient_names[:8]]
    recipe_title = " and ".join(ingredient_names[:2]).title()
    suffix = "Bowl" if meal_type in ("Breakfast", "Snack") else "Skillet"
    cooking_time = "10 minutes" if quick else "20 minutes"
    instructions = (
        "Combine the ingredients in a bowl and adjust the quantities "
        "to your taste. "
        if meal_type in ("Breakfast", "Snack")
        else "Warm the ingredients together in a pan with a little water "
        "or oil until heated through. Adjust seasoning to taste. "
    )
    return {
        "Name": f"{recipe_title} {suffix}",
        "MealType": meal_type,
        "Ingredients": "\n".join(display_ingredients),
        "Instructions": instructions,
        "CookingTime": cooking_time,
        "Notes": "Simple rule-based suggestion; quantities are estimates, not individualized advice.",
        "SourceNote": "Rule-based recipe suggestion; no AI model is connected.",
    }

# ============================================================
# DIET LOG
# ============================================================

@app.get("/diet/logs", response_model=List[DietLogOut])
def get_diet_logs(
    log_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(DietLog).filter(
        DietLog.UserID == current_user.UserID
    )

    if log_date:
        query = query.filter(
            DietLog.LogDate == log_date
        )

    return (
        query
        .order_by(
            DietLog.LogDate.desc(),
            DietLog.CreatedAt.desc(),
        )
        .all()
    )


@app.post("/diet/logs", response_model=DietLogOut)
def create_diet_log(
    entry: DietLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_entry = DietLog(
        UserID=current_user.UserID,
        LogDate=entry.LogDate,
        MealType=entry.MealType,
        Food=entry.Food,
        Portion=entry.Portion,
        Notes=entry.Notes,
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@app.put("/diet/logs/{log_id}", response_model=DietLogOut)
def update_diet_log(
    log_id: int,
    entry_data: DietLogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(DietLog)
        .filter(
            DietLog.DietLogID == log_id,
            DietLog.UserID == current_user.UserID,
        )
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Diet log not found",
        )

    for field, value in entry_data.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry


@app.delete("/diet/logs/{log_id}")
def delete_diet_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(DietLog)
        .filter(
            DietLog.DietLogID == log_id,
            DietLog.UserID == current_user.UserID,
        )
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Diet log not found",
        )

    db.delete(entry)
    db.commit()

    return {
        "message": "Diet log deleted successfully"
    }


# ============================================================
# MEAL PLANNER
# ============================================================

@app.get("/meal-planner", response_model=List[MealPlannerOut])
def get_meal_planner(
    plan_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(MealPlanner).filter(
        MealPlanner.UserID == current_user.UserID
    )

    if plan_date:
        query = query.filter(
            MealPlanner.PlanDate == plan_date
        )

    return (
        query
        .order_by(
            MealPlanner.PlanDate,
            MealPlanner.PlannerID,
        )
        .all()
    )


@app.post("/meal-planner", response_model=MealPlannerOut)
def create_meal_plan(
    item: MealPlannerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.RecipeID == item.RecipeID,
            (
                (Recipe.UserID == current_user.UserID)
                |
                (Recipe.IsPublic == 1)
            ),
        )
        .first()
    )

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found",
        )

    new_item = MealPlanner(
        UserID=current_user.UserID,
        PlanDate=item.PlanDate,
        MealType=item.MealType,
        RecipeID=item.RecipeID,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.delete("/meal-planner/{planner_id}")
def delete_meal_plan(
    planner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(MealPlanner)
        .filter(
            MealPlanner.PlannerID == planner_id,
            MealPlanner.UserID == current_user.UserID,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Meal plan not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Meal plan deleted successfully"
    }


# ============================================================
# PANTRY
# ============================================================

@app.get("/pantry", response_model=List[PantryItemOut])
def get_pantry(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(PantryItem)
        .filter(
            PantryItem.UserID ==
            current_user.UserID
        )
        .order_by(PantryItem.PantryItemID)
        .all()
    )


@app.post("/pantry", response_model=PantryItemOut)
def create_pantry_item(
    item: PantryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(PantryItem)
        .filter(
            PantryItem.UserID ==
            current_user.UserID,
            PantryItem.ItemName ==
            item.ItemName,
        )
        .first()
    )

    if existing:
        return existing

    new_item = PantryItem(
        UserID=current_user.UserID,
        ItemName=item.ItemName,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.delete("/pantry/{item_id}")
def delete_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(PantryItem)
        .filter(
            PantryItem.PantryItemID == item_id,
            PantryItem.UserID == current_user.UserID,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Pantry item not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Pantry item deleted successfully"
    }


# ============================================================
# SHOPPING LIST
# ============================================================

@app.get(
    "/shopping-list",
    response_model=List[ShoppingListOut],
)
def get_shopping_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ShoppingListItem)
        .filter(
            ShoppingListItem.UserID ==
            current_user.UserID
        )
        .order_by(
            ShoppingListItem.ShoppingItemID
        )
        .all()
    )


@app.post(
    "/shopping-list",
    response_model=ShoppingListOut,
)
def create_shopping_item(
    item: ShoppingListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_item = ShoppingListItem(
        UserID=current_user.UserID,
        ItemName=item.ItemName,
        IsChecked=item.IsChecked,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.put(
    "/shopping-list/{item_id}",
    response_model=ShoppingListOut,
)
def update_shopping_item(
    item_id: int,
    item_data: ShoppingListUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(ShoppingListItem)
        .filter(
            ShoppingListItem.ShoppingItemID ==
            item_id,
            ShoppingListItem.UserID ==
            current_user.UserID,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Shopping item not found",
        )

    update_data = item_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@app.delete("/shopping-list/{item_id}")
def delete_shopping_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(ShoppingListItem)
        .filter(
            ShoppingListItem.ShoppingItemID ==
            item_id,
            ShoppingListItem.UserID ==
            current_user.UserID,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Shopping item not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Shopping item deleted successfully"
    }


# ============================================================
# HYDRATION
# ============================================================

@app.get("/hydration")
def get_hydration(
    log_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(HydrationLog).filter(
        HydrationLog.UserID ==
        current_user.UserID
    )

    if log_date:
        query = query.filter(
            HydrationLog.LogDate == log_date
        )

    return (
        query
        .order_by(
            HydrationLog.LogDate.desc()
        )
        .all()
    )


@app.put("/hydration")
def update_hydration(
    data: HydrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.Glasses < 0:
        raise HTTPException(
            status_code=400,
            detail="Glasses cannot be negative",
        )

    hydration = (
        db.query(HydrationLog)
        .filter(
            HydrationLog.UserID ==
            current_user.UserID,
            HydrationLog.LogDate ==
            data.LogDate,
        )
        .first()
    )

    if hydration:
        hydration.Glasses = data.Glasses
        hydration.UpdatedAt = datetime.utcnow()
    else:
        hydration = HydrationLog(
            UserID=current_user.UserID,
            LogDate=data.LogDate,
            Glasses=data.Glasses,
        )

        db.add(hydration)

    db.commit()
    db.refresh(hydration)

    return hydration

@app.get("/recipes/{recipe_id}", response_model=RecipeOut)
def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.RecipeID == recipe_id,
            (Recipe.UserID == current_user.UserID) |
            (Recipe.IsPublic == 1)
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return recipe


@app.put("/recipes/{recipe_id}", response_model=RecipeOut)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.RecipeID == recipe_id,
            Recipe.UserID == current_user.UserID
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    update_data = recipe_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(recipe, field, value)

    db.commit()
    db.refresh(recipe)

    return recipe


@app.delete("/recipes/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.RecipeID == recipe_id,
            Recipe.UserID == current_user.UserID
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()

    return {"message": "Recipe deleted successfully"}




@app.post("/recipes/{recipe_id}/favorite")
def add_recipe_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.RecipeID == recipe_id,
            (
                (Recipe.UserID == current_user.UserID)
                |
                (Recipe.IsPublic == 1)
            ),
        )
        .first()
    )

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found",
        )

    existing = (
        db.query(RecipeFavorite)
        .filter(
            RecipeFavorite.UserID
            == current_user.UserID,
            RecipeFavorite.RecipeID
            == recipe_id,
        )
        .first()
    )

    if existing:
        return {
            "RecipeID": recipe_id,
            "IsFavorite": True,
            "message": "Recipe is already a favorite",
        }

    favorite = RecipeFavorite(
        UserID=current_user.UserID,
        RecipeID=recipe_id,
    )

    db.add(favorite)
    db.commit()

    return {
        "RecipeID": recipe_id,
        "IsFavorite": True,
        "message": "Recipe added to favorites",
    }


@app.delete("/recipes/{recipe_id}/favorite")
def remove_recipe_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite = (
        db.query(RecipeFavorite)
        .filter(
            RecipeFavorite.UserID
            == current_user.UserID,
            RecipeFavorite.RecipeID
            == recipe_id,
        )
        .first()
    )

    if not favorite:
        return {
            "RecipeID": recipe_id,
            "IsFavorite": False,
            "message": "Recipe was not a favorite",
        }

    db.delete(favorite)
    db.commit()

    return {
        "RecipeID": recipe_id,
        "IsFavorite": False,
        "message": "Recipe removed from favorites",
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
