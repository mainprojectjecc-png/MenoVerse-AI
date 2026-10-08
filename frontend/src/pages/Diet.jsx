import { useCallback, useEffect, useMemo, useState } from "react"
import bananaOatSkilletImage from "../assets/recipes/banana-oat-skillet.jpeg"
import chickpeaVegetableSaladImage from "../assets/recipes/chickpea-vegetable-salad.jpeg"
import fruitYogurtBowlImage from "../assets/recipes/fruit-yogurt-bowl.jpeg"
import paneerVegetableWrapImage from "../assets/recipes/paneer-vegetable-wrap.jpeg"
import vegetableOatsBowlImage from "../assets/recipes/vegetable-oats-bowl.jpeg"
import vegetableOmeletteImage from "../assets/recipes/vegetable-omelette.jpeg"
import vegetableRiceBowlImage from "../assets/recipes/vegetable-rice-bowl.jpeg"
import vegetableSoupImage from "../assets/recipes/vegetable-soup.jpeg"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const trackedMealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
]

const plannerDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const routine = [
  {
    time: "Morning",
    title: "Ease into breakfast",
    description:
      "Have water when you wake, then eat when it suits your appetite and routine.",
    icon: "sunny",
  },
  {
    time: "Midday",
    title: "Make lunch balanced",
    description:
      "Include vegetables, a protein food, and a grain or other satisfying carbohydrate.",
    icon: "lunch_dining",
  },
  {
    time: "Afternoon",
    title: "Plan a snack if hungry",
    description:
      "Try fruit with nuts, yogurt, or roasted chickpeas; a snack is optional.",
    icon: "nutrition",
  },
  {
    time: "Evening",
    title: "Keep dinner flexible",
    description:
      "Choose a meal that feels comfortable. There is no single required dinner time.",
    icon: "nightlight",
  },
]

function getLocalDate() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getMondayDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  const offset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - offset)

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function getPlannerDate(weekStart, dayName) {
  const [year, month, day] = weekStart.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(
    date.getDate() + plannerDays.indexOf(dayName),
  )

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function getToken() {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null",
    )
    return user?.access_token ||
      localStorage.getItem("token") ||
      ""
  } catch {
    return localStorage.getItem("token") || ""
  }
}

function getCurrentUserId() {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null",
    )
    return Number(user?.UserID) || null
  } catch {
    return null
  }
}

