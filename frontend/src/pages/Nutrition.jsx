const keyNutrients = [
  {
    icon: "medical_services",
    tone: "tertiary",
    title: "Magnesium",
    desc: "Reduces anxiety & helps sleep quality.",
  },
  {
    icon: "water_drop",
    tone: "risk-low",
    title: "Phytoestrogens",
    desc: "Soy & flaxseeds for estrogen mimicry.",
  },
  {
    icon: "energy_savings_leaf",
    tone: "tertiary",
    title: "Healthy Fats",
    desc: "Omega-3s for brain fog & mood.",
  },
  {
    icon: "vital_signs",
    tone: "primary",
    title: "Fiber",
    desc: "Supports digestion & toxin removal.",
  },
]

const meals = [
  {
    tag: "Breakfast",
    time: "8:30 AM",
    title: "Berry & Flax Bowl",
    note: "Rich in Phytoestrogens & Fiber",
    tagTone: "mist",
  },
  {
    tag: "Lunch",
    time: "1:00 PM",
    title: "Salmon & Edamame Salad",
    note: "Omega-3s for mood stability",
    tagTone: "sage",
  },
  {
    tag: "Snack",
    time: "4:00 PM",
    title: "Dark Choc & Almonds",
    note: "Magnesium boost for sleep",
    tagTone: "mist",
  },
  {
    tag: "Dinner",
    time: "7:30 PM",
    title: "Lentil & Sweet Potato Stew",
    note: "B-vitamins for sustained energy",
    tagTone: "sage",
  },
]

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

function MealCard({ tag, time, title, note, tagTone }) {
  const tagClass =
    tagTone === "sage"
      ? "bg-secondary-container text-primary"
      : "bg-lavender-mist text-primary"

  return (
    <div className="bg-surface rounded-2xl overflow-hidden soft-shadow border border-outline-variant/30 transition-all active:scale-[0.98] cursor-pointer p-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${tagClass}`}
        >
          {tag}
        </span>

        <span className="text-xs text-on-surface-variant">
          {time}
        </span>
      </div>

      <h4 className="font-headline text-lg text-plum-deep">
        {title}
      </h4>

      <p className="text-xs text-on-surface-variant line-clamp-1">
        {note}
      </p>
    </div>
  )
}

export default function Nutrition() {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">

      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-8">

        {/* HERO */}
        <section className="mb-8">
          <h2 className="font-headline text-3xl text-plum-deep mb-3">
            Nourish Your Body
          </h2>

          <p className="text-on-surface-variant md:max-w-xl">
            Personalized nutrition to support your hormonal balance
            and ease perimenopause symptoms.
          </p>
        </section>

        {/* KEY NUTRIENTS */}
        <section className="mb-10">
          <h3 className="text-sm text-primary mb-4 uppercase tracking-[0.1em] font-bold">
            Hormonal Support Essentials
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyNutrients.map((nutrient) => (
              <NutrientCard
                key={nutrient.title}
                {...nutrient}
              />
            ))}
          </div>
        </section>

        {/* DAILY MEAL PLAN */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-primary uppercase tracking-[0.1em] font-bold">
              Today's Meal Plan
            </h3>

            <button
              type="button"
              className="text-primary text-sm hover:underline"
            >
              Change Plan
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <MealCard
                key={meal.title}
                {...meal}
              />
            ))}
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
              "Sipping warm lemon water 15 minutes before your lunch
              can help prime your digestion for better nutrient
              absorption."
            </p>
          </div>

          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary rounded-full opacity-10" />
        </section>

      </main>
    </div>
  )
}