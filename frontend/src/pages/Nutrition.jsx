import { useEffect, useMemo, useState } from "react"
import api from "../api/axios"

const generalWellnessTips = [
  {
    icon: "medical_services",
    tone: "tertiary",
    title: "Balanced meals",
    desc: "Aim for a mix of protein, fiber, and healthy fats to support steady energy.",
  },
  {
    icon: "water_drop",
    tone: "risk-low",
    title: "Hydration",
    desc: "Regular water intake supports everyday wellbeing and can help with energy levels.",
  },
  {
    icon: "energy_savings_leaf",
    tone: "tertiary",
    title: "Whole foods",
    desc: "A diet centered on vegetables, fruits, whole grains, and legumes is a practical foundation.",
  },
  {
    icon: "vital_signs",
    tone: "primary",
    title: "Consistency",
    desc: "Small, sustainable food habits are often easier to maintain than strict plans.",
  },
]

const foodKeywords = [
  "idli", "dosa", "sambar", "roti", "chapati",
  "apple", "apricot", "avocado", "banana", "blackberry", "blueberry",
  "cherry", "clementine", "coconut", "cranberry", "date", "fig",
  "grape", "grapefruit", "kiwi", "lemon", "lime", "mango", "melon",
  "nectarine", "orange", "papaya", "peach", "pear", "pineapple",
  "plum", "pomegranate", "raspberry", "strawberry", "watermelon",
  "vegetable", "artichoke", "arugula", "asparagus", "aubergine", "beet", "bell pepper",
  "broccoli", "brussels sprouts", "cabbage", "carrot", "cauliflower",
  "celery", "chard", "corn", "cucumber", "eggplant", "kale", "lettuce",
  "mushroom", "onion", "parsnip", "peas", "pepper", "potato", "pumpkin",
  "radish", "spinach", "squash", "sweet potato", "tomato", "turnip",
  "zucchini", "bean", "chickpea", "lentil", "pea", "tofu", "tempeh",
  "edamame", "egg", "chicken", "turkey", "beef", "pork", "fish",
  "salmon", "tuna", "shrimp", "prawn", "paneer", "dal", "curd",
  "yogurt", "yoghurt", "cheese",
  "milk", "quinoa", "oatmeal", "oat", "rice", "bread", "pasta", "almond", "cashew",
  "walnut", "peanut", "chia", "flax", "sunflower seed", "pumpkin seed",
]

const fruitAndVegetableKeywords = [
  "apple", "apricot", "avocado", "banana", "blackberry", "blueberry",
  "cherry", "clementine", "coconut", "cranberry", "date", "fig",
  "grape", "grapefruit", "kiwi", "lemon", "lime", "mango", "melon",
  "nectarine", "orange", "papaya", "peach", "pear", "pineapple",
  "plum", "pomegranate", "raspberry", "strawberry", "watermelon",
  "vegetable", "artichoke", "arugula", "asparagus", "aubergine", "beet", "bell pepper",
  "broccoli", "brussels sprouts", "cabbage", "carrot", "cauliflower",
  "celery", "chard", "corn", "cucumber", "eggplant", "kale", "lettuce",
  "mushroom", "onion", "parsnip", "peas", "pepper", "potato", "pumpkin",
  "radish", "spinach", "squash", "sweet potato", "tomato", "turnip",
  "zucchini",
]

const proteinFoodKeywords = [
  "bean", "chickpea", "lentil", "pea", "tofu", "tempeh", "edamame",
  "egg", "chicken", "turkey", "beef", "pork", "fish", "salmon", "tuna",
  "shrimp", "prawn", "paneer", "dal", "curd", "yogurt", "yoghurt",
  "cheese", "milk", "quinoa",
  "almond", "cashew", "walnut", "peanut", "chia", "flax", "sunflower seed",
  "pumpkin seed",
]

const grainKeywords = [
  "idli", "dosa", "rice", "roti", "chapati", "bread", "oat", "oatmeal",
  "quinoa", "wheat", "millet", "corn", "pasta", "noodle", "barley",
]

const dairyKeywords = [
  "milk", "paneer", "curd", "yogurt", "yoghurt", "cheese", "buttermilk",
]

