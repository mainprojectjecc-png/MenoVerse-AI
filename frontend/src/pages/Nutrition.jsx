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