import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import { symptomSeverityLabel } from "../utils/symptomLabels"

export default function Insights() {
  const stored = localStorage.getItem("user")
  const user = stored ? JSON.parse(stored) : null
  const userId = user?.UserID

  const [risk, setRisk] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [symptom, setSymptom] = useState(null)
  const [cycle, setCycle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [
          riskRes,
          recommendationRes,
          symptomRes,
          cycleRes,
        ] = await Promise.all([
          api.get(`/risk/${userId}`),
          api.get(`/recommendation/${userId}`),
          api.get(`/symptoms/${userId}`),
          api.get(`/cycles/${userId}`),
        ])

        const risks = riskRes.data
        const recommendations = recommendationRes.data
        const symptoms = symptomRes.data
        const cycles = cycleRes.data

        setRisk(
          risks.length
            ? risks[risks.length - 1]
            : null
        )

        setRecommendation(
          recommendations.length
            ? recommendations[recommendations.length - 1]
            : null
        )

        setSymptom(
          symptoms.length
            ? symptoms[symptoms.length - 1]
            : null
        )

        setCycle(
          cycles.length
            ? cycles[cycles.length - 1]
            : null
        )
      } catch (error) {
        console.error("Failed to load insights:", error)
      } finally {
        setLoading(false)
      }
    }

    const loadInitialInsights = async () => {
      await Promise.resolve()
      if (!userId) {
        setLoading(false)
        return
      }
      await loadInsights()
    }

    void loadInitialInsights()
  }, [userId])

  const riskText = loading
    ? "Loading your latest assessment..."
    : risk
    ? risk.MenopauseStage
      ? `Your latest assessment predicts ${risk.MenopauseStage}. Model confidence: ${Math.round(
          (risk.RiskScore || 0) * 100
        )}%.`
      : `Your latest assessment recorded a ${risk.RiskLevel} stage-derived category. This dataset-based result is not a clinical risk estimate.`
    : "No assessment has been recorded yet."

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">

      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-10">

        {/* PAGE HEADER */}
        <section>
          <h2
            className="text-[36px] font-bold text-plum-deep"
            style={{ fontFamily: "Playfair Display" }}
          >
            Your Health Insights
          </h2>

          <p className="text-on-surface-variant mt-2">
            Insights based on your recorded health data
          </p>
        </section>

        {/* ASSESSMENT INSIGHT */}
        <div className="bg-gradient-to-br from-primary via-primary to-[#3D174B] text-white rounded-3xl p-8 relative overflow-hidden soft-shadow">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-tertiary/25 rounded-full blur-2xl" />
          <div className="absolute right-24 -bottom-28 w-56 h-56 bg-secondary/25 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#FFB3D1]">
                auto_awesome
              </span>

              <span className="text-xs tracking-widest uppercase font-bold text-[#E8D5F0]">
                Personalized Insight
              </span>
            </div>

            <h3
              className="text-2xl italic mb-4"
              style={{ fontFamily: "Playfair Display" }}
            >
              Latest Assessment
            </h3>

            <p className="text-white/90 leading-relaxed mb-6">
              {riskText}
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                {risk?.MenopauseStage
                  ? `Stage: ${risk.MenopauseStage}`
                  : risk?.RiskLevel
                  ? `Risk category: ${risk.RiskLevel}`
                  : "Risk category: No result"}
              </span>

              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                {risk
                  ? `Model confidence: ${Math.round(
                      (risk.RiskScore || 0) * 100
                    )}%`
                  : "Confidence: —"}
              </span>
            </div>
            <p className="mt-5 max-w-3xl text-xs leading-relaxed text-white/75">
              For new assessments, Low/Moderate/High are mapped from the dataset’s menopause-stage labels; they are not medically defined risk levels.
            </p>
          </div>
        </div>

        {/* RECENT DATA */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* SYMPTOMS */}
          <div className="bg-white rounded-2xl p-6 soft-shadow border border-outline-variant/60">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">
                monitor_heart
              </span>

              Recent Symptoms
            </h4>

            {symptom ? (
              <>
                <p className="text-sm text-on-surface-variant mt-3">
                  Latest symptom log from {symptom.LogDate}.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">

                  <div>
                    <p className="text-xs text-gray-500">
                      Hot Flashes
                    </p>
                    <p className="font-bold">
                      {symptomSeverityLabel(symptom.HotFlashes)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Mood
                    </p>
                    <p className="font-bold capitalize">
                      {symptom.Mood}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Sleep Quality
                    </p>
                    <p className="font-bold capitalize">
                      {symptom.SleepQuality}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Fatigue
                    </p>
                    <p className="font-bold">
                      {symptomSeverityLabel(symptom.Fatigue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Headache
                    </p>
                    <p className="font-bold">
                      {symptomSeverityLabel(symptom.Headache)}
                    </p>
                  </div>

                </div>
              </>
            ) : (
              <p className="text-sm text-on-surface-variant mt-3">
                No symptom data has been recorded yet.
              </p>
            )}
          </div>

          {/* CYCLE */}
          <div className="bg-white rounded-2xl p-6 soft-shadow border border-outline-variant/60">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">
                calendar_month
              </span>

              Cycle Tracking
            </h4>

            {cycle ? (
              <>
                <p className="text-sm text-on-surface-variant mt-3">
                  Your latest recorded cycle.
                </p>

                <div className="mt-6 space-y-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Start Date
                    </p>
                    <p className="font-bold">
                      {cycle.StartDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Cycle Length
                    </p>
                    <p className="font-bold">
                      {cycle.CycleLength} days
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Notes
                    </p>
                    <p className="font-bold">
                      {cycle.Notes || "No notes recorded"}
                    </p>
                  </div>

                </div>
              </>
            ) : (
              <p className="text-sm text-on-surface-variant mt-3">
                No cycle data has been recorded yet.
              </p>
            )}
          </div>

        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl p-8 soft-shadow border border-outline-variant/60">

          <h4 className="font-semibold mb-6">
            Personalized Recommendations
          </h4>

          {recommendation ? (
            <div className="space-y-4">

              <div className="flex gap-4 p-4 bg-surface-container rounded-xl">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm shrink-0">
                  1
                </span>

                <p className="text-sm">
                  <strong>Diet:</strong>{" "}
                  {recommendation.DietPlan}
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-surface-container rounded-xl">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm shrink-0">
                  2
                </span>

                <p className="text-sm">
                  <strong>Exercise:</strong>{" "}
                  {recommendation.ExercisePlan}
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-surface-container rounded-xl">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm shrink-0">
                  3
                </span>

                <p className="text-sm">
                  <strong>Yoga:</strong>{" "}
                  {recommendation.YogaPlan}
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-surface-container rounded-xl">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm shrink-0">
                  4
                </span>

                <p className="text-sm">
                  <strong>Lifestyle:</strong>{" "}
                  {recommendation.LifestyleTips}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Complete an assessment to receive personalized
              recommendations.
            </p>
          )}

        </div>

        {/* WEARABLE DATA */}
        <div className="bg-white rounded-2xl p-8 soft-shadow border border-outline-variant/60">

          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">
              watch
            </span>

            Wearable Data
          </h4>

          <p className="text-sm text-on-surface-variant">
            No wearable device data is currently connected to
            MenoVerse. Heart rate, sleep duration, temperature,
            and activity insights will appear here when real
            device data becomes available.
          </p>

        </div>

        {/* BACK TO DASHBOARD */}
        <div className="flex justify-center pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-tertiary hover:underline"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>

            Back to Dashboard
          </Link>
        </div>

      </main>
    </div>
  )
}