import { useState } from "react"

const journalEntries = [
  {
    id: 1,
    date: "Today, 9:30 AM",
    title: "Morning Reflection",
    mood: {
      label: "Anxious",
      icon: "sentiment_dissatisfied",
      tone: "mist",
    },
    symptom: {
      label: "Hot Flash",
      icon: "thermostat",
      tone: "risk-high",
    },
    note:
      "Woke up feeling a bit overwhelmed. Had a night sweat around 3 AM that disrupted my sleep...",
  },
  {
    id: 2,
    date: "Yesterday, 8:45 PM",
    title: "Evening Wind-down",
    mood: {
      label: "Balanced",
      icon: "sentiment_satisfied",
      tone: "risk-low",
    },
    symptom: {
      label: "Yoga",
      icon: "spa",
      tone: "mist",
    },
    note: null,
  },
]

function Tag({ icon, label, tone }) {
  const toneClasses =
    tone === "risk-high"
      ? "bg-risk-high/10 text-risk-high"
      : tone === "risk-low"
      ? "bg-risk-low/10 text-risk-low"
      : "bg-lavender-mist text-primary"

  return (
    <span
      className={`
        px-3.5
        py-1.5
        rounded-full
        text-[12px]
        font-bold
        flex
        items-center
        gap-1.5
        ${toneClasses}
      `}
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{
          fontVariationSettings: "'FILL' 1",
        }}
      >
        {icon}
      </span>

      {label}
    </span>
  )
}

export default function VoiceJournal() {
  const [isRecording, setIsRecording] = useState(false)
  const [showAllEntries, setShowAllEntries] = useState(false)

  const handleToggleRecord = () => {
    setIsRecording((prev) => !prev)
  }

  const visibleEntries = showAllEntries ? journalEntries : journalEntries.slice(0, 2)
  const hasMoreEntries = journalEntries.length > 2

  return (
    <div className="min-h-screen bg-[#FAF7F0]">

      <main className="max-w-[1000px] mx-auto px-6 lg:px-8 py-8">

        {/* =================================================
            HERO
        ================================================== */}
        <section className="flex flex-col items-center text-center py-8">

          <div className="space-y-3">

            <h1
              className="
                text-[30px]
                md:text-[34px]
                text-[#3F3D35]
                leading-tight
              "
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              How are you feeling today?
            </h1>

            <p className="text-[#6B695E] italic">
              "Your voice helps us understand you better."
            </p>

          </div>


          {/* =================================================
              RECORDER
          ================================================== */}
          <div className="relative w-64 h-64 flex items-center justify-center mt-8">

            <div
              className={`
                absolute
                inset-0
                bg-[#DDBEA9]/40
                rounded-full

                ${isRecording ? "animate-ping" : ""}
              `}
            />

            <div
              className={`
                absolute
                inset-0
                bg-[#DDBEA9]/30
                rounded-full
                scale-75

                ${isRecording ? "animate-pulse" : ""}
              `}
            />

            <button
              onClick={handleToggleRecord}
              className={`
                relative
                z-10
                w-24
                h-24
                rounded-full
                flex
                items-center
                justify-center
                text-white
                shadow-lg
                transition-all
                active:scale-95

                ${
                  isRecording
                    ? "bg-[#BC6C4D]"
                    : "bg-[#6B705C]"
                }
              `}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {isRecording ? "stop" : "mic"}
              </span>
            </button>

          </div>


          <span
            className={`
              mt-3
              text-sm
              font-bold
              uppercase
              tracking-[0.1em]

              ${
                isRecording
                  ? "text-risk-high animate-pulse"
                  : "text-primary"
              }
            `}
          >
            {isRecording
              ? "Listening..."
              : "Ready to listen"}
          </span>

        </section>


        {/* =================================================
            RECENT JOURNALS
        ================================================== */}
        <section className="mt-8 space-y-6">

          <div className="flex justify-between items-baseline">

            <h2
              className="text-xl text-[#3F3D35] italic"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              Recent Journals
            </h2>

            {hasMoreEntries ? (
              <button
                type="button"
                onClick={() => setShowAllEntries((current) => !current)}
                className="text-sm text-primary font-semibold hover:underline"
              >
                {showAllEntries ? "Show Less" : "View All"}
              </button>
            ) : (
              <span className="text-sm text-on-surface-variant font-medium">
                All entries shown
              </span>
            )}

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {visibleEntries.map((entry) => (

              <div
                key={entry.id}
                className="
                  bg-[#FAF7F0]
                  p-6
                  rounded-2xl
                  shadow-sm
                  border
                  border-outline-variant/30
                  hover:shadow-md
                  transition
                  cursor-pointer
                "
              >

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                      {entry.date}
                    </p>

                    <p
                      className="text-lg text-plum-deep mt-1"
                      style={{
                        fontFamily: "Playfair Display",
                      }}
                    >
                      {entry.title}
                    </p>

                  </div>

                  <span
                    className="material-symbols-outlined text-tertiary text-[30px]"
                    style={{
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    play_circle
                  </span>

                </div>


                <div className="flex flex-wrap gap-2">

                  <Tag
                    icon={entry.mood.icon}
                    label={`Mood: ${entry.mood.label}`}
                    tone={entry.mood.tone}
                  />

                  {entry.symptom && (
                    <Tag
                      icon={entry.symptom.icon}
                      label={entry.symptom.label}
                      tone={entry.symptom.tone}
                    />
                  )}

                </div>


                {entry.note && (
                  <p className="mt-4 text-sm text-on-surface-variant italic leading-relaxed">
                    "{entry.note}"
                  </p>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            AI INSIGHT
        ================================================== */}
        <section className="mt-10 mb-8">

          <div className="bg-primary text-white p-7 rounded-2xl shadow-sm">

            <div className="flex gap-5 items-start">

              <div className="bg-white/20 p-2.5 rounded-xl">
                <span className="material-symbols-outlined">
                  auto_awesome
                </span>
              </div>

              <div>

                <h4 className="text-xs text-secondary-container uppercase tracking-[0.05em] font-bold">
                  Wellness Reminder
                </h4>

                <p className="text-sm text-lavender-mist mt-2 leading-relaxed italic">
                  Journaling regularly can help you notice patterns in how you feel and support reflection over time.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}