import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const questions = [
  { key: "Age_Group", label: "Age group", options: ["35-45", "46-55", "Over 55"] },
  { key: "Menstrual_Cycle_Regular", label: "Are your menstrual cycles regular?", options: ["Yes", "No", "Completely over"] },
  { key: "Avg_Menstrual_Cycle_Length", label: "Average cycle length", options: ["Less than 21 days", "21–28 days", "More than 35 days", "Not regular"] },
  { key: "Hot_Flashes", label: "Hot flashes", options: ["Mild", "Moderate", "Severe"] },
  { key: "Night_Sweats", label: "Night sweats", options: ["Mild", "Moderate", "Severe"] },
  { key: "Sleep_Disturbances", label: "Sleep disturbances", options: ["Mild", "Moderate", "Severe"] },
  { key: "Fatigue", label: "Fatigue", options: ["Mild", "Moderate", "Severe"] },
  { key: "Anxiety", label: "Anxiety", options: ["Mild", "Moderate", "Severe"] },
  { key: "Headaches", label: "Headaches", options: ["Mild", "Moderate", "Severe"] },
  { key: "Heart_Palpitations", label: "Heart palpitations", options: ["Mild", "Moderate", "Severe"] },
  { key: "Exercise_Yoga_Frequency", label: "Exercise or yoga frequency", options: ["Never", "1-2 days", "Weekly", "Daily"] },
  { key: "Avg_Sleep_Duration", label: "Average sleep duration", options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"] },
  { key: "Diagnosed_Conditions", label: "Diagnosed conditions", options: ["None of the Above", "PCOS", "Diabetes", "Hypertension"] },
  { key: "Family_History_Early_Menopause", label: "Family history of early menopause?", options: ["No", "Yes"] },
]

const initialForm = {
  Age_Group: "35-45",
  Weight_kg: "",
  Menstrual_Cycle_Regular: "Yes",
  Avg_Menstrual_Cycle_Length: "21–28 days",
  Hot_Flashes: "Mild",
  Night_Sweats: "Mild",
  Sleep_Disturbances: "Mild",
  Fatigue: "Mild",
  Anxiety: "Mild",
  Headaches: "Mild",
  Heart_Palpitations: "Mild",
  Exercise_Yoga_Frequency: "Never",
  Avg_Sleep_Duration: "7-8 hours",
  Stress_Level: 3,
  Diagnosed_Conditions: "None of the Above",
  Family_History_Early_Menopause: "No",
}

export default function Assessment() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submitAssessment = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)

    if (!form.Weight_kg || Number(form.Weight_kg) <= 0) {
      setError("Please enter a valid weight.")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/predict", {
        UserID: user.UserID,
        ...form,
        Weight_kg: Number(form.Weight_kg),
        Stress_Level: Number(form.Stress_Level),
      })
      setResult(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "The assessment could not be completed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <main className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <div className="mb-8">
          <p className="text-label-md text-primary uppercase tracking-[0.1em] font-bold">Personal assessment</p>
          <h1 className="font-headline-xl text-plum-deep mt-2">Understand your current pattern.</h1>
          <p className="text-on-surface-variant mt-3 max-w-2xl">Answer these questions to receive a personalized screening result. This is educational guidance, not a medical diagnosis.</p>
        </div>

        <form onSubmit={submitAssessment} className="bg-surface rounded-2xl p-6 md:p-8 soft-shadow border border-outline-variant/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2 text-label-md font-semibold">
              Weight (kg)
              <input type="number" min="1" max="500" step="0.1" required value={form.Weight_kg} onChange={(event) => updateField("Weight_kg", event.target.value)} className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 68" />
            </label>

            <label className="flex flex-col gap-2 text-label-md font-semibold">
              Stress level: {form.Stress_Level}/5
              <input type="range" min="1" max="5" value={form.Stress_Level} onChange={(event) => updateField("Stress_Level", event.target.value)} className="accent-primary mt-3" />
            </label>

            {questions.map((question) => (
              <label key={question.key} className="flex flex-col gap-2 text-label-md font-semibold">
                {question.label}
                <select value={form[question.key]} onChange={(event) => updateField(question.key, event.target.value)} className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body outline-none focus:ring-2 focus:ring-primary/30">
                  {question.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>

          {error && <p className="mt-6 text-risk-high font-semibold" role="alert">{error}</p>}

          <button type="submit" disabled={loading} className="mt-8 w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-label-md disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? "Analyzing..." : "Get my assessment"}
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </form>

        {result && (
          <section className="mt-8 bg-surface rounded-2xl p-6 md:p-8 soft-shadow border border-outline-variant/20" aria-live="polite">
            <p className="text-label-md text-primary uppercase tracking-[0.1em] font-bold">Your result</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mt-2">
              <h2 className="font-headline-lg text-plum-deep">{result.RiskLevel} risk</h2>
              <p className="text-on-surface-variant">Confidence: {(result.Confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(result.Recommendation || {}).map(([key, value]) => (
                <article key={key} className="bg-surface-container rounded-xl p-5">
                  <h3 className="font-label-md font-bold text-primary">{key.replace("Plan", " plan")}</h3>
                  <p className="mt-2 leading-relaxed text-on-surface-variant">{value}</p>
                </article>
              ))}
            </div>
            <button type="button" onClick={() => navigate("/dashboard")} className="mt-6 text-primary font-label-md font-bold hover:underline">Return to dashboard</button>
          </section>
        )}
      </main>
    </div>
  )
}
