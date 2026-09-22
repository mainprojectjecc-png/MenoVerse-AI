import { useEffect, useState } from "react"
import api from "../api/axios"

const moodDetails = {
  Anxious: { icon: "sentiment_dissatisfied", tone: "mist" },
  Low: { icon: "sentiment_dissatisfied", tone: "risk-high" },
  Balanced: { icon: "sentiment_satisfied", tone: "risk-low" },
  Neutral: { icon: "sentiment_neutral", tone: "mist" },
}

const symptomIcons = {
  "Hot Flash": "thermostat",
  "Night Sweat": "water_drop",
  Headache: "headphones",
  Insomnia: "bedtime",
  Fatigue: "battery_1_bar",
  "Mood Changes": "mood_bad",
}

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
  const [recognition, setRecognition] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [entries, setEntries] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [showAllEntries, setShowAllEntries] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    if (!user?.UserID) return

    api.get(`/voicejournal/${user.UserID}`)
      .then(({ data }) => setEntries(data))
      .catch(() => setError("Unable to load your journal entries."))
  }, [])

  const handleToggleRecord = () => {
    if (isRecording) {
      recognition?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome.")
      return
    }

    setError("")
    const speech = new SpeechRecognition()
    speech.continuous = true
    speech.interimResults = false
    speech.lang = "en-US"
    speech.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
      setTranscript((current) => `${current} ${text}`.trim())
    }
    speech.onerror = () => {
      setError("We could not access the microphone. Check your browser permission.")
      setIsRecording(false)
    }
    speech.onend = () => setIsRecording(false)
    speech.start()
    setRecognition(speech)
    setIsRecording(true)
  }

  const handleSave = async () => {
    if (!transcript.trim()) {
      setError("Record a journal entry before saving.")
      return
    }

    setIsSaving(true)
    setError("")
    try {
      const analysis = await api.post("/voicejournal/analyze", { text: transcript })
      const user = JSON.parse(localStorage.getItem("user") || "null")
      const { data: savedEntry } = await api.post("/voicejournal", {
        UserID: user.UserID,
        EntryDate: new Date().toISOString().slice(0, 10),
        Content: transcript.trim(),
        AudioURL: null,
      })
      setEntries((current) => [{ ...savedEntry, analysis: analysis.data }, ...current])
      setTranscript("")
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save your journal entry.")
    } finally {
      setIsSaving(false)
    }
  }

  const visibleEntries = showAllEntries ? entries : entries.slice(0, 2)
  const hasMoreEntries = entries.length > 2

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

          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Your transcript will appear here..."
            className="mt-6 w-full max-w-xl min-h-28 rounded-xl border border-outline-variant/40 bg-white/60 p-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />

          {error && (
            <p className="mt-3 max-w-xl text-sm text-risk-high">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !transcript.trim()}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Analyzing..." : "Save Journal"}
          </button>

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

            {visibleEntries.map((entry) => {
              const storedSymptoms = entry.Symptoms
                ? JSON.parse(entry.Symptoms)
                : []
              const analysis = entry.analysis || {
                mood: entry.Mood || "Neutral",
                symptoms: storedSymptoms,
              }
              const mood = moodDetails[analysis.mood] || moodDetails.Neutral

              return (

              <div
                key={entry.JournalID}
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
                      {new Date(entry.EntryDate).toLocaleDateString()}
                    </p>

                    <p
                      className="text-lg text-plum-deep mt-1"
                      style={{
                        fontFamily: "Playfair Display",
                      }}
                    >
                      Voice Reflection
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
                    icon={mood.icon}
                    label={`Mood: ${analysis.mood}`}
                    tone={mood.tone}
                  />

                  {analysis.symptoms.map((symptom) => (
                    <Tag
                      key={symptom}
                      icon={symptomIcons[symptom] || "medical_services"}
                      label={symptom}
                      tone="risk-high"
                    />
                  ))}

                </div>


                {entry.Content && (
                  <p className="mt-4 text-sm text-on-surface-variant italic leading-relaxed">
                    "{entry.Content}"
                  </p>
                )}

              </div>

              )
            })}

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