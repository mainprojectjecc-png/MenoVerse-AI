import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import {
  XAIDisclaimer,
  XAIContributionChart,
  XAIExplanation,
  XAIFactorList,
  XAIInsight,
  XAIRiskSummary,
  XAITakeaway,
} from "../components/XAIComponents"

const inputLabels = {
  Age_Group: "Age group",
  Weight_kg: "Weight",
  Menstrual_Cycle_Regular: "Menstrual cycle regularity",
  Avg_Menstrual_Cycle_Length: "Average cycle length",
  Hot_Flashes: "Hot flashes",
  Night_Sweats: "Night sweats",
  Sleep_Disturbances: "Sleep disturbances",
  Fatigue: "Fatigue",
  Anxiety: "Anxiety",
  Headaches: "Headaches",
  Heart_Palpitations: "Heart palpitations",
  Exercise_Yoga_Frequency: "Exercise or yoga",
  Avg_Sleep_Duration: "Average sleep duration",
  Stress_Level: "Stress level",
  Diagnosed_Conditions: "Diagnosed conditions",
  Family_History_Early_Menopause: "Family history of early menopause",
}

function formatInputValue(key, value) {
  if (key === "Weight_kg") return `${value} kg`
  if (key === "Stress_Level") return `${value} out of 5`
  return String(value)
}

function buildPersonalizedInsight(
  higherInfluenceFactors,
  lowerInfluenceFactors,
  isStageResult,
) {
  const strongestHigher = higherInfluenceFactors[0]
  const strongestLower = lowerInfluenceFactors[0]

  if (strongestHigher && strongestLower) {
    return isStageResult
      ? `${strongestHigher.feature} had the strongest influence toward a later stage. ${strongestLower.feature} influenced the model toward an earlier stage.`
      : `${strongestHigher.feature} had the strongest influence, moving the AI risk estimate higher. ${strongestLower.feature} influenced it in the opposite direction.`
  }
  if (strongestHigher) {
    return isStageResult
      ? `${strongestHigher.feature} had the strongest influence toward a later stage. This describes how the model responded to your answer, not cause and effect.`
      : `${strongestHigher.feature} had the strongest influence, moving the AI risk estimate higher. This describes how the model responded to your answer, not cause and effect.`
  }
  if (strongestLower) {
    return isStageResult
      ? `${strongestLower.feature} had the strongest influence toward an earlier stage. This describes how the model responded to your answer, not cause and effect.`
      : `${strongestLower.feature} had the strongest influence, moving the AI risk estimate lower. This describes how the model responded to your answer, not cause and effect.`
  }
  return "No single answer stood out as strongly influencing the AI result in this comparison."
}