function getHydrationTargetKey() {
  return `dietHydrationTarget:${getCurrentUserId() || "guest"}`
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getRecipeVisual(recipe) {
  const name = (recipe.Name || "").toLowerCase()
  const details = `${name} ${recipe.Ingredients || ""}`.toLowerCase()
  const visuals = [
    { match: /banana/, image: bananaOatSkilletImage, label: "Banana & oats" },
    { match: /yogurt|yoghurt|berries|fruit bowl/, image: fruitYogurtBowlImage, label: "Fruit & yogurt" },
    { match: /paneer/, image: paneerVegetableWrapImage, label: "Paneer wrap" },
    { match: /soup/, image: vegetableSoupImage, label: "Vegetable soup" },
    { match: /rice/, image: vegetableRiceBowlImage, label: "Rice bowl" },
    { match: /chickpea|chana/, image: chickpeaVegetableSaladImage, label: "Chickpea salad" },
    { match: /omelette|omelet|egg/, image: vegetableOmeletteImage, label: "Vegetable omelette" },
    { match: /oat/, image: vegetableOatsBowlImage, label: "Savoury oats" },
    { match: /salad/, image: chickpeaVegetableSaladImage, label: "Fresh salad" },
    { match: /wrap|roll/, image: paneerVegetableWrapImage, label: "Fresh wrap" },
    { match: /pasta|noodle/, label: "Pasta bowl" },
    { match: /smoothie|shake/, label: "Fresh smoothie" },
  ]

  return visuals.find((visual) => visual.match.test(name))
    || visuals.find((visual) => visual.match.test(details))
    || {
    label: recipe.MealType ? `${recipe.MealType} idea` : "A nourishing dish",
  }
}

function MealCard({ meal, index }) {
  return (
    <article className="rounded-3xl border border-outline-variant/70 bg-white p-6 soft-shadow transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-secondary">
          <span className="material-symbols-outlined text-[25px]">{meal.icon}</span>
        </span>
        <span className="text-sm font-medium text-on-surface-variant">{meal.time}</span>
      </div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-tertiary">
        Meal {index + 1}
      </p>
      <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold text-plum-deep">
        {meal.title}
      </h3>
      <p className="mb-5 text-sm leading-6 text-on-surface-variant">{meal.summary}</p>
      <ul className="space-y-3">
        {meal.ideas.map((idea) => (
          <li key={idea} className="flex gap-3 text-sm leading-6 text-on-surface">
            <span className="material-symbols-outlined mt-0.5 text-[18px] text-tertiary">
              check_circle
            </span>

            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function RecipeCard({
  recipe,
  isFavorite,
  isPersonal,
  onToggleFavorite,
  onAddToPlanner,
  onAddIngredients,
  onOpen,
}) {
  const visual = getRecipeVisual(recipe)

  return (
    <article className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
      <div
        role="img"
        aria-label={`Illustration for ${recipe.Name}: ${visual.label}`}
        className="relative mb-5 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/70 via-white to-secondary-container"
      >
        {visual.image && (
          <img
            src={visual.image}
            alt={visual.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-semibold tracking-wide text-on-surface-variant backdrop-blur-sm">
          {visual.label}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f3efdf] px-3 py-1 text-xs font-semibold text-[#535845]">
            {recipe.MealType}
          </span>
          <span className="rounded-full bg-[#faf7f0] px-3 py-1 text-xs font-semibold text-[#77776d]">
            {isPersonal ? "My recipe" : "Shared recipe"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {recipe.CookingTime && (
            <span className="flex items-center gap-1 text-xs text-[#77776d]">
              <span className="material-symbols-outlined text-[17px]">
                schedule
              </span>
              {recipe.CookingTime}
            </span>
          )}

          <button
            type="button"
            onClick={() => onToggleFavorite(recipe)}
            aria-label={
              isFavorite
                ? `Remove ${recipe.Name} from favorites`
                : `Add ${recipe.Name} to favorites`
            }
            className="rounded-full p-2 text-[#b38b45] hover:bg-[#f3efdf]"
          >
            <span className="material-symbols-outlined">
              {isFavorite ? "star" : "star_border"}
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(recipe)}
        className="mb-3 text-left"
      >
        <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#3f3d35] hover:text-[#535845]">
          {recipe.Name}
        </h3>
      </button>

      {recipe.Notes && (
        <p className="mb-4 text-sm leading-6 text-[#626258]">
          {recipe.Notes}
        </p>
      )}

      <div className="mb-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#77776d]">
          Ingredients
        </p>

        <p className="text-sm leading-6 text-[#4f5148]">
          {recipe.Ingredients}
        </p>
      </div>

      <div className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#77776d]">
          Instructions
        </p>

        <p className="text-sm leading-6 text-[#4f5148]">
          {recipe.Instructions}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAddToPlanner(recipe.RecipeID)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#535845] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#444937]"
        >
          <span className="material-symbols-outlined text-[18px]">
            event
          </span>
          Add to planner
        </button>

        <button
          type="button"
          onClick={() => onAddIngredients(recipe)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#535845] px-4 py-2.5 text-sm font-semibold text-[#535845] hover:bg-[#f3efdf]"
        >
          <span className="material-symbols-outlined text-[18px]">
            shopping_cart
          </span>
          Shopping list
        </button>
      </div>
    </article>
  )
}

export default function Diet() {
  const [selectedDate, setSelectedDate] = useState(getLocalDate)

  // ---------------------------------------------------------
  // MEAL SUGGESTIONS
  // ---------------------------------------------------------

  const [meals, setMeals] = useState([])
  const [mealsLoading, setMealsLoading] = useState(true)
  const [mealsError, setMealsError] = useState("")

  // ---------------------------------------------------------
  // RECIPES
  // ---------------------------------------------------------

  const [recipes, setRecipes] = useState([])
  const [recipesLoading, setRecipesLoading] = useState(true)
  const [recipesError, setRecipesError] = useState("")

  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  const [recipeSearch, setRecipeSearch] = useState("")
  const [recipeMealType, setRecipeMealType] = useState("All")
  const [recipeSpecialFilter, setRecipeSpecialFilter] = useState("All")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [recipeAssistantPrompt, setRecipeAssistantPrompt] = useState("")
  const [recipeAssistantResult, setRecipeAssistantResult] = useState(null)
  const [recipeAssistantLoading, setRecipeAssistantLoading] = useState(false)
  const [recipeAssistantError, setRecipeAssistantError] = useState("")

  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [currentUserId] = useState(getCurrentUserId)

  // ---------------------------------------------------------
  // DAILY DIET LOG
  // ---------------------------------------------------------

  const [dietLog, setDietLog] = useState([])

  const [mealType, setMealType] = useState("Breakfast")
  const [food, setFood] = useState("")
  const [portion, setPortion] = useState("")
  const [notes, setNotes] = useState("")
  const [editingDietEntry, setEditingDietEntry] = useState(null)

  const [dietLogLoading, setDietLogLoading] = useState(false)
  const [dietLogError, setDietLogError] = useState("")

  // ---------------------------------------------------------
  // RECIPE FORM
  // ---------------------------------------------------------

  const emptyRecipe = {
    Name: "",
    MealType: "Breakfast",
    Ingredients: "",
    Instructions: "",
    CookingTime: "",
    Notes: "",
    IsFavorite: 0,
    IsPublic: 0,
  }

  const [newRecipe, setNewRecipe] = useState(emptyRecipe)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [recipeFormOpen, setRecipeFormOpen] = useState(false)
  const [recipeFormError, setRecipeFormError] = useState("")
  const [recipeFormSaving, setRecipeFormSaving] = useState(false)

  // ---------------------------------------------------------
  // PLANNER
  // ---------------------------------------------------------

  const [planner, setPlanner] = useState([])
  const [plannerDay, setPlannerDay] = useState("Monday")
  const [plannerWeekStart, setPlannerWeekStart] =
    useState(() => getMondayDate(getLocalDate()))
  const [plannerMealType, setPlannerMealType] =
    useState("Breakfast")
  const [selectedPlannerRecipe, setSelectedPlannerRecipe] =
    useState("")
  const [plannerLoading, setPlannerLoading] = useState(false)
  const [plannerError, setPlannerError] = useState("")

  // ---------------------------------------------------------
  // PANTRY
  // ---------------------------------------------------------

  const [pantry, setPantry] = useState([])
  const [pantryInput, setPantryInput] = useState("")
  const [pantryLoading, setPantryLoading] = useState(false)
  const [pantryError, setPantryError] = useState("")

  // ---------------------------------------------------------
  // SHOPPING LIST
  // ---------------------------------------------------------

  const [shoppingList, setShoppingList] = useState([])
  const [shoppingInput, setShoppingInput] = useState("")

  const [shoppingLoading, setShoppingLoading] =
    useState(false)
  const [shoppingError, setShoppingError] = useState("")

  // ---------------------------------------------------------
  // HYDRATION
  // ---------------------------------------------------------

  const [hydration, setHydration] = useState(0)
  const [hydrationTarget, setHydrationTarget] = useState(() => {
    const stored = Number(localStorage.getItem(getHydrationTargetKey()))
    return Number.isFinite(stored) && stored > 0 ? stored : 8
  })
  const [hydrationLoading, setHydrationLoading] =
    useState(false)
  const [hydrationError, setHydrationError] = useState("")

  // ---------------------------------------------------------
  // LOAD MEAL SUGGESTIONS
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadMeals() {
      try {
        setMealsLoading(true)
        setMealsError("")

        const response = await fetch(
          `${API_BASE_URL}/diet/suggestions`,
          {
            headers: authHeaders(),
          },
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load diet suggestions",
          )
        }

        const data = await response.json()

        const grouped = data.reduce((groups, item) => {
          const type = item.MealType

          if (!groups[type]) {
            groups[type] = {
              id: type.toLowerCase(),
              time:
                type === "Breakfast"
                  ? "Start your day"
                  : type === "Lunch"
                    ? "Midday"
                    : type === "Dinner"
                      ? "Evening"
                      : "Anytime",
              title: item.Title,
              icon:
                type === "Breakfast"
                  ? "wb_twilight"
                  : type === "Lunch"
                    ? "light_mode"
                    : type === "Dinner"
                      ? "bedtime"
                      : "nutrition",
              summary: item.Summary,
              ideas: [],
            }
          }

          if (item.FoodIdea) {
            groups[type].ideas.push(item.FoodIdea)
          }

          return groups
        }, {})

        setMeals(Object.values(grouped))
      } catch (error) {
        setMealsError(error.message)
      } finally {
        setMealsLoading(false)
      }
    }

    loadMeals()
  }, [])

  // ---------------------------------------------------------
  // LOAD RECIPES
  // ---------------------------------------------------------

  async function loadRecipes() {
    try {
      setRecipesLoading(true)
      setRecipesError("")

      const response = await fetch(
        `${API_BASE_URL}/recipes`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load recipes")
      }

      const data = await response.json()

      setRecipes(data)
    } catch (error) {
      setRecipesError(error.message)
    } finally {
      setRecipesLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD FAVORITES
  // ---------------------------------------------------------

  async function loadFavorites() {
    try {
      setFavoritesLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/recipes/favorites`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load favorites")
      }

      const data = await response.json()

      setFavoriteRecipes(
        Array.isArray(data) ? data : [],
      )
    } catch (error) {
      console.error(error)
    } finally {
      setFavoritesLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD DIET LOG
  // ---------------------------------------------------------

  async function loadDietLog() {
    try {
      setDietLogLoading(true)
      setDietLogError("")

      const response = await fetch(
        `${API_BASE_URL}/diet/logs`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load diet log")
      }

      const data = await response.json()

      setDietLog(data)
    } catch (error) {
      setDietLogError(error.message)
    } finally {
      setDietLogLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD PLANNER
  // ---------------------------------------------------------

  async function loadPlanner() {
    try {
      setPlannerLoading(true)
      setPlannerError("")

      const response = await fetch(
        `${API_BASE_URL}/meal-planner`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load meal planner")
      }

      const data = await response.json()

      setPlanner(data)
    } catch (error) {
      setPlannerError(error.message)
    } finally {
      setPlannerLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD PANTRY
  // ---------------------------------------------------------

  async function loadPantry() {
    try {
      setPantryLoading(true)
      setPantryError("")

      const response = await fetch(
        `${API_BASE_URL}/pantry`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load pantry")
      }

      const data = await response.json()

      setPantry(data)
    } catch (error) {
      setPantryError(error.message)
    } finally {
      setPantryLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD SHOPPING LIST
  // ---------------------------------------------------------

  async function loadShoppingList() {
    try {
      setShoppingLoading(true)
      setShoppingError("")

      const response = await fetch(
        `${API_BASE_URL}/shopping-list`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to load shopping list",
        )
      }

      const data = await response.json()

      setShoppingList(data)
    } catch (error) {
      setShoppingError(error.message)
    } finally {
      setShoppingLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD HYDRATION
  // ---------------------------------------------------------

  const loadHydration = useCallback(async (date) => {
    try {
      setHydrationLoading(true)
      setHydrationError("")

      const response = await fetch(
        `${API_BASE_URL}/hydration?log_date=${date}`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to load hydration",
        )
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        const current = data.find(
          (item) => item.LogDate === date,
        )

        setHydration(current?.Glasses || 0)
      } else {
        setHydration(data?.Glasses || 0)
      }
    } catch (error) {
      setHydrationError(error.message)
    } finally {
      setHydrationLoading(false)
    }
  }, [])

  // ---------------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.resolve()
      loadRecipes()
      loadFavorites()
      loadDietLog()
      loadPlanner()
      loadPantry()
      loadShoppingList()
    }

    void loadInitialData()
  }, [])

  useEffect(() => {
    const loadSelectedHydration = async () => {
      await Promise.resolve()
      loadHydration(selectedDate)
    }

    void loadSelectedHydration()
  }, [loadHydration, selectedDate])

  // ---------------------------------------------------------
  // DAILY LOG
  // ---------------------------------------------------------

  const todaysEntries = useMemo(
    () =>
      dietLog
        .filter(
          (entry) =>
            String(entry.LogDate) === selectedDate,
        )
        .sort(
          (a, b) =>
            new Date(b.CreatedAt || 0) -
            new Date(a.CreatedAt || 0),
        ),
    [dietLog, selectedDate],
  )

  const entriesByMeal = useMemo(() => {
    return trackedMealTypes.reduce(
      (result, type) => {
        result[type] = todaysEntries.filter(
          (entry) =>
            entry.MealType === type,
        )

        return result
      },
      {},
    )
  }, [todaysEntries])

  const mainMealsLogged = trackedMealTypes
    .filter((type) => type !== "Snack")
    .filter(
      (type) =>
        entriesByMeal[type].length > 0,
    ).length

  // ---------------------------------------------------------
  // FILTERED RECIPES
  // ---------------------------------------------------------

  const filteredRecipes = useMemo(() => {
    const search = recipeSearch
      .trim()
      .toLowerCase()

    const matches = recipes.filter((recipe) => {
      const name = String(recipe.Name || "")
      const ingredients = String(
        recipe.Ingredients || "",
      )
      const type = String(
        recipe.MealType || "",
      )
      const recipeText = `${name} ${ingredients} ${
        recipe.Instructions || ""
      }`.toLowerCase()
      const cookingMinutes = Number(
        String(recipe.CookingTime || "").match(/\d+/)?.[0],
      )

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        ingredients.toLowerCase().includes(search) ||
        type.toLowerCase().includes(search)

      const matchesMealType =
        recipeMealType === "All" ||
        type === recipeMealType

      const matchesFavorites =
        !showFavoritesOnly ||
        favoriteRecipes.includes(recipe.RecipeID)

      const matchesSpecialFilter =
        recipeSpecialFilter === "All" ||
        (recipeSpecialFilter === "Vegetarian" &&
          !/\b(meat|beef|pork|chicken|turkey|fish|seafood|lamb|bacon|ham)\b/.test(
            recipeText,
          )) ||
        (recipeSpecialFilter === "Quick" &&
          ((Number.isFinite(cookingMinutes) &&
            cookingMinutes <= 20) ||
            /\b(quick|under 20|20 min|15 min|10 min)\b/.test(
              String(recipe.CookingTime || "").toLowerCase(),
            ))) ||
        (recipeSpecialFilter === "No-cook" &&
          /\b(no[- ]cook|no cooking|uncooked)\b/.test(
            recipeText,
          ))

      return (
        matchesSearch &&
        matchesMealType &&
        matchesFavorites &&
        matchesSpecialFilter
      )
    })

    return matches.sort((left, right) => {
      const score = (recipe) => {
        const text = `${recipe.Name || ""} ${
          recipe.Ingredients || ""
        }`.toLowerCase()
        return pantry.reduce(
          (count, item) =>
            count +
            (String(item.ItemName || "").trim() &&
            text.includes(
              String(item.ItemName || "").trim().toLowerCase(),
            )
              ? 1
              : 0),
          0,
        )
      }
      return score(right) - score(left)
    })
  }, [
    recipes,
    recipeSearch,
    recipeMealType,
    recipeSpecialFilter,
    showFavoritesOnly,
    favoriteRecipes,
    pantry,
  ])

  // ---------------------------------------------------------
  // PLANNER
  // ---------------------------------------------------------

  const selectedPlannerDate = getPlannerDate(
    plannerWeekStart,
    plannerDay,
  )

  const plannerRecipes = useMemo(() => {
    return planner
      .filter(
        (item) =>
          String(item.PlanDate).slice(0, 10) ===
            selectedPlannerDate &&
          item.MealType === plannerMealType,
      )
      .map((item) => ({
        ...item,
        recipe: recipes.find(
          (recipe) =>
            recipe.RecipeID === item.RecipeID,
        ),
      }))
      .filter((item) => item.recipe)
  }, [planner, selectedPlannerDate, plannerMealType, recipes])

  // ---------------------------------------------------------
  // PANTRY MATCHES
  // ---------------------------------------------------------

  const pantryMatches = useMemo(() => {
    if (!pantry.length) {
      return []
    }

    return recipes
      .map((recipe) => {
      const ingredients = String(
        recipe.Ingredients || "",
      ).toLowerCase()
        const matchCount = pantry.filter((item) =>
          ingredients.includes(
            String(item.ItemName || "").trim().toLowerCase(),
          ),
        ).length
        return { recipe, matchCount }
      })
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((item) => item.recipe)
  }, [recipes, pantry])

  // ---------------------------------------------------------
  // NUTRITION SUMMARY
  // ---------------------------------------------------------

  const weekEntries = useMemo(() => {
    const weekStart = getMondayDate(selectedDate)
    const weekEnd = getPlannerDate(weekStart, "Sunday")
    return dietLog.filter((entry) => {
      const date = String(entry.LogDate).slice(0, 10)
      return date >= weekStart && date <= weekEnd
    })
  }, [dietLog, selectedDate])

  const nutritionSummary = useMemo(() => {
    const categories = {
      vegetables: [
        "vegetable",
        "spinach",
        "carrot",
        "tomato",
        "beans",
        "cabbage",
        "broccoli",
        "salad",
      ],
      fruit: [
        "fruit",
        "banana",
        "apple",
        "orange",
        "berry",
        "berries",
        "mango",
      ],
      protein: [
        "egg",
        "eggs",
        "paneer",
        "tofu",
        "beans",
        "chickpea",
        "chicken",
        "fish",
        "lentil",
        "dal",
        "yogurt",
      ],
      grains: [
        "rice",
        "oats",
        "bread",
        "roti",
        "dosa",
        "idli",
        "wheat",
      ],
    }

    const result = {}

    Object.entries(categories).forEach(
      ([category, words]) => {
        result[category] = weekEntries.filter((entry) => {
          const text = String(entry.Food || "").toLowerCase()
          return words.some((word) => text.includes(word))
        }).length
      },
    )

    return {
      ...result,
      meals: weekEntries.length,
      breakfast: weekEntries.filter(
        (entry) => entry.MealType === "Breakfast",
      ).length,
      lunch: weekEntries.filter(
        (entry) => entry.MealType === "Lunch",
      ).length,
      dinner: weekEntries.filter(
        (entry) => entry.MealType === "Dinner",
      ).length,
      snacks: weekEntries.filter(
        (entry) => entry.MealType === "Snack",
      ).length,
      variety: new Set(
        weekEntries
          .map((entry) =>
            String(entry.Food || "").trim().toLowerCase(),
          )
          .filter(Boolean),
      ).size,
    }
  }, [weekEntries])

  const smartSuggestion = useMemo(() => {
    if (weekEntries.length < 3) {
      return {
        personalized: false,
        text: meals[0]?.ideas?.[0] ||
          "Try a simple meal with a grain, vegetables, and a protein food.",
      }
    }

    const riceMeals = weekEntries.filter((entry) =>
      /\brice\b/i.test(String(entry.Food || "")),
    ).length

    if (riceMeals >= 2) {
      return {
        personalized: true,
        text: "Rice appears in several meals you logged. If you want variety, try oats, roti, millet, or a vegetable-based alternative.",
      }
    }

    const quickRecipe = recipes.find((recipe) => {
      const minutes = Number(
        String(recipe.CookingTime || "").match(/\d+/)?.[0],
      )
      return Number.isFinite(minutes) && minutes <= 20
    })

    return {
      personalized: true,
      text: quickRecipe
        ? `A quick idea from your recipes: ${quickRecipe.Name} (${quickRecipe.CookingTime}).`
        : "Try an easy meal idea from your suggestions, and vary ingredients to suit your preferences.",
    }
  }, [weekEntries, meals, recipes])

  const quickRecipe = useMemo(
    () =>
      recipes.find((recipe) => {
        const time = String(recipe.CookingTime || "").toLowerCase()
        const minutes = Number(time.match(/\d+/)?.[0])
        return (
          (Number.isFinite(minutes) && minutes > 0 && minutes <= 20) ||
          /\bquick\b/.test(time)
        )
      }),
    [recipes],
  )

  // ---------------------------------------------------------
  // ADD DIET LOG
  // ---------------------------------------------------------

  async function addFoodEntry(event) {
    event.preventDefault()

    const trimmedFood = food.trim()

    if (!trimmedFood) {
      return
    }

    try {
      setDietLogLoading(true)
      setDietLogError("")

      const response = await fetch(
        editingDietEntry
          ? `${API_BASE_URL}/diet/logs/${editingDietEntry.DietLogID}`
          : `${API_BASE_URL}/diet/logs`,
        {
          method: editingDietEntry ? "PUT" : "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LogDate: selectedDate,
            MealType: mealType,
            Food: trimmedFood,
            Portion: portion.trim() || null,
            Notes: notes.trim() || null,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to save meal",
        )
      }

      const saved = await response.json()

      setDietLog((current) =>
        editingDietEntry
          ? current.map((entry) =>
              entry.DietLogID === saved.DietLogID
                ? saved
                : entry,
            )
          : [...current, saved],
      )

      setFood("")
      setPortion("")
      setNotes("")
      setEditingDietEntry(null)
    } catch (error) {
      setDietLogError(error.message)
    } finally {
      setDietLogLoading(false)
    }
  }

  function startEditingDietEntry(entry) {
    setEditingDietEntry(entry)
    setSelectedDate(String(entry.LogDate).slice(0, 10))
    setMealType(entry.MealType)
    setFood(entry.Food || "")
    setPortion(entry.Portion || "")
    setNotes(entry.Notes || "")
  }

  function resetDietForm() {
    setEditingDietEntry(null)
    setFood("")
    setPortion("")
    setNotes("")
  }

  // ---------------------------------------------------------
  // DELETE DIET LOG
  // ---------------------------------------------------------

  async function deleteFoodEntry(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/diet/logs/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete meal entry",
        )
      }

      setDietLog((current) =>
        current.filter(
          (entry) =>
            entry.DietLogID !== id,
        ),
      )
    } catch (error) {
      setDietLogError(error.message)
    }
  }

  // ---------------------------------------------------------
  // FAVORITES
  // ---------------------------------------------------------

  async function toggleFavorite(recipe) {
    const alreadyFavorite =
      favoriteRecipes.includes(
        recipe.RecipeID,
      )

    try {
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipe.RecipeID}/favorite`,
        {
          method: alreadyFavorite
            ? "DELETE"
            : "POST",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Could not update favorite",
        )
      }

      setFavoriteRecipes((current) =>
        alreadyFavorite
          ? current.filter(
              (id) =>
                id !== recipe.RecipeID,
            )
          : [
              ...new Set([
                ...current,
                recipe.RecipeID,
              ]),
            ],
      )
    } catch (error) {
      setRecipesError(error.message)
    }
  }

  // ---------------------------------------------------------
  // SAVE / UPDATE RECIPE
  // ---------------------------------------------------------

  async function saveRecipe(event) {
    event.preventDefault()

    setRecipeFormError("")
    setRecipeFormSaving(true)

    try {
      const url = editingRecipe
        ? `${API_BASE_URL}/recipes/${editingRecipe.RecipeID}`
        : `${API_BASE_URL}/recipes`

      const response = await fetch(url, {
        method: editingRecipe
          ? "PUT"
          : "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      })

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to save recipe",
        )
      }

      const savedRecipe =
        await response.json()

      if (editingRecipe) {
        setRecipes((current) =>
          current.map((recipe) =>
            recipe.RecipeID ===
            savedRecipe.RecipeID
              ? savedRecipe
              : recipe,
          ),
        )
      } else {
        setRecipes((current) => [
          savedRecipe,
          ...current,
        ])
      }

      setNewRecipe(emptyRecipe)
      setEditingRecipe(null)
      setRecipeFormOpen(false)

      await loadFavorites()
    } catch (error) {
      setRecipeFormError(error.message)
    } finally {
      setRecipeFormSaving(false)
    }
  }

  async function generateRecipeSuggestion(event) {
    event.preventDefault()
    setRecipeAssistantError("")
    setRecipeAssistantResult(null)

    if (!recipeAssistantPrompt.trim()) {
      setRecipeAssistantError("Describe the ingredients or meal you want.")
      return
    }

    try {
      setRecipeAssistantLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/recipes/assistant`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: recipeAssistantPrompt.trim(),
          }),
        },
      )

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(
          detail.detail || "Could not prepare a recipe suggestion.",
        )
      }

      setRecipeAssistantResult(await response.json())
    } catch (error) {
      setRecipeAssistantError(error.message)
    } finally {
      setRecipeAssistantLoading(false)
    }
  }

  async function saveGeneratedRecipe() {
    if (!recipeAssistantResult) {
      return
    }

    try {
      setRecipeAssistantError("")
      setRecipeAssistantLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/recipes`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: recipeAssistantResult.Name,
            MealType: recipeAssistantResult.MealType,
            Ingredients: recipeAssistantResult.Ingredients,
            Instructions: recipeAssistantResult.Instructions,
            CookingTime: recipeAssistantResult.CookingTime || "",
            Notes: recipeAssistantResult.Notes || "",
            IsFavorite: 0,
            IsPublic: 0,
          }),
        },
      )

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(detail.detail || "Could not save the recipe.")
      }

      const savedRecipe = await response.json()
      setRecipes((current) => [savedRecipe, ...current])
      setRecipeAssistantResult(null)
      setRecipeAssistantPrompt("")
    } catch (error) {
      setRecipeAssistantError(error.message)
    } finally {
      setRecipeAssistantLoading(false)
    }
  }

  // ---------------------------------------------------------
  // EDIT RECIPE
  // ---------------------------------------------------------

  function startEditingRecipe(recipe) {
    setEditingRecipe(recipe)

    setNewRecipe({
      Name: recipe.Name || "",
      MealType:
        recipe.MealType || "Breakfast",
      Ingredients:
        recipe.Ingredients || "",
      Instructions:
        recipe.Instructions || "",
      CookingTime:
        recipe.CookingTime || "",
      Notes: recipe.Notes || "",
      IsFavorite: recipe.IsFavorite || 0,
      IsPublic: recipe.IsPublic || 0,
    })

    setRecipeFormError("")
    setRecipeFormOpen(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ---------------------------------------------------------
  // DELETE RECIPE
  // ---------------------------------------------------------

  async function deleteRecipe(recipe) {
    if (
      !window.confirm(
        `Delete "${recipe.Name}"?`,
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipe.RecipeID}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete recipe",
        )
      }

      setRecipes((current) =>
        current.filter(
          (item) =>
            item.RecipeID !==
            recipe.RecipeID,
        ),
      )

      setFavoriteRecipes((current) =>
        current.filter(
          (id) =>
            id !== recipe.RecipeID,
        ),
      )

      setPlanner((current) =>
        current.filter(
          (item) =>
            item.RecipeID !==
            recipe.RecipeID,
        ),
      )

      if (
        selectedRecipe?.RecipeID ===
        recipe.RecipeID
      ) {
        setSelectedRecipe(null)
      }
    } catch (error) {
      setRecipesError(error.message)
    }
  }

  // ---------------------------------------------------------
  // ADD TO PLANNER
  // ---------------------------------------------------------

  async function addToPlanner(recipeId) {
    try {
      setPlannerError("")
      const recipe = recipes.find(
        (item) => item.RecipeID === recipeId,
      )

      if (!recipe) {
        throw new Error("Please select a valid recipe.")
      }

      const planDate = getPlannerDate(plannerWeekStart, plannerDay)
      if (
        planner.some(
          (item) =>
            String(item.PlanDate).slice(0, 10) === planDate &&
            item.MealType === plannerMealType,
        )
      ) {
        throw new Error(
          `${plannerMealType} already has a recipe planned for ${planDate}.`,
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/meal-planner`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PlanDate: planDate,
            MealType: plannerMealType,
            RecipeID: recipe.RecipeID,
          }),
        },
      )

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(
          detail.detail || "Failed to add recipe to planner.",
        )
      }

      const created = await response.json()
      setPlanner((current) => [...current, created])
      setSelectedPlannerRecipe("")
    } catch (error) {
      setPlannerError(error.message)
    }
  }

  async function generateWeeklyPlan() {
    const meals = ["Breakfast", "Lunch", "Dinner"]
    const available = Object.fromEntries(
      meals.map((type) => [
        type,
        recipes.filter((recipe) => recipe.MealType === type),
      ]),
    )
    const missingTypes = meals.filter((type) => !available[type].length)

    if (missingTypes.length) {
      setPlannerError(
        `Add recipes for ${missingTypes.join(", ")} before generating a full weekly plan.`,
      )
      return
    }

    try {
      setPlannerError("")
      setPlannerLoading(true)
      const used = new Set(
        planner
          .filter((item) => {
            const date = String(item.PlanDate).slice(0, 10)
            return date >= plannerWeekStart &&
              date <= getPlannerDate(plannerWeekStart, "Sunday")
          })
          .map((item) => item.RecipeID),
      )
      const existingSlots = new Set(
        planner.map(
          (item) =>
            `${String(item.PlanDate).slice(0, 10)}:${item.MealType}`,
        ),
      )

      for (const day of plannerDays) {
        const planDate = getPlannerDate(plannerWeekStart, day)
        for (const type of meals) {
          const slot = `${planDate}:${type}`
          if (existingSlots.has(slot)) {
            continue
          }

          const choices = available[type]
          const recipe =
            choices.find((candidate) => !used.has(candidate.RecipeID)) ||
            choices[
              [...used].filter((id) =>
                choices.some((candidate) => candidate.RecipeID === id),
              ).length % choices.length
            ]
          const response = await fetch(
            `${API_BASE_URL}/meal-planner`,
            {
              method: "POST",
              headers: {
                ...authHeaders(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                PlanDate: planDate,
                MealType: type,
                RecipeID: recipe.RecipeID,
              }),
            },
          )

          if (!response.ok) {
            const detail = await response.json().catch(() => ({}))
            throw new Error(
              detail.detail ||
                `Could not save the ${type.toLowerCase()} plan for ${planDate}.`,
            )
          }

          const saved = await response.json()
          setPlanner((current) => [...current, saved])
          existingSlots.add(slot)
          used.add(recipe.RecipeID)
        }
      }
    } catch (error) {
      setPlannerError(error.message)
    } finally {
      setPlannerLoading(false)
    }
  }

  async function generateShoppingListFromPlan() {
    const weekEnd = getPlannerDate(plannerWeekStart, "Sunday")
    const weekPlans = planner.filter((item) => {
      const date = String(item.PlanDate).slice(0, 10)
      return date >= plannerWeekStart && date <= weekEnd
    })
    const plannedRecipes = weekPlans
      .map((item) =>
        recipes.find((recipe) => recipe.RecipeID === item.RecipeID),
      )
      .filter(Boolean)
    if (!plannedRecipes.length) {
      setShoppingError("Add recipes to this week's plan first.")
      return
    }

    const pantryNames = pantry
      .map((item) => item.ItemName.trim().toLowerCase())
      .filter(Boolean)
    const existingNames = new Set(
      shoppingList.map((item) => item.ItemName.trim().toLowerCase()),
    )
    const ingredients = new Map()
    plannedRecipes.forEach((recipe) => {
      String(recipe.Ingredients || "")
        .split(/[,;\n]/)
        .map((item) => item.replace(/^[\s•*-]+/, "").trim())
        .filter(Boolean)
        .forEach((ingredient) => {
          const normalized = ingredient.toLowerCase()
          if (
            !pantryNames.some(
              (name) =>
                normalized.includes(name) ||
                name.includes(normalized),
            ) &&
            ![...existingNames].some(
              (name) =>
                normalized.includes(name) ||
                name.includes(normalized),
            ) &&
            !ingredients.has(normalized)
          ) {
            ingredients.set(normalized, ingredient)
          }
        })
    })

    try {
      setShoppingError("")
      setShoppingLoading(true)
      for (const ingredient of ingredients.values()) {
        const response = await fetch(
          `${API_BASE_URL}/shopping-list`,
          {
            method: "POST",
            headers: {
              ...authHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ItemName: ingredient,
              IsChecked: 0,
            }),
          },
        )
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}))
          throw new Error(
            detail.detail ||
              `Could not add ${ingredient} to the shopping list.`,
          )
        }
        const created = await response.json()
        existingNames.add(ingredient.toLowerCase())
        setShoppingList((current) => [...current, created])
      }
    } catch (error) {
      setShoppingError(error.message)
    } finally {
      setShoppingLoading(false)
    }
  }
  // ---------------------------------------------------------
  // DELETE PLANNER ITEM
  // ---------------------------------------------------------

  async function removeFromPlanner(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/meal-planner/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove planner item",
        )
      }

      setPlanner((current) =>
        current.filter(
          (item) =>
            item.PlannerID !== id,
        ),
      )
    } catch (error) {
      setPlannerError(error.message)
    }
  }

  // ---------------------------------------------------------
  // PANTRY
  // ---------------------------------------------------------

  async function addPantryItem(event) {
    event.preventDefault()

    const value = pantryInput.trim()

    if (!value) {
      return
    }

    try {
      setPantryError("")

      const response = await fetch(
        `${API_BASE_URL}/pantry`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ItemName: value,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to add pantry item",
        )
      }

      const created = await response.json()

      setPantry((current) => [
        ...current,
        created,
      ])

      setPantryInput("")
    } catch (error) {
      setPantryError(error.message)
    }
  }

  async function removePantryItem(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pantry/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove pantry item",
        )
      }

      setPantry((current) =>
        current.filter(
          (item) =>
            item.PantryItemID !== id,
        ),
      )
    } catch (error) {
      setPantryError(error.message)
    }
  }

  // ---------------------------------------------------------
  // SHOPPING LIST
  // ---------------------------------------------------------

  async function addShoppingItem(event) {
    event.preventDefault()

    const value = shoppingInput.trim()

    if (!value) {
      return
    }

    if (
      shoppingList.some(
        (item) =>
          item.ItemName.trim().toLowerCase() === value.toLowerCase(),
      )
    ) {
      setShoppingInput("")
      return
    }

    try {
      setShoppingError("")

      const response = await fetch(
        `${API_BASE_URL}/shopping-list`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ItemName: value,
            IsChecked: 0,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to add shopping item",
        )
      }

      const created = await response.json()

      setShoppingList((current) => [
        ...current,
        created,
      ])

      setShoppingInput("")
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  async function addRecipeIngredients(recipe) {
    const ingredients = String(
      recipe.Ingredients || "",
    )
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean)

    const existingNames = new Set(
      shoppingList.map((item) =>
        String(item.ItemName || "").trim().toLowerCase(),
      ),
    )

    for (const ingredient of ingredients) {
      const normalized = ingredient.toLowerCase()
      if (existingNames.has(normalized)) {
        continue
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/shopping-list`,
          {
            method: "POST",
            headers: {
              ...authHeaders(),
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ItemName: ingredient,
              IsChecked: 0,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(
            `Failed to add ${ingredient}`,
          )
        }

        const created =
          await response.json()

        existingNames.add(normalized)
        setShoppingList((current) => [
          ...current,
          created,
        ])
      } catch (error) {
        setShoppingError(error.message)
      }
    }

    await loadShoppingList()
  }

  async function toggleShoppingItem(item) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping-list/${item.ShoppingItemID}`,
        {
          method: "PUT",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IsChecked:
              item.IsChecked ? 0 : 1,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to update shopping item",
        )
      }

      const updated =
        await response.json()

      setShoppingList((current) =>
        current.map((entry) =>
          entry.ShoppingItemID ===
          updated.ShoppingItemID
            ? updated
            : entry,
        ),
      )
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  async function removeShoppingItem(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping-list/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove shopping item",
        )
      }

      setShoppingList((current) =>
        current.filter(
          (item) =>
            item.ShoppingItemID !== id,
        ),
      )
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  // ---------------------------------------------------------
  // HYDRATION
  // ---------------------------------------------------------

  async function updateHydration(newCount) {
    const safeCount = Math.max(newCount, 0)

    try {
      setHydrationError("")
      setHydrationLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/hydration`,
        {
          method: "PUT",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LogDate: selectedDate,
            Glasses: safeCount,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to update hydration",
        )
      }

      const updated = await response.json()

      setHydration(updated.Glasses || 0)
    } catch (error) {
      setHydrationError(error.message)
    } finally {
      setHydrationLoading(false)
    }
  }

  function saveHydrationTarget(value) {
    const target = Number(value)
    if (!Number.isInteger(target) || target < 1) {
      return
    }
    setHydrationTarget(target)
    localStorage.setItem(
      getHydrationTargetKey(),
      String(target),
    )
  }

  // ---------------------------------------------------------
  // FORM RESET
  // ---------------------------------------------------------

  function resetRecipeForm() {
    setNewRecipe(emptyRecipe)
    setEditingRecipe(null)
    setRecipeFormError("")
    setRecipeFormOpen(false)
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-12">
        <section className="relative mb-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-primary to-[#3D174B] px-6 py-10 text-white soft-shadow md:px-12 md:py-14">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FFB3D1]">
              Everyday nourishment
            </p>

            <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-semibold leading-tight md:text-5xl">
              A gentler guide to eating well
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/90 md:text-lg">
              Simple, flexible meal ideas for breakfast, lunch, and dinner, plus
              a routine you can adapt to your day, appetite, and food preferences.
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-12 -right-4 text-[210px] text-[#FFB3D1]/15 md:right-10">
            restaurant
          </span>
        </section>

        <section
          className="mb-12 rounded-3xl border border-outline-variant/70 bg-white p-6 soft-shadow md:p-8"
          aria-labelledby="daily-log-heading"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                Personal daily record
              </p>

              <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
                Daily diet log
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Record what you ate and review entries by date. Your log is saved in this browser.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-primary">
              View date

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-xl border border-outline bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          {dietLogError && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-risk-high/30 bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container"
            >
              {dietLogError}
            </p>
          )}

          <form
            onSubmit={addFoodEntry}
            className="mb-7 grid gap-4 rounded-2xl bg-surface-container p-4 md:grid-cols-2 md:p-5"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Meal

              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {trackedMealTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold">
              What did you eat?

              <input
                required
                value={food}
                onChange={(event) =>
                  setFood(
                    event.target.value,
                  )
                }
                placeholder="e.g. oats, banana, and yogurt"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold">
              Portion / quantity

              <input
                value={portion}
                onChange={(event) =>
                  setPortion(event.target.value)
                }
                placeholder="e.g. 1 bowl"
                className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold md:col-span-2">
              Notes <span className="font-normal text-on-surface-variant">(optional)</span>
              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value,
                  )
                }
                rows={2}
                className="resize-y rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-tertiary md:col-span-2 md:justify-self-end"
            >
              <span className="material-symbols-outlined">
                add
              </span>

              {dietLogLoading
                ? "Saving..."
                : editingDietEntry
                  ? "Update meal"
                  : "Add meal to log"}
            </button>

            {editingDietEntry && (
              <button
                type="button"
                onClick={resetDietForm}
                className="rounded-xl border border-[#e8e2cf] px-5 py-3 font-semibold md:col-span-2 md:justify-self-end"
              >
                Cancel
              </button>
            )}
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">
                {selectedDate === getLocalDate()
                  ? "Today's entries"
                  : selectedDate
                    ? `Entries for ${new Date(`${selectedDate}T12:00:00`).toLocaleDateString()}`
                    : "Choose a date"}
              </h3>
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                {todaysEntries.length} {todaysEntries.length === 1 ? "meal" : "meals"}
              </span>
            </div>
            <p className="mb-4 text-sm text-on-surface-variant">
              {mainMealsLogged} of 3 main meal periods have entries. Snacks are optional.
            </p>

            <div>
              <p className="mt-2 text-2xl font-bold">
                {mainMealsLogged}/3
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#77776d]">
                Logged today
              </p>

              <p className="mt-2 text-2xl font-bold">
                {todaysEntries.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#77776d]">
                Water
              </p>

              <p className="mt-2 text-2xl font-bold">
                {hydration}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trackedMealTypes.map(
              (type) => (
                <section
                  key={type}
                  aria-label={`${type} entries`}
                  className="rounded-2xl border border-outline-variant p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">{type}</h4>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      entriesByMeal[type].length
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}>
                      {entriesByMeal[type].length ? "Logged" : type === "Snack" ? "Optional" : "Not logged"}
                    </span>
                  </div>

                  {entriesByMeal[type]
                    .length ? (
                    <ul className="space-y-3">
                      {entriesByMeal[type].map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-surface-container p-3"
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm leading-6">{entry.food}</p>
                            <p className="mt-1 text-xs text-on-surface-variant">{entry.time}</p>
                            {entry.notes && (
                              <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-on-surface-variant">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteFoodEntry(entry.DietLogID)}
                            aria-label={`Delete ${entry.mealType} entry`}
                            className="rounded-full p-2 text-on-surface-variant hover:bg-tertiary-container hover:text-risk-high"
                          >
                            <div>
                              <p className="text-sm">
                                {entry.Food}
                              </p>

                              {entry.Portion && (
                                <p className="mt-1 text-xs text-[#77776d]">
                                  Portion: {entry.Portion}
                                </p>
                              )}

                              {entry.Notes && (
                                <p className="mt-1 text-sm text-[#77776d]">
                                  {entry.Notes}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditingDietEntry(entry)
                                }
                                className="rounded-full p-2 text-[#77776d] hover:text-[#535845]"
                                aria-label="Edit meal"
                              >
                                <span className="material-symbols-outlined">
                                  edit
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteFoodEntry(entry.DietLogID)
                                }
                                className="rounded-full p-2 text-[#77776d] hover:text-[#9b4937]"
                                aria-label="Delete meal"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button>
                            </div>
                          </button>
                        </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-on-surface-variant">
                      No {type.toLowerCase()} recorded for this date.
                    </p>
                  )}
                </section>
              ),
            )}
          </div>

          <details className="mt-4 rounded-2xl border border-[#e8e2cf] bg-[#faf7f0] p-4">
            <summary className="cursor-pointer font-semibold text-[#535845]">
              Review this week’s meal history ({weekEntries.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {weekEntries.length ? (
                weekEntries.map((entry) => (
                  <li
                    key={entry.DietLogID}
                    className="rounded-xl bg-white p-3 text-sm"
                  >
                    <span className="font-semibold">
                      {String(entry.LogDate).slice(0, 10)} · {entry.MealType}
                    </span>
                    <span> — {entry.Food}</span>
                    {entry.Portion && <span> ({entry.Portion})</span>}
                  </li>
                ))
              ) : (
                <li className="text-sm text-[#77776d]">
                  No meals recorded for this week.
                </li>
              )}
            </ul>
          </details>
        </section>

        {/* NUTRITION */}

        <section className="mb-12 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm md:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
            Today's overview
          </p>

          <h2 className="mb-2 font-['Playfair_Display'] text-3xl font-semibold">
            General nutrition check-in
          </h2>

          <p className="mb-6 text-sm leading-6 text-[#626258]">
            This is a simple reflection based on
            foods you logged. It does not calculate
            calories or diagnose nutritional deficiencies.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["meals", "Meals logged this week", "restaurant"],
              ["breakfast", "Breakfast", "wb_twilight"],
              ["lunch", "Lunch", "light_mode"],
              ["dinner", "Dinner", "bedtime"],
              ["snacks", "Snacks", "nutrition"],
              ["variety", "Different foods", "diversity_3"],
              ["vegetables", "Vegetable meals", "eco"],
              ["fruit", "Fruit meals", "nutrition"],
              ["protein", "Protein-food meals", "egg"],
              ["grains", "Grain meals", "grain"],
            ].map(
              ([key, label, icon]) => (
                <div
                  key={key}
                  className="rounded-2xl bg-[#faf7f0] p-4"
                >
                  <span className="material-symbols-outlined text-[#535845]">
                    {icon}
                  </span>

                  <p className="mt-2 text-sm font-semibold">
                    {label}
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#535845]">
                    {nutritionSummary[key]}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* RECIPES */}

        <section className="mb-12">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Recipe collection
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
              Recipes for your day
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626258]">
              Search recipes, save favorites,
              create your own recipes, plan meals,
              and add ingredients to your shopping list.
            </p>
          </div>

          <div className="mb-5 grid gap-3 rounded-2xl bg-[#faf7f0] p-4 md:grid-cols-[1fr_auto_auto_auto]">
            <input
              type="text"
              value={recipeSearch}
              onChange={(event) =>
                setRecipeSearch(
                  event.target.value,
                )
              }
              placeholder="Search recipes or ingredients..."
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            />

            <select
              value={recipeMealType}
              onChange={(event) =>
                setRecipeMealType(
                  event.target.value,
                )
              }
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            >
              <option value="All">
                All meals
              </option>

              {trackedMealTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ),
              )}
            </select>

            <select
              value={recipeSpecialFilter}
              onChange={(event) =>
                setRecipeSpecialFilter(event.target.value)
              }
              aria-label="Filter recipes"
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            >
              {[
                ["All", "Any recipe type"],
                ["Vegetarian", "Vegetarian (meat-free)"],
                ["Quick", "Quick (20 minutes or less)"],
                ["No-cook", "No-cook (no cooking needed)"],
              ].map(([filter, label]) => (
                <option key={filter} value={filter}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowFavoritesOnly(
                  (value) => !value,
                )
              }
              className={`rounded-xl px-4 py-3 font-semibold ${
                showFavoritesOnly
                  ? "bg-[#535845] text-white"
                  : "border border-[#e8e2cf] bg-white text-[#535845]"
              }`}
            >
              {showFavoritesOnly
                ? "Showing favorites"
                : "Favorites only"}
            </button>
          </div>

          <form
            onSubmit={generateRecipeSuggestion}
            className="mb-5 rounded-2xl bg-[#faf7f0] p-4"
          >
            <label className="mb-2 block text-sm font-semibold text-[#535845]">
              Recipe suggestions from your ingredients
            </label>
            <textarea
              value={recipeAssistantPrompt}
              onChange={(event) =>
                setRecipeAssistantPrompt(event.target.value)
              }
              rows={2}
              placeholder="I have oats, banana, milk and almonds..."
              className="w-full rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            />
            <p className="mt-2 text-xs text-[#77776d]">
              Suggestions use recipe and ingredient matching rules; no AI model is connected.
            </p>
            {recipeAssistantError && (
              <p className="mt-2 text-sm text-[#9b4937]">
                {recipeAssistantError}
              </p>
            )}
            <button
              type="submit"
              disabled={recipeAssistantLoading}
              className="mt-3 rounded-xl bg-[#535845] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {recipeAssistantLoading ? "Working..." : "Suggest a recipe"}
            </button>
            {recipeAssistantResult && (
              <div className="mt-4 rounded-xl border border-[#e8e2cf] bg-white p-4">
                <p className="font-semibold">{recipeAssistantResult.Name}</p>
                <p className="mt-1 text-xs text-[#77776d]">
                  {recipeAssistantResult.MealType} · {recipeAssistantResult.CookingTime}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm">
                  {recipeAssistantResult.Ingredients}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {recipeAssistantResult.Instructions}
                </p>
                <p className="mt-2 text-xs text-[#77776d]">
                  {recipeAssistantResult.SourceNote}
                </p>
                <button
                  type="button"
                  disabled={recipeAssistantLoading}
                  onClick={saveGeneratedRecipe}
                  className="mt-3 rounded-xl border border-[#535845] px-4 py-2 text-sm font-semibold text-[#535845] disabled:opacity-60"
                >
                  Save to personal recipes
                </button>
              </div>
            )}
          </form>

          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (recipeFormOpen) {
                  resetRecipeForm()
                } else {
                  setRecipeFormOpen(true)
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#535845] px-4 py-2.5 text-sm font-semibold text-[#535845]"
            >
              <span className="material-symbols-outlined">
                {recipeFormOpen ? "close" : "add"}
              </span>

              {recipeFormOpen
                ? "Close recipe form"
                : "Add personal recipe"}
            </button>
          </div>

          {recipeFormOpen && (
            <form
              onSubmit={saveRecipe}
              className="mb-6 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold">
                  {editingRecipe
                    ? "Edit recipe"
                    : "Save your own recipe"}
                </h3>

                {editingRecipe && (
                  <span className="rounded-full bg-[#f3efdf] px-3 py-1 text-xs font-semibold text-[#535845]">
                    Editing personal recipe
                  </span>
                )}
              </div>

              {recipeFormError && (
                <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
                  {recipeFormError}
                </p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={newRecipe.Name}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Name: event.target.value,
                    })
                  }
                  placeholder="Recipe name"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />

                <select
                  value={newRecipe.MealType}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      MealType:
                        event.target.value,
                    })
                  }
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                >
                  {trackedMealTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ),
                  )}
                </select>

                <textarea
                  required
                  value={
                    newRecipe.Ingredients
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Ingredients:
                        event.target.value,
                    })
                  }
                  placeholder="Ingredients"
                  rows={3}
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3 md:col-span-2"
                />

                <textarea
                  required
                  value={
                    newRecipe.Instructions
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Instructions:
                        event.target.value,
                    })
                  }
                  placeholder="Instructions"
                  rows={4}
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3 md:col-span-2"
                />

                <input
                  value={
                    newRecipe.CookingTime
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      CookingTime:
                        event.target.value,
                    })
                  }
                  placeholder="Cooking time"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />

                <input
                  value={newRecipe.Notes}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Notes: event.target.value,
                    })
                  }
                  placeholder="Notes"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={recipeFormSaving}
                  className="rounded-xl bg-[#535845] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {recipeFormSaving
                    ? "Saving..."
                    : editingRecipe
                      ? "Update recipe"
                      : "Save recipe"}
                </button>

                <button
                  type="button"
                  onClick={resetRecipeForm}
                  className="rounded-xl border border-[#e8e2cf] px-5 py-3 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {recipesLoading && (
            <p className="rounded-2xl bg-white px-5 py-4 text-sm text-[#77776d] shadow-sm">
              Loading recipes...
            </p>
          )}

          {recipesError && (
            <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
              {recipesError}
            </p>
          )}

          {favoritesLoading && (
            <p className="mb-4 text-xs text-[#77776d]">
              Syncing favorites...
            </p>
          )}

          {!recipesLoading &&
            filteredRecipes.length === 0 && (
              <p className="rounded-2xl border border-[#e8e2cf] bg-white px-5 py-4 text-sm text-[#77776d]">
                No recipes match your search or filters.
              </p>
            )}

          {!recipesLoading &&
            filteredRecipes.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredRecipes.map(
                  (recipe) => (
                    <RecipeCard
                      key={recipe.RecipeID}
                      recipe={recipe}
                      isFavorite={favoriteRecipes.includes(
                        recipe.RecipeID,
                      )}
                      isPersonal={
                        Number(recipe.UserID) === currentUserId
                      }
                      onToggleFavorite={
                        toggleFavorite
                      }
                      onAddToPlanner={
                        addToPlanner
                      }
                      onAddIngredients={
                        addRecipeIngredients
                      }
                      onOpen={
                        setSelectedRecipe
                      }
                    />
                  ),
                )}
              </div>
            )}
        </section>

        {/* RECIPE DETAIL */}

        {selectedRecipe && (
          <section className="mb-12 rounded-3xl bg-[#535845] p-6 text-white shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e5dfc8]">
                  Recipe details
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
                  {selectedRecipe.Name}
                </h2>

                <p className="mt-2 text-sm text-[#e5dfc8]">
                  {selectedRecipe.MealType}
                  {selectedRecipe.CookingTime
                    ? ` · ${selectedRecipe.CookingTime}`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecipe(null)
                }
                className="rounded-full bg-white/10 p-2"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">
                  Ingredients
                </h3>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#f3f0e6]">
                  {selectedRecipe.Ingredients}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">
                  Instructions
                </h3>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#f3f0e6]">
                  {selectedRecipe.Instructions}
                </p>
              </div>
            </div>

            {Number(selectedRecipe.UserID) === currentUserId && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    startEditingRecipe(
                      selectedRecipe,
                    )
                  }
                  className="rounded-xl bg-white px-4 py-2.5 font-semibold text-[#535845]"
                >
                  Edit recipe
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteRecipe(
                      selectedRecipe,
                    )
                  }
                  className="rounded-xl border border-white/40 px-4 py-2.5 font-semibold text-white"
                >
                  Delete recipe
                </button>
              </div>
            )}
          </section>
        )}

        {/* WEEKLY PLANNER */}

