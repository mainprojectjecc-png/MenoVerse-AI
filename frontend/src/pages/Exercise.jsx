import { useState } from "react"

const categories = [
  "All Practices",
  "Restorative Yoga",
  "Strength Training",
  "Gentle Cardio",
]

const exercises = [
  {
    title: "Pelvic Floor Stability",
    desc: "Strengthen core & support.",
    time: "20m",
    level: "Beginner",
    tone: "risk-low",
  },
  {
    title: "Bone Density Boost",
    desc: "Light resistance training.",
    time: "35m",
    level: "Intermediate",
    tone: "risk-moderate",
  },
  {
    title: "Deep Sleep Flow",
    desc: "Yin yoga to quiet the mind.",
    time: "12m",
    level: "Gentle",
    tone: "risk-low",
  },
  {
    title: "Heart-Health Walk",
    desc: "Low-impact brisk movement.",
    time: "45m",
    level: "Beginner",
    tone: "risk-low",
  },
]

function ExerciseCard({
  title,
  desc,
  time,
  level,
  tone,
}) {
  const toneClass =
    tone === "risk-moderate"
      ? "text-risk-moderate"
      : "text-risk-low"

  return (
    <div
      className="
        bg-surface
        rounded-2xl
        p-4
        flex
        gap-4
        border
        border-outline-variant/20
        hover:shadow-md
        transition
        cursor-pointer
      "
    >

      <div
        className="
          w-24
          h-24
          rounded-xl
          bg-secondary-container/40
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <span className="material-symbols-outlined text-primary text-3xl">
          self_improvement
        </span>
      </div>

      <div className="flex flex-col justify-between py-1 min-w-0">

        <div>

          <h3
            className="text-lg text-plum-deep leading-tight"
            style={{
              fontFamily: "Playfair Display",
            }}
          >
            {title}
          </h3>

          <p className="text-xs text-on-surface-variant mt-1">
            {desc}
          </p>

        </div>

        <div className="flex items-center gap-4">

          <span className="flex items-center gap-1 text-xs text-primary">
            <span className="material-symbols-outlined text-[14px]">
              timer
            </span>
            {time}
          </span>

          <span
            className={`flex items-center gap-1 text-xs ${toneClass}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            {level}
          </span>

        </div>

      </div>

    </div>
  )
}

export default function Exercise() {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]
  )

  return (
    <div className="min-h-screen bg-[#F0EAD6]">

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="space-y-3 mb-10">

          <h1
            className="
              text-[32px]
              md:text-[40px]
              leading-tight
              text-plum-deep
            "
            style={{
              fontFamily: "Playfair Display",
            }}
          >
            Movement for Harmony
          </h1>

          <p className="text-on-surface-variant max-w-2xl">
            Embrace your rhythm with gentle, hormone-balancing
            exercises designed for every stage of your journey.
          </p>

        </section>


        {/* =================================================
            FEATURED ROUTINE
        ================================================== */}
        <section className="mb-8">

          <div
            className="
              w-full
              min-h-[230px]
              rounded-2xl
              overflow-hidden
              relative
              shadow-sm
              bg-primary
              flex
              items-end
              p-7
            "
          >

            <div>

              <div className="flex items-center gap-3 mb-3">

                <span className="px-3 py-1 rounded-lg bg-white/90 text-primary text-xs uppercase tracking-wider">
                  Daily Routine
                </span>

                <span className="flex items-center gap-1 text-xs text-white/80">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  15 min
                </span>

              </div>

              <h2
                className="text-2xl text-white"
                style={{
                  fontFamily: "Playfair Display",
                }}
              >
                Morning Joint Mobility
              </h2>

              <p className="text-sm text-white/80 mt-1">
                Waking up the body with gentle spinal rotations.
              </p>

            </div>

            <button
              className="
                absolute
                right-6
                bottom-6
                w-12
                h-12
                rounded-xl
                bg-white
                text-primary
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-105
                transition
              "
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                play_arrow
              </span>
            </button>

          </div>

        </section>


        {/* =================================================
            CATEGORIES
        ================================================== */}
        <section className="mb-10 overflow-x-auto">
          <div className="flex gap-3 min-w-max">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  px-5
                  py-3
                  rounded-xl
                  text-sm
                  font-semibold
                  transition

                  ${
                    activeCategory === category
                      ? "bg-primary text-white"
                      : "bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-high"
                  }
                `}
              >
                {category}
              </button>

            ))}

          </div>
        </section>


        {/* =================================================
            EXERCISE LIBRARY
        ================================================== */}
        <section className="space-y-6">

          <div className="flex items-center justify-between">

            <h2
              className="text-xl text-on-surface"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              Recommended for You
            </h2>

            <button className="text-sm text-primary flex items-center gap-1">
              View all
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.title}
                {...exercise}
              />
            ))}

          </div>

        </section>


        {/* =================================================
            INSIGHT
        ================================================== */}
        <section className="mt-10">

          <div className="bg-lavender-mist/40 rounded-2xl p-6 border border-lavender-mist flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-primary shadow-sm shrink-0">
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                insights
              </span>
            </div>

            <div>

              <h3
                className="text-base text-plum-deep"
                style={{
                  fontFamily: "Playfair Display",
                }}
              >
                Movement Insight
              </h3>

              <p className="text-sm text-on-surface-variant">
                Exercising today can help reduce night sweats by
                up to 30%.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}