function findMentionedFoods(foods, keywords) {
  const text = foods.join(" ").toLowerCase()
  return [...new Set(keywords.filter((food) => {
    const escaped = food.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(`\\b${escaped}(?:s|es)?\\b`, "i").test(text)
  }))]
}

function getLocalDateKey(value) {
  if (typeof value !== "string") return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function getCurrentWeekRange() {
  const today = new Date()
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  const end = new Date(start)
  end.setDate(end.getDate() + 6)

  const toDateKey = (date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-")

  return {
    today: toDateKey(today),
    start: toDateKey(start),
    end: toDateKey(end),
  }
}

function NutrientCard({ icon, tone, title, desc }) {
  const toneClass =
    tone === "tertiary"
      ? "text-tertiary"
      : tone === "risk-low"
      ? "text-risk-low"
      : "text-primary"

  return (
    <div className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40 flex flex-col gap-2">
      <span
        className={`material-symbols-outlined ${toneClass}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>

      <span className="font-headline text-base text-plum-deep">
        {title}
      </span>

      <span className="text-xs text-on-surface-variant">
        {desc}
      </span>
    </div>
  )
}

export default function Nutrition() {
  const [dietLogs, setDietLogs] = useState([])
  const [hydrationLogs, setHydrationLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dietError, setDietError] = useState("")
  const [hydrationError, setHydrationError] = useState("")

  useEffect(() => {
    let active = true

    const loadNutritionData = async () => {
      try {
        const [dietResult, hydrationResult] = await Promise.allSettled([
          api.get("/diet/logs"),
          api.get("/hydration"),
        ])

        if (!active) return

        if (dietResult.status === "fulfilled") {
          setDietLogs(Array.isArray(dietResult.value.data) ? dietResult.value.data : [])
        } else {
          setDietError("Could not load your diet logs. Please try again later.")
        }

        if (hydrationResult.status === "fulfilled") {
          setHydrationLogs(
            Array.isArray(hydrationResult.value.data)
              ? hydrationResult.value.data
              : [],
          )
        } else {
          setHydrationError("Hydration information is currently unavailable.")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void Promise.resolve().then(loadNutritionData)
    return () => {
      active = false
    }
  }, [])

  const summary = useMemo(() => {
    const week = getCurrentWeekRange()
    const thisWeekLogs = dietLogs.filter((entry) => {
      const logDate = getLocalDateKey(entry.LogDate)
      return logDate >= week.start && logDate <= week.end
    })
    const foods = dietLogs
      .map((entry) => String(entry.Food || "").trim())
      .filter(Boolean)
    const weekFoods = thisWeekLogs
      .map((entry) => String(entry.Food || "").trim())
      .filter(Boolean)
    const mentionedFoods = findMentionedFoods(foods, foodKeywords)
    const recognizedWeekFoods = findMentionedFoods(weekFoods, foodKeywords)
    const latestHydration = hydrationLogs.find(
      (entry) => getLocalDateKey(entry.LogDate) === week.today,
    )
    const weekHydrationLogs = hydrationLogs.filter((entry) => {
      const logDate = getLocalDateKey(entry.LogDate)
      return logDate >= week.start && logDate <= week.end
    })
    const recentMeals = [...dietLogs]
      .filter((entry) => getLocalDateKey(entry.LogDate))
      .sort((left, right) => {
        const dateDifference =
          getLocalDateKey(right.LogDate).localeCompare(
            getLocalDateKey(left.LogDate),
          )
        if (dateDifference) return dateDifference
        return String(right.CreatedAt || "").localeCompare(
          String(left.CreatedAt || ""),
        )
      })
      .slice(0, 5)

    return {
      meals: dietLogs.length,
      breakfast: dietLogs.filter(
        (entry) => String(entry.MealType).toLowerCase() === "breakfast",
      ).length,
      lunch: dietLogs.filter(
        (entry) => String(entry.MealType).toLowerCase() === "lunch",
      ).length,
      dinner: dietLogs.filter(
        (entry) => String(entry.MealType).toLowerCase() === "dinner",
      ).length,
      snacks: dietLogs.filter(
        (entry) => String(entry.MealType).toLowerCase() === "snack",
      ).length,
      foodVariety: mentionedFoods.length,
      fruitsAndVegetables: findMentionedFoods(foods, fruitAndVegetableKeywords),
      proteinFoods: findMentionedFoods(foods, proteinFoodKeywords),
      weekMeals: thisWeekLogs.length,
      weekBreakfast: thisWeekLogs.filter(
        (entry) => String(entry.MealType || "").toLowerCase() === "breakfast",
      ).length,
      weekLunch: thisWeekLogs.filter(
        (entry) => String(entry.MealType || "").toLowerCase() === "lunch",
      ).length,
      weekDinner: thisWeekLogs.filter(
        (entry) => String(entry.MealType || "").toLowerCase() === "dinner",
      ).length,
      weekSnacks: thisWeekLogs.filter(
        (entry) => String(entry.MealType || "").toLowerCase() === "snack",
      ).length,
      weekDays: new Set(
        thisWeekLogs
          .map((entry) => getLocalDateKey(entry.LogDate))
          .filter(Boolean),
      ).size,
      weekFoodVariety: recognizedWeekFoods.length,
      weekFruitsAndVegetables: findMentionedFoods(
        weekFoods,
        fruitAndVegetableKeywords,
      ),
      weekProteinFoods: findMentionedFoods(weekFoods, proteinFoodKeywords),
      weekGrains: findMentionedFoods(weekFoods, grainKeywords),
      weekDairy: findMentionedFoods(weekFoods, dairyKeywords),
      todayHydration: latestHydration,
      weekHydration: weekHydrationLogs.reduce(
        (total, entry) => total + (Number(entry.Glasses) || 0),
        0,
      ),
      weekHydrationDays: weekHydrationLogs.length,
      recentMeals,
      latestHydration,
    }
  }, [dietLogs, hydrationLogs])

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">

      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-8">

        {/* HERO */}
        <section className="mb-8">
          <h2 className="font-headline text-3xl text-plum-deep mb-3">
            Nourish Your Body
          </h2>

          <p className="text-on-surface-variant md:max-w-xl">
            General wellness guidance to support steady energy, hydration, and everyday healthy habits.
          </p>
        </section>

        {/* GENERAL WELLNESS GUIDANCE */}
        <section className="mb-10">
          <h3 className="text-sm text-primary mb-4 uppercase tracking-[0.1em] font-bold">
            General Wellness Habits
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generalWellnessTips.map((tip) => (
              <NutrientCard
                key={tip.title}
                {...tip}
              />
            ))}
          </div>
        </section>

        {/* LOGGED NUTRITION OVERVIEW */}
        <section className="mb-10">
          <h3 className="text-sm text-primary mb-4 uppercase tracking-[0.1em] font-bold">
            Your Logged Nutrition
          </h3>

          {loading ? (
            <p className="text-sm text-on-surface-variant" role="status">
              Loading your diet and hydration data...
            </p>
          ) : dietError ? (
            <p className="text-sm text-on-surface-variant" role="alert">
              {dietError}
            </p>
          ) : dietLogs.length === 0 ? (
            <p className="rounded-xl border border-outline-variant/40 bg-surface p-4 text-sm text-on-surface-variant">
              Log meals in Diet to build your nutrition overview.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  ["Meals logged", summary.meals],
                  ["Breakfast", summary.breakfast],
                  ["Lunch", summary.lunch],
                  ["Dinner", summary.dinner],
                  ["Snacks", summary.snacks],
                  ["Different foods mentioned", summary.foodVariety],
                ].map(([title, count]) => (
                  <div
                    key={title}
                    className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40"
                  >
                    <p className="text-xs text-on-surface-variant">{title}</p>
                    <p className="mt-1 font-headline text-2xl text-plum-deep">
                      {count}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  ["Fruits and vegetables mentioned", summary.fruitsAndVegetables],
                  ["Protein-containing foods mentioned", summary.proteinFoods],
                ].map(([title, foods]) => (
                  <div
                    key={title}
                    className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40"
                  >
                    <h4 className="font-headline text-base text-plum-deep">
                      {title}
                    </h4>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {foods.length ? foods.join(", ") : "No matching foods found in logged descriptions."}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-on-surface-variant">
                Food categories are identified from words in your logged food descriptions; this is not a nutrient analysis.
              </p>

              <div className="mt-8">
                <h4 className="mb-4 font-headline text-xl text-plum-deep">
                  This Week
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    ["Meals logged", summary.weekMeals],
                    ["Breakfast", summary.weekBreakfast],
                    ["Lunch", summary.weekLunch],
                    ["Dinner", summary.weekDinner],
                    ["Snacks", summary.weekSnacks],
                    ["Days with meals", summary.weekDays],
                    ["Distinct recognized foods", summary.weekFoodVariety],
                  ].map(([title, count]) => (
                    <div
                      key={title}
                      className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40"
                    >
                      <p className="text-xs text-on-surface-variant">{title}</p>
                      <p className="mt-1 font-headline text-2xl text-plum-deep">
                        {count}
                      </p>
                    </div>
                  ))}
                </div>

                {summary.weekFoodVariety === 0 && (
                  <p className="mt-3 text-sm text-on-surface-variant">
                    No recognized foods yet. Try including food names in your meal description.
                  </p>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    ["Fruits & vegetables", summary.weekFruitsAndVegetables],
                    ["Protein-containing foods", summary.weekProteinFoods],
                    ["Grains and cereals", summary.weekGrains],
                    ["Dairy / calcium-containing foods", summary.weekDairy],
                  ].map(([title, foods]) => (
                    <div
                      key={title}
                      className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40"
                    >
                      <h5 className="font-headline text-base text-plum-deep">
                        {title}
                      </h5>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {foods.length ? foods.join(", ") : "No matching foods mentioned this week."}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs text-on-surface-variant">
                  These groups are identified by food-name keywords in your meal descriptions; this is not laboratory nutrient analysis.
                </p>
              </div>
            </>
          )}

          {!loading && !dietError && (
            <div className="mt-8">
              <h4 className="mb-4 font-headline text-xl text-plum-deep">
                Recent Meals
              </h4>
              {summary.recentMeals.length ? (
                <div className="space-y-3">
                  {summary.recentMeals.map((entry) => {
                    const date = getLocalDateKey(entry.LogDate)
                    return (
                      <div
                        key={entry.DietLogID}
                        className="bg-surface p-4 rounded-xl soft-shadow border border-outline-variant/40"
                      >
                        <p className="text-xs text-on-surface-variant">
                          <time dateTime={date}>{date}</time>
                          {" · "}
                          {entry.MealType || "Meal"}
                        </p>
                        <p className="mt-1 text-sm text-plum-deep">
                          {entry.Food || "Food description unavailable"}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-outline-variant/40 bg-surface p-4 text-sm text-on-surface-variant">
                  Log meals in Diet to build your nutrition overview.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-outline-variant/40 bg-surface p-4">
            <h4 className="font-headline text-base text-plum-deep">
              Hydration
            </h4>
            {loading ? (
              <p className="mt-1 text-sm text-on-surface-variant" role="status">
                Loading hydration data...
              </p>
            ) : hydrationError ? (
              <p className="mt-1 text-sm text-on-surface-variant">{hydrationError}</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {summary.todayHydration
                    ? `${Number(summary.todayHydration.Glasses) || 0} glasses recorded today.`
                    : "No hydration entry recorded today."}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {summary.weekHydrationDays
                    ? `${summary.weekHydration} glasses recorded this week across ${summary.weekHydrationDays} day${summary.weekHydrationDays === 1 ? "" : "s"}.`
                    : "No hydration entries recorded this week."}
                </p>
              </>
            )}
          </div>
        </section>

        {/* WELLNESS TIP */}
        <section className="mt-10 bg-primary-container text-on-primary-container p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10 md:max-w-2xl">

            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-tertiary">
                lightbulb
              </span>

              <h3 className="text-xs uppercase tracking-[0.2em] font-bold">
                Wellness Tip
              </h3>
            </div>

            <p className="font-headline text-xl leading-relaxed italic">
              A simple, consistent meal pattern and regular hydration are practical foundations for everyday wellbeing.
            </p>
          </div>

          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary rounded-full opacity-10" />
        </section>

      </main>
    </div>
  )
}