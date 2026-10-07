import { useState } from "react"

const DIET_LOG_STORAGE_KEY = "menoverse-diet-log"
const trackedMealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]

const meals = [
  {
    id: "breakfast",
    time: "Start your day",
    title: "Breakfast",
    icon: "wb_twilight",
    summary: "Combine a protein source with fiber-rich foods for a satisfying start.",
    ideas: [
      "Oats with milk or fortified soy milk, fruit, nuts, and seeds",
      "Eggs or tofu with whole-grain toast and vegetables",
      "Idli or dosa with sambar and a side of fruit",
    ],
  },
  {
    id: "lunch",
    time: "Midday",
    title: "Lunch",
    icon: "light_mode",
    summary: "Build a balanced plate with vegetables, protein, and a whole grain.",
    ideas: [
      "Dal, brown rice or roti, and a generous serving of vegetables",
      "Chickpea or paneer bowl with vegetables and whole grains",
      "Fish or chicken with vegetables and rice, if included in your diet",
    ],
  },
  {
    id: "dinner",
    time: "Evening",
    title: "Dinner",
    icon: "bedtime",
    summary: "Choose a comfortable, nourishing meal that fits your schedule and appetite.",
    ideas: [
      "Vegetable khichdi with yogurt or a fortified alternative",
      "Tofu, paneer, or beans with cooked vegetables",
      "Soup with lentils and whole-grain bread or roti",
    ],
  },
]

const routine = [
  {
    time: "Morning",
    title: "Ease into breakfast",
    description: "Have water when you wake, then eat when it suits your appetite and routine.",
    icon: "sunny",
  },
  {
    time: "Midday",
    title: "Make lunch balanced",
    description: "Include vegetables, a protein food, and a grain or other satisfying carbohydrate.",
    icon: "lunch_dining",
  },
  {
    time: "Afternoon",
    title: "Plan a snack if hungry",
    description: "Try fruit with nuts, yogurt, or roasted chickpeas; a snack is optional.",
    icon: "nutrition",
  },
  {
    time: "Evening",
    title: "Keep dinner flexible",
    description: "Choose a meal that feels comfortable. There is no single required dinner time.",
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

function readDietLog() {
  try {
    const savedLog = localStorage.getItem(DIET_LOG_STORAGE_KEY)
    const parsedLog = savedLog ? JSON.parse(savedLog) : []

    if (!Array.isArray(parsedLog)) {
      return {
        entries: [],
        error: "Saved diet log data could not be read. New entries can still be added.",
      }
    }

    return {
      entries: parsedLog.filter(
        (entry) =>
          entry &&
          typeof entry.id === "string" &&
          typeof entry.date === "string" &&
          typeof entry.mealType === "string" &&
          typeof entry.food === "string",
      ),
      error: "",
    }
  } catch {
    return {
      entries: [],
      error: "Saved diet log data could not be read. New entries can still be added.",
    }
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

export default function Diet() {
  const [dietLog, setDietLog] = useState(readDietLog)
  const [selectedDate, setSelectedDate] = useState(getLocalDate)
  const [mealType, setMealType] = useState("Breakfast")
  const [food, setFood] = useState("")
  const [notes, setNotes] = useState("")
  const { entries, error: storageError } = dietLog

  const todaysEntries = entries
    .filter((entry) => entry.date === selectedDate)
    .sort((first, second) => second.createdAt - first.createdAt)
  const entriesByMeal = trackedMealTypes.reduce((groupedEntries, type) => {
    groupedEntries[type] = todaysEntries.filter(
      (entry) => entry.mealType.toLowerCase() === type.toLowerCase(),
    )
    return groupedEntries
  }, {})
  const mainMealsLogged = trackedMealTypes
    .filter((type) => type !== "Snack")
    .filter((type) => entriesByMeal[type].length > 0).length

  function saveEntries(nextEntries) {
    try {
      localStorage.setItem(DIET_LOG_STORAGE_KEY, JSON.stringify(nextEntries))
      setDietLog({ entries: nextEntries, error: "" })
    } catch {
      setDietLog((currentLog) => ({
        ...currentLog,
        error: "Your diet log could not be saved in this browser. Check available storage and try again.",
      }))
    }
  }

  function addFoodEntry(type, foodDescription, entryNotes = "") {
    const trimmedFood = foodDescription.trim()
    if (!trimmedFood || !selectedDate) {
      return
    }

    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      date: selectedDate,
      mealType: type,
      food: trimmedFood,
      notes: entryNotes.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: Date.now(),
    }

    saveEntries([...entries, entry])
    return true
  }

  function handleAddEntry(event) {
    event.preventDefault()
    if (!addFoodEntry(mealType, food, notes)) {
      return
    }
    setFood("")
    setNotes("")
  }

  function handleDeleteEntry(entryId) {
    saveEntries(entries.filter((entry) => entry.id !== entryId))
  }

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
              <h2
                id="daily-log-heading"
                className="font-['Playfair_Display'] text-3xl font-semibold"
              >
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
                required
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-xl border border-outline bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          {storageError && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-risk-high/30 bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container"
            >
              {storageError}
            </p>
          )}

          <form
            onSubmit={handleAddEntry}
            className="mb-7 grid gap-4 rounded-2xl bg-surface-container p-4 md:grid-cols-2 md:p-5"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Meal
              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
                  <option key={meal} value={meal}>{meal}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              What did you eat?
              <input
                required
                value={food}
                onChange={(event) => setFood(event.target.value)}
                placeholder="e.g. oats, banana, and yogurt"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold md:col-span-2">
              Notes <span className="font-normal text-on-surface-variant">(optional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything you want to remember about this meal?"
                rows={2}
                className="resize-y rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-tertiary md:col-span-2 md:justify-self-end"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add meal to log
            </button>
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

            <div className="grid gap-4 md:grid-cols-2">
              {trackedMealTypes.map((type) => (
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
                  {entriesByMeal[type].length ? (
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
                            onClick={() => handleDeleteEntry(entry.id)}
                            aria-label={`Delete ${entry.mealType} entry`}
                            className="rounded-full p-2 text-on-surface-variant hover:bg-tertiary-container hover:text-risk-high"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-on-surface-variant">
                      No {type.toLowerCase()} recorded for this date.
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="meal-ideas-heading">
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
          <div className="grid gap-5 lg:grid-cols-3">
            {meals.map((meal, index) => (
              <MealCard key={meal.id} meal={meal} index={index} />
            ))}
          </div>
        </section>

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
              {["Vegetables & fruit", "Protein", "Whole grains", "Calcium foods"].map((item) => (
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

        <section aria-labelledby="routine-heading">
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