<section className="mb-12 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm md:p-8">
  <div className="mb-5">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
      Weekly planning
    </p>

    <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
      Plan your meals
    </h2>

    <p className="mt-2 text-sm text-[#626258]">
      Your meal plans are stored in your account.
    </p>

    <label className="mt-4 flex max-w-xs flex-col gap-2 text-sm font-semibold">
      Week starting
      <input
        type="date"
        value={plannerWeekStart}
        onChange={(event) =>
          setPlannerWeekStart(getMondayDate(event.target.value))
        }
        className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal"
      />
    </label>
  </div>

  {plannerError && (
    <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
      {plannerError}
    </p>
  )}

  {/* ADD TO PLAN */}
  <div className="mb-6 rounded-2xl bg-[#faf7f0] p-4 md:p-5">
    <div className="grid gap-4 md:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Day
        <select
          value={plannerDay}
          onChange={(event) =>
            setPlannerDay(event.target.value)
          }
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        >
          {plannerDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold">
        Meal
        <select
          value={plannerMealType}
          onChange={(event) =>
            setPlannerMealType(event.target.value)
          }
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        >
          {trackedMealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold">
  Recipe

  <select
    value={selectedPlannerRecipe}
    onChange={(event) =>
      setSelectedPlannerRecipe(event.target.value)
    }
    className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
  >
    <option value="">Select a recipe</option>

    {recipes.map((recipe) => (
      <option
        key={recipe.RecipeID}
        value={recipe.RecipeID}
      >
        {recipe.Name}
      </option>
    ))}
  </select>
</label>
    </div>

    <button
      type="button"
      disabled={!selectedPlannerRecipe}
      onClick={() =>
        addToPlanner(
          Number(selectedPlannerRecipe),
        )
      }
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#535845] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#444937] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[20px]">
        add
      </span>
      Add to Plan
    </button>

    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={plannerLoading}
        onClick={generateWeeklyPlan}
        className="rounded-xl border border-[#535845] px-4 py-3 font-semibold text-[#535845] disabled:opacity-60"
      >
        {plannerLoading ? "Saving plan..." : "Generate Weekly Plan"}
      </button>

      <button
        type="button"
        disabled={shoppingLoading}
        onClick={generateShoppingListFromPlan}
        className="rounded-xl border border-[#535845] px-4 py-3 font-semibold text-[#535845] disabled:opacity-60"
      >
        {shoppingLoading ? "Creating list..." : "Shopping list from this week"}
      </button>
    </div>
  </div>

  {/* SAVED PLANS */}
  {plannerLoading ? (
    <p className="text-sm text-[#77776d]">
      Loading planner...
    </p>
  ) : plannerRecipes.length ? (
    <div className="space-y-3">
      {plannerRecipes.map((item) => (
        <div
          key={item.PlannerID}
          className="flex items-center justify-between gap-4 rounded-2xl bg-[#faf7f0] p-4"
        >
          <div>
            <p className="font-semibold">
              {item.recipe?.Name || "Recipe"}
            </p>

            <p className="text-sm text-[#77776d]">
              {item.MealType}
            </p>

            <p className="mt-1 text-xs text-[#999]">
              {item.PlanDate}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              removeFromPlanner(item.PlannerID)
            }
            className="rounded-full p-2 text-[#77776d] hover:bg-[#f3efdf] hover:text-[#9b4937]"
            aria-label="Remove planned recipe"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="rounded-2xl bg-[#faf7f0] p-4 text-sm text-[#77776d]">
      No {plannerMealType.toLowerCase()} recipes planned yet.
    </p>
  )}
</section>

        {/* PANTRY + SHOPPING */}

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Pantry
            </p>

            <h2 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold">
              What do you have?
            </h2>

            <p className="mb-4 text-sm text-[#626258]">
              Pantry items are stored in your account.
            </p>

            {pantryError && (
              <p className="mb-3 rounded-xl bg-[#fff4ef] p-3 text-sm text-[#9b4937]">
                {pantryError}
              </p>
            )}

            <form
              onSubmit={addPantryItem}
              className="mb-4 flex gap-2"
            >
              <input
                value={pantryInput}
                onChange={(event) =>
                  setPantryInput(
                    event.target.value,
                  )
                }
                placeholder="e.g. oats"
                className="min-w-0 flex-1 rounded-xl border border-[#e8e2cf] px-4 py-3"
              />

              <button
                type="submit"
                disabled={pantryLoading}
                className="rounded-xl bg-[#535845] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                Add
              </button>
            </form>

            <div className="mb-4 flex flex-wrap gap-2">
              {pantry.map(
                (item) => (
                  <button
                    key={item.PantryItemID}
                    type="button"
                    onClick={() =>
                      removePantryItem(
                        item.PantryItemID,
                      )
                    }
                    className="rounded-full bg-[#f3efdf] px-3 py-2 text-xs font-semibold text-[#535845]"
                  >
                    {item.ItemName} ×
                  </button>
                ),
              )}
            </div>

            {pantry.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">
                  Matching recipes
                </p>

                {pantryMatches.length ? (
                  <div className="space-y-2">
                    {pantryMatches
                      .slice(0, 5)
                      .map(
                        (recipe) => (
                          <button
                            key={
                              recipe.RecipeID
                            }
                            type="button"
                            onClick={() =>
                              setSelectedRecipe(
                                recipe,
                              )
                            }
                            className="block w-full rounded-xl bg-[#faf7f0] p-3 text-left text-sm hover:bg-[#f3efdf]"
                          >
                            {recipe.Name}
                          </button>
                        ),
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-[#77776d]">
                    No recipes currently match your pantry.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Shopping list
            </p>

            <h2 className="mb-4 font-['Playfair_Display'] text-2xl font-semibold">
              Keep your next shop simple
            </h2>

            {shoppingError && (
              <p className="mb-3 rounded-xl bg-[#fff4ef] p-3 text-sm text-[#9b4937]">
                {shoppingError}
              </p>
            )}

            <form
              onSubmit={addShoppingItem}
              className="mb-4 flex gap-2"
            >
              <input
                value={shoppingInput}
                onChange={(event) =>
                  setShoppingInput(
                    event.target.value,
                  )
                }
                placeholder="Add an item"
                className="min-w-0 flex-1 rounded-xl border border-[#e8e2cf] px-4 py-3"
              />

              <button
                type="submit"
                disabled={shoppingLoading}
                className="rounded-xl bg-[#535845] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                Add
              </button>
            </form>

            {shoppingList.length ? (
              <ul className="space-y-2">
                {shoppingList.map(
                  (item) => (
                    <li
                      key={
                        item.ShoppingItemID
                      }
                      className="flex items-center gap-2 rounded-xl bg-[#faf7f0] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            item.IsChecked,
                          )
                        }
                        onChange={() =>
                          toggleShoppingItem(
                            item,
                          )
                        }
                      />

                      <span
                        className={`min-w-0 flex-1 text-sm ${
                          item.IsChecked
                            ? "text-[#999] line-through"
                            : ""
                        }`}
                      >
                        {item.ItemName}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeShoppingItem(
                            item.ShoppingItemID,
                          )
                        }
                        className="rounded-full p-1 text-[#77776d] hover:text-[#9b4937]"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-sm text-[#77776d]">
                Your shopping list is empty.
              </p>
            )}
          </div>
        </section>

        {/* HYDRATION */}

        <section className="mb-12 rounded-3xl bg-[#e5dfc8] p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
                Hydration
              </p>

              <h2 className="font-['Playfair_Display'] text-2xl font-semibold">
                Keep a simple water record
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#55564b]">
                Water records are saved for the selected date.
                This is a simple tracker, not a medical target.
              </p>

              {hydrationError && (
                <p className="mt-3 text-sm text-[#9b4937]">
                  {hydrationError}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#535845]">
              Personal target
              <input
                type="number"
                min="1"
                step="1"
                value={hydrationTarget}
                onChange={(event) =>
                  saveHydrationTarget(event.target.value)
                }
                className="w-16 rounded-lg border border-[#d9d4c1] bg-white px-2 py-2 text-center"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={
                  hydrationLoading ||
                  hydration <= 0
                }
                onClick={() =>
                  updateHydration(
                    hydration - 1,
                  )
                }
                className="rounded-xl bg-white px-4 py-3 text-xl font-semibold text-[#535845] disabled:opacity-50"
              >
                −
              </button>

              <span className="min-w-20 text-center text-2xl font-bold text-[#535845]">
                {hydration}
                <span className="block text-xs font-normal">
                  of {hydrationTarget}
                </span>
              </span>

              <button
                type="button"
                disabled={hydrationLoading}
                onClick={() =>
                  updateHydration(
                    hydration + 1,
                  )
                }
                className="rounded-xl bg-[#535845] px-4 py-3 text-xl font-semibold text-white disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* MEAL SUGGESTIONS */}

        <section className="mb-12">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
              Build a satisfying day
            </p>
            <h2
              id="meal-ideas-heading"
              className="font-['Playfair_Display'] text-3xl font-semibold text-plum-deep"
            >
              Meal suggestions
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
              Pick the ideas that suit you and swap ingredients freely. These
              are examples, not a strict meal plan.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-[#e8e2cf] bg-[#faf7f0] p-4">
            <p className="text-sm font-semibold text-[#535845]">
              {smartSuggestion.personalized
                ? "A thought from your recent meal log"
                : "General idea while you build your meal history"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#626258]">
              {smartSuggestion.text}
            </p>
            {quickRecipe && (
              <p className="mt-2 text-sm text-[#626258]">
                Under-20-minute idea: {quickRecipe.Name} ({quickRecipe.CookingTime}).
              </p>
            )}
          </div>

          {mealsLoading && (
            <p className="mb-4 text-sm text-[#77776d]">
              Loading meal suggestions...
            </p>
          )}

          {mealsError && (
            <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
              {mealsError}
            </p>
          )}

          {!mealsLoading &&
            !mealsError &&
            meals.length === 0 && (
              <p className="rounded-2xl border border-[#e8e2cf] bg-white p-4 text-sm text-[#77776d]">
                No meal suggestions are available yet.
              </p>
            )}

          <div className="grid gap-5 lg:grid-cols-3">
            {meals.map(
              (meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  index={index}
                />
              ),
            )}
          </div>
        </section>

        {/* FLEXIBLE PLATE */}

        <section className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-secondary-container p-6 md:p-8">
            <span className="material-symbols-outlined mb-4 text-[30px] text-secondary">
              nutrition
            </span>

            <h2 className="mb-3 font-['Playfair_Display'] text-2xl font-semibold">
              A flexible plate
            </h2>
            <p className="mb-5 text-sm leading-6 text-on-secondary-container">
              When it works for you, include a variety of colorful vegetables
              or fruit, a protein-rich food, and a grain or other energy-giving
              food. Add nourishing fats and calcium-containing foods across the
              day.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Vegetables & fruit",
                "Protein",
                "Whole grains",
                "Calcium foods",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-on-secondary-container"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-outline-variant bg-white p-6 md:p-8 soft-shadow">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
              Make it your own
            </p>

            <h2 className="mb-5 font-['Playfair_Display'] text-2xl font-semibold">
              Small habits, no strict rules
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">water_drop</span>
                <h3 className="mb-1 text-sm font-bold">Keep water nearby</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Drink regularly and adjust to your thirst, activity, and climate.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">schedule</span>
                <h3 className="mb-1 text-sm font-bold">Find a steady rhythm</h3>
                <p className="text-sm leading-5 text-on-surface-variant">A predictable meal pattern can help make planning easier.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">eco</span>
                <h3 className="mb-1 text-sm font-bold">Choose variety</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Rotate foods you enjoy rather than relying on one “perfect” menu.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-tertiary">favorite</span>
                <h3 className="mb-1 text-sm font-bold">Notice what suits you</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Personal comfort and dietary needs can differ from person to person.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ROUTINE */}

        <section>
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
              A sample daily flow
            </p>
            <h2
              id="routine-heading"
              className="font-['Playfair_Display'] text-3xl font-semibold text-plum-deep"
            >
              A routine that bends with your day
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {routine.map((step, index) => (
              <article
                key={step.time}
                className="flex gap-4 rounded-2xl border border-outline-variant bg-white p-5 soft-shadow"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </span>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    {step.time} · {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mb-1 font-semibold">{step.title}</h3>
                  <p className="text-sm leading-6 text-on-surface-variant">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-10 rounded-2xl border border-secondary/30 bg-secondary-container p-5 text-sm leading-6 text-on-secondary-container">
          <strong className="text-primary">A note about personal needs:</strong>{" "}
          This is general wellness information, not a treatment plan. Allergies,
          medical conditions, medications, culture, and budget all affect what
          works. For tailored advice, speak with a registered dietitian or
          healthcare professional.
        </aside>
      </main>
    </div>
  )
}