function EmptyState() {
  return (
    <section className="rounded-2xl bg-white p-8 text-center shadow-sm border border-outline-variant/30">
      <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">
        fact_check
      </span>
      <h2 className="mt-3 font-headline-md text-headline-md text-plum-deep">
        Your explanation will appear here
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-on-surface-variant">
        Complete an assessment to see your personalized AI explanation.
      </p>
      <Link
        to="/assessment"
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-[#535845] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Start an assessment
        <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
          arrow_forward
        </span>
      </Link>
    </section>
  )
}

function LoadingState() {
  return (
    <div className="space-y-5" role="status" aria-live="polite">
      <span className="sr-only">Loading your personalized AI explanation</span>
      <div className="h-52 animate-pulse rounded-2xl bg-white/70" />
      <div className="h-72 animate-pulse rounded-2xl bg-white/70" />
    </div>
  )
}

export default function XAI() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const userId = user?.UserID
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState(
    userId ? "" : "Your account details could not be loaded. Please sign in again.",
  )
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    const loadExplanation = async () => {
      setLoading(true)
      setError("")
      setExplanation(null)

      try {
        const response = await api.get(`/xai/${userId}`)
        if (active) setExplanation(response.data)
      } catch (requestError) {
        if (!active) return
        const detail = requestError.response?.data?.detail
        const isMissingAssessment =
          requestError.response?.status === 404 &&
          detail?.startsWith("Complete an assessment")
        if (!isMissingAssessment) {
          setError(
            detail ||
              "We couldn’t load your AI explanation. Please try again.",
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    if (userId) loadExplanation()

    return () => {
      active = false
    }
  }, [retryCount, userId])

  const factors = Array.isArray(explanation?.Factors)
    ? explanation.Factors.filter(
        (factor) =>
          factor &&
          typeof factor.key === "string" &&
          typeof factor.feature === "string" &&
          Number.isFinite(Number(factor.contribution)),
      )
    : []
  const isStageResult =
    typeof explanation?.MenopauseStage === "string" ||
    ["Early", "Perimenopause", "Postmenopause"].includes(explanation?.RiskLevel)
  const higherInfluenceFactors = factors
    .filter((factor) =>
      isStageResult
        ? factor.direction === "moves_to_later_stage"
        : factor.direction === "increases_risk",
    )
    .slice(0, 5)
  const lowerInfluenceFactors = factors
    .filter((factor) =>
      isStageResult
        ? factor.direction === "moves_to_earlier_stage"
        : factor.direction === "decreases_risk",
    )
    .slice(0, 5)
  const inputs =
    explanation?.Inputs &&
    typeof explanation.Inputs === "object" &&
    !Array.isArray(explanation.Inputs)
      ? explanation.Inputs
      : null
  const displayedInputs = inputs
    ? Object.entries(inputs).filter(([key]) => inputLabels[key])
    : []
  const hasRiskLevel = typeof explanation?.RiskLevel === "string"
  const personalizedInsight = buildPersonalizedInsight(
    higherInfluenceFactors,
    lowerInfluenceFactors,
    isStageResult,
  )

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface md:pb-0">
      <main className="mx-auto max-w-[1000px] space-y-7 px-margin-mobile py-8 md:px-margin-desktop md:py-10">
        <header className="space-y-3">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-plum-deep md:font-headline-lg md:text-headline-lg">
            AI Explanation
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
            See how your assessment answers influenced your AI result.
          </p>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <section
            className="rounded-2xl border border-risk-high/30 bg-white p-6 shadow-sm"
            role="alert"
          >
            <h2 className="font-headline-md text-headline-md text-plum-deep">
              We couldn’t load your AI explanation right now.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-[#535845] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Try again
            </button>
          </section>
        ) : !explanation ? (
          <EmptyState />
        ) : !hasRiskLevel ? (
          <section
            className="rounded-2xl border border-risk-high/30 bg-white p-6 shadow-sm"
            role="alert"
          >
            <h2 className="font-headline-md text-headline-md text-plum-deep">
              Some result details are unavailable
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              We couldn’t find a complete AI result to explain. Please try again.
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-[#535845] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Try again
            </button>
          </section>
        ) : (
          <>
            <div className="grid gap-5">
              <XAIRiskSummary
                riskLevel={explanation.RiskLevel}
              />
            </div>

            <section
              className="rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6"
              aria-labelledby="xai-why-heading"
            >
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined rounded-xl bg-surface-container p-3 text-primary"
                  aria-hidden="true"
                >
                  lightbulb
                </span>
                <div>
                  <h2
                    id="xai-why-heading"
                    className="font-headline-md text-headline-md text-plum-deep"
                  >
                    Why did I get this result?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    Your result is based on patterns found in the answers you
                    provided. The AI considers your assessment responses
                    together and identifies the pattern that most closely
                    matches what it learned from previous assessment data.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                    The explanation below shows which of your answers had the
                    strongest influence on the model’s result.
                  </p>
                </div>
              </div>
              <ol
                className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
                aria-label="How the AI explanation is generated"
              >
                {[
                  "Your assessment answers",
                  "Random Forest AI model",
                  "Compare responses to other observed answers",
                  "Identify strongest influences",
                  "Personalized explanation",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex min-w-0 items-center gap-2 rounded-xl bg-surface-container-low p-3 text-xs leading-relaxed text-on-surface-variant"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6">
              <div className="mb-5">
                <h2 className="font-headline-md text-headline-md text-plum-deep">
                  What influenced your result?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  These are the answers that had the biggest influence on your AI result.
                </p>
              </div>
              <XAIContributionChart factors={factors} />
            </section>

            <section aria-label="Detailed influences" className="space-y-3">
              <XAIFactorList
                title={isStageResult
                  ? "Influenced the result toward a later stage"
                  : "Influenced the result toward higher risk"}
                factors={higherInfluenceFactors}
                emptyText={isStageResult
                  ? "No answers stood out as shifting the result toward a later stage."
                  : "No answers stood out as moving the AI risk estimate higher."}
              />
              <XAIFactorList
                title={isStageResult
                  ? "Influenced the result toward an earlier stage"
                  : "Influenced the result toward lower risk"}
                factors={lowerInfluenceFactors}
                emptyText={isStageResult
                  ? "No answers stood out as shifting the result toward an earlier stage."
                  : "No answers stood out as moving the AI risk estimate lower."}
              />
            </section>

            <XAIInsight text={personalizedInsight} />

            {displayedInputs.length > 0 && (
              <details className="group rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  <span>
                    <span className="block">See all your answers</span>
                    <span className="mt-1 block text-sm font-normal text-on-surface-variant">
                      Review the answers used by the AI to generate your result.
                    </span>
                  </span>
                  <span className="material-symbols-outlined shrink-0 text-on-surface-variant transition-transform group-open:rotate-180" aria-hidden="true">
                    expand_more
                  </span>
                </summary>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {displayedInputs.map(([key, value]) => (
                    <div key={key} className="rounded-xl bg-surface-container-low p-4">
                      <dt className="text-xs text-on-surface-variant">{inputLabels[key]}</dt>
                      <dd className="mt-1 font-semibold text-on-surface">
                        {value === undefined || value === null || value === ""
                          ? "Not available"
                          : formatInputValue(key, value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            <XAIExplanation method={explanation.ExplanationMethod} />
            <XAITakeaway />
            <XAIDisclaimer />

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to="/diet"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-[#535845] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Explore personalized support
                <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/insights"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 text-center font-semibold text-on-surface transition-colors hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
                  history
                </span>
                View health insights
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
