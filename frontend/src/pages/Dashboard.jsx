import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import weeklyInsightsImage from "../../reference/front.png"

const EMPTY_DATA = {
  risks: [],
  recommendations: [],
  cycles: [],
  symptoms: [],
}

function formatDate(value, options = { month: "short", day: "numeric" }) {
  if (!value) return "Not recorded"
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleDateString(undefined, options)
}

function getDaysBetween(start, end = new Date()) {
  const startDate = new Date(`${String(start).slice(0, 10)}T00:00:00`)
  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)
  if (Number.isNaN(startDate.getTime())) return null
  return Math.max(1, Math.floor((endDate - startDate) / 86_400_000) + 1)
}

function getSymptomCount(entry) {
  if (!entry) return 0
  return [
    Number(entry.HotFlashes) > 0,
    Boolean(entry.Mood && entry.Mood.toLowerCase() !== "none"),
    Boolean(entry.SleepQuality && entry.SleepQuality.toLowerCase() !== "none"),
    Number(entry.Fatigue) > 0,
    Number(entry.Headache) > 0,
  ].filter(Boolean).length
}

function shorten(value, maxLength = 118) {
  if (!value) return ""
  const text = String(value).trim()
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text
}

function latestRecord(records, key) {
  return records.reduce(
    (latest, record) => (!latest || record[key] > latest[key] ? record : latest),
    null,
  )
}

function getTrendPoints(records, key) {
  const left = 30
  const top = 10
  const width = 324
  const height = 82

  return records.map((entry, index) => {
    const x = left + (records.length > 1 ? (index / (records.length - 1)) * width : width / 2)
    const severity = Math.min(3, Math.max(0, Number(entry[key]) || 0))
    const y = top + height - (severity / 3) * height
    return `${x},${y}`
  }).join(" ")
}

function SectionHeading({ eyebrow, title, to, linkLabel }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.17em] text-on-surface-variant">
            {eyebrow}
          </p>
        )}
        <h2 className="font-headline-md text-xl font-semibold text-on-surface sm:text-2xl">
          {title}
        </h2>
      </div>
      {to && (
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-tertiary sm:text-sm"
        >
          {linkLabel}
          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </Link>
      )}
    </div>
  )
}

function Icon({ children, tone = "plum" }) {
  const tones = {
    plum: "bg-primary/10 text-primary",
    rose: "bg-tertiary/10 text-tertiary",
    sage: "bg-secondary/10 text-secondary",
    gold: "bg-amber-100 text-amber-700",
  }
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}>
      <span className="material-symbols-outlined text-[20px]">{children}</span>
    </span>
  )
}

function Dashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  }, [])
  const firstName = user?.Name?.trim().split(/\s+/)[0] || "there"
  const userId = user?.UserID
  const [data, setData] = useState(EMPTY_DATA)
  const [communityGroups, setCommunityGroups] = useState([])
  const [communityError, setCommunityError] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })

    let active = true

    async function loadDashboard() {
      setLoading(true)
      setLoadError("")
      setCommunityError("")

      if (!userId) {
        setLoadError("Your account details could not be found. Please sign in again.")
        setLoading(false)
        return
      }

      const results = await Promise.allSettled([
        api.get(`/risk/${userId}`),
        api.get(`/recommendation/${userId}`),
        api.get(`/cycles/${userId}`),
        api.get(`/symptoms/${userId}`),
        api.get("/community/groups"),
      ])

      if (!active) return

      const nextData = { ...EMPTY_DATA }
      const keys = ["risks", "recommendations", "cycles", "symptoms"]
      let failedRequests = 0

      results.slice(0, 4).forEach((result, index) => {
        if (result.status === "fulfilled" && Array.isArray(result.value.data)) {
          nextData[keys[index]] = result.value.data
        } else {
          failedRequests += 1
          if (result.status === "rejected") {
            console.error(`Failed to load dashboard ${keys[index]}:`, result.reason)
          }
        }
      })

      setData(nextData)
      const communityResult = results[4]
      if (communityResult.status === "fulfilled" && Array.isArray(communityResult.value.data)) {
        setCommunityGroups(communityResult.value.data)
        setCommunityError("")
      } else if (communityResult.status === "rejected") {
        console.error("Failed to load dashboard community groups:", communityResult.reason)
        setCommunityError(
          communityResult.reason.response?.data?.detail
            || "Support circles are temporarily unavailable.",
        )
      } else {
        setCommunityError("Support circle information couldn't be loaded.")
      }
      setLoadError(
        failedRequests
          ? "Some of your wellness data couldn't be loaded. Please try again in a moment."
          : "",
      )
      setLoading(false)
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [userId, retryCount])

  const latestCycle = latestRecord(data.cycles, "StartDate")
  const latestRisk = latestRecord(data.risks, "RiskID")
  const latestRecommendation = latestRecord(data.recommendations, "RecommendationID")
  const latestSymptom = data.symptoms
    .slice()
    .sort((a, b) => {
      const dateOrder = String(b.LogDate).localeCompare(String(a.LogDate))
      return dateOrder || (b.SymptomID ?? 0) - (a.SymptomID ?? 0)
    })[0] ?? null
  const cycleDay = latestCycle ? getDaysBetween(latestCycle.StartDate) : null
  const cycleLength = Number(latestCycle?.CycleLength) || 28
  const daysUntilNextPeriod = cycleDay ? Math.max(cycleLength - cycleDay, 0) : null
  const recentSymptoms = data.symptoms
    .slice()
    .sort((a, b) => String(a.LogDate).localeCompare(String(b.LogDate)))
    .slice(-7)
    .map((entry) => ({
    date: formatDate(entry.LogDate, { day: "numeric", month: "short" }),
    hotFlashes: Number(entry.HotFlashes) || 0,
    fatigue: Number(entry.Fatigue) || 0,
    headache: Number(entry.Headache) || 0,
    }))
  const greeting = new Date().getHours() < 12
    ? "Good morning"
    : new Date().getHours() < 18
      ? "Good afternoon"
      : "Good evening"
  const formattedToday = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  const assessmentStage = latestRisk?.MenopauseStage || latestRisk?.RiskLevel
  const joinedGroups = communityGroups.filter((group) => group.isMember)

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface lg:pb-10">
      <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-7">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {formattedToday}
              <span className="h-1 w-1 rounded-full bg-outline" />
              <span className="uppercase tracking-[0.12em]">Your wellness dashboard</span>
            </p>
            <h1 className="font-headline-xl text-3xl font-semibold tracking-tight text-primary sm:text-[2.5rem]">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-on-surface-variant sm:text-base">
              Your personal space to check in, notice patterns, and find support.
            </p>
          </div>
          <Link
            to="/symptoms"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(91,42,110,0.65)] transition hover:-translate-y-0.5 hover:bg-plum-deep hover:shadow-md focus-visible:outline-offset-4"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
            Log a check-in
          </Link>
        </div>

        {loadError && (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-risk-high/20 bg-white px-4 py-3.5 text-sm text-risk-high shadow-sm">
            <div className="flex min-w-0 items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[20px]">cloud_off</span>
              <div>
                <p className="font-semibold">Some information is unavailable</p>
                <p className="mt-0.5 text-xs leading-5 text-on-surface-variant">{loadError}</p>
              </div>
            </div>
            {userId ? (
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                disabled={loading}
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-outline-variant/70 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-surface-container disabled:cursor-wait disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[17px] ${loading ? "animate-spin" : ""}`}>refresh</span>
                {loading ? "Trying again…" : "Try again"}
              </button>
            ) : (
              <Link to="/login" className="shrink-0 text-xs font-semibold text-primary underline underline-offset-4">
                Sign in again
              </Link>
            )}
          </div>
        )}

        <section aria-label="Wellness summary" className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/cycle"
            className="group rounded-2xl border border-outline-variant/50 bg-white p-4 shadow-[0_12px_32px_-26px_rgba(43,21,56,0.38)] transition hover:-translate-y-0.5 hover:border-tertiary/35 hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                <span className="material-symbols-outlined text-[21px]">calendar_month</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform group-hover:translate-x-0.5">arrow_outward</span>
            </div>
            <p className="mt-4 text-xs font-medium text-on-surface-variant">Cycle overview</p>
            <p className="mt-1 font-headline-md text-xl font-semibold text-on-surface">
              {loading ? "Loading…" : cycleDay ? `Day ${cycleDay}` : "Add cycle"}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              {latestCycle ? `Started ${formatDate(latestCycle.StartDate)}` : "Keep your cycle details in one place"}
            </p>
          </Link>

          <Link
            to="/symptoms"
            className="group rounded-2xl border border-outline-variant/50 bg-white p-4 shadow-[0_12px_32px_-26px_rgba(43,21,56,0.38)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[21px]">edit_note</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform group-hover:translate-x-0.5">arrow_outward</span>
            </div>
            <p className="mt-4 text-xs font-medium text-on-surface-variant">Latest check-in</p>
            <p className="mt-1 font-headline-md text-xl font-semibold text-on-surface">
              {loading ? "Loading…" : latestSymptom ? formatDate(latestSymptom.LogDate) : "Not logged yet"}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              {latestSymptom ? `${getSymptomCount(latestSymptom)} symptoms noted` : "A quick check-in can help you spot patterns"}
            </p>
          </Link>

          <Link
            to="/community"
            className="group rounded-2xl border border-outline-variant/50 bg-gradient-to-br from-white to-[#f7eff8] p-4 shadow-[0_12px_32px_-26px_rgba(43,21,56,0.38)] transition hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md sm:col-span-2 sm:p-5 xl:col-span-1"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <span className="material-symbols-outlined text-[21px]">diversity_3</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform group-hover:translate-x-0.5">arrow_outward</span>
            </div>
            <p className="mt-4 text-xs font-medium text-on-surface-variant">Your support circles</p>
            <p className="mt-1 font-headline-md text-xl font-semibold text-on-surface">
              {loading ? "Loading…" : joinedGroups.length ? `${joinedGroups.length} joined` : "Find your people"}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">Support feels better when it is shared</p>
          </Link>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.9fr)]">
          <div className="space-y-5">
            <section className="grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
                <SectionHeading eyebrow="Cycle tracker" title="Your cycle at a glance" to="/cycle" linkLabel="View calendar" />
                {loading ? (
                  <div className="h-32 animate-pulse rounded-2xl bg-surface-container" />
                ) : latestCycle ? (
                  <div className="flex items-center gap-5">
                    <div
                      className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(#cf6d98 ${Math.min((cycleDay / cycleLength) * 100, 100)}%, #f1e9f2 0)` }}
                    >
                      <div className="flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Cycle day</span>
                        <span className="font-headline-lg text-3xl font-semibold text-primary">{cycleDay}</span>
                        <span className="text-[11px] text-on-surface-variant">of {cycleLength}</span>
                      </div>
                    </div>
                    <div className="min-w-0 space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-on-surface-variant">Last period began</p>
                        <p className="mt-0.5 font-semibold text-on-surface">{formatDate(latestCycle.StartDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant">Next period estimate</p>
                        <p className="mt-0.5 font-semibold text-on-surface">
                          {daysUntilNextPeriod === 0 ? "Expected soon" : `About ${daysUntilNextPeriod} days`}
                        </p>
                      </div>
                      <p className="text-xs leading-5 text-on-surface-variant">An estimate based on your recorded cycle length.</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-surface-container/70 px-4 py-5">
                    <p className="text-sm text-on-surface-variant">Add a cycle entry to see your personal cycle overview.</p>
                    <Link to="/cycle" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Add cycle data <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </Link>
                  </div>
                )}
              </article>

              <article className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
                <SectionHeading eyebrow="Your patterns" title="Symptom trends" to="/symptoms" linkLabel="Log symptoms" />
                {loading ? (
                  <div className="h-32 animate-pulse rounded-2xl bg-surface-container" />
                ) : recentSymptoms.length ? (
                  <>
                    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-on-surface-variant">
                      <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-tertiary" />Hot flashes</span>
                      <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Fatigue</span>
                      <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-secondary" />Headache</span>
                    </div>
                    <div className="h-32 w-full">
                      <svg
                        className="h-full w-full overflow-visible"
                        viewBox="0 0 360 132"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="Recent symptom severity trends from zero to three"
                      >
                        {[0, 1, 2, 3].map((level) => {
                          const y = 10 + 82 - (level / 3) * 82
                          return (
                            <g key={level}>
                              <line x1="30" x2="354" y1={y} y2={y} stroke="#efe8f0" strokeDasharray="4 4" />
                              <text x="20" y={y + 3} textAnchor="end" fill="#84778a" fontSize="9">{level}</text>
                            </g>
                          )
                        })}
                        {recentSymptoms.map((entry, index) => {
                          const x = 30 + (recentSymptoms.length > 1 ? (index / (recentSymptoms.length - 1)) * 324 : 162)
                          return (
                            <text key={`${entry.date}-${index}`} x={x} y="116" textAnchor="middle" fill="#84778a" fontSize="9">
                              {entry.date}
                            </text>
                          )
                        })}
                        <polyline points={getTrendPoints(recentSymptoms, "hotFlashes")} fill="none" stroke="#cf6d98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        <polyline points={getTrendPoints(recentSymptoms, "fatigue")} fill="none" stroke="#775187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        <polyline points={getTrendPoints(recentSymptoms, "headache")} fill="none" stroke="#4a9a8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl bg-surface-container/70 px-4 py-5">
                    <p className="text-sm text-on-surface-variant">Your symptom history will appear here as you log entries.</p>
                    <Link to="/symptoms" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Log your first entry <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </Link>
                  </div>
                )}
              </article>
            </section>

            <section>
              <SectionHeading eyebrow="Care that fits you" title="Personalized recommendations" to="/insights" linkLabel="See all" />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Nutrition", description: latestRecommendation?.DietPlan, fallback: "Explore simple, nourishing ideas for your everyday routine.", icon: "nutrition", tone: "rose", to: "/nutrition", label: "Explore nutrition" },
                  { title: "Movement", description: latestRecommendation?.ExercisePlan || latestRecommendation?.YogaPlan, fallback: "Find gentle movement and restorative practices at your pace.", icon: "self_improvement", tone: "sage", to: "/exercise", label: "Explore movement" },
                ].map((item) => (
                  <Link key={item.title} to={item.to} className="group rounded-2xl border border-outline-variant/55 bg-white p-4 shadow-[0_14px_38px_-30px_rgba(43,21,56,0.36)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <Icon tone={item.tone}>{item.icon}</Icon>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-on-surface">{item.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">{shorten(item.description, 100) || item.fallback}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                          {item.label}<span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#43234f] p-5 text-white shadow-[0_18px_42px_-24px_rgba(55,28,69,0.58)] sm:p-6">
              <div className="relative z-10 max-w-full sm:max-w-[calc(100%-7rem)]">
                <div className="flex items-center gap-2 text-tertiary-container">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em]">Assessment insight</p>
                </div>
                <h2 className="mt-3 font-headline-md text-xl font-semibold">
                  {loading ? "Gathering your insights…" : assessmentStage || "Your story, understood"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {latestRisk?.Explanation
                    ? shorten(latestRisk.Explanation, 170)
                    : "Complete an assessment to explore a personalized, dataset-based overview of your current pattern."}
                </p>
                {typeof latestRisk?.RiskScore === "number" && (
                  <p className="mt-3 text-xs text-white/65">
                    Model confidence: {Math.round(latestRisk.RiskScore * 100)}% · Not a clinical risk estimate
                  </p>
                )}
                <Link to={latestRisk ? "/insights" : "/assessment"} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/12 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20">
                  {latestRisk ? "View full assessment" : "Begin your assessment"}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <img
                src={weeklyInsightsImage}
                alt="A woman relaxing at home with a warm drink"
                className="absolute right-6 top-1/2 hidden h-36 w-24 -translate-y-1/2 rounded-2xl object-cover sm:block"
              />
            </section>

            <section className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
              <SectionHeading eyebrow="A thoughtful check-in" title="Your recent health notes" to="/insights" linkLabel="View insights" />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Icon tone="rose">edit_note</Icon>
                  <div>
                    <p className="text-xs text-on-surface-variant">Latest symptom log</p>
                    <p className="mt-1 text-sm font-semibold text-on-surface">{formatDate(latestSymptom?.LogDate)}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">{getSymptomCount(latestSymptom)} symptoms noted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon tone="plum">psychology</Icon>
                  <div>
                    <p className="text-xs text-on-surface-variant">Latest assessment</p>
                    <p className="mt-1 text-sm font-semibold text-on-surface">{assessmentStage || "Not yet completed"}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">For personal awareness, not diagnosis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon tone="sage">favorite</Icon>
                  <div>
                    <p className="text-xs text-on-surface-variant">Your next step</p>
                    <Link to={latestRecommendation ? "/insights" : "/assessment"} className="mt-1 inline-block text-sm font-semibold text-on-surface hover:text-primary">
                      {latestRecommendation ? "Review your care plan" : "Start with an assessment"}
                    </Link>
                    <p className="mt-0.5 text-xs text-on-surface-variant">Move forward at your own pace</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative isolate flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-[#fbf5fa] to-[#efe1f1] p-6 shadow-[0_18px_44px_-30px_rgba(43,21,56,0.38)] sm:min-h-[320px] sm:p-8">
              <div aria-hidden="true" className="absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-tertiary/10 blur-2xl" />
              <div aria-hidden="true" className="absolute -bottom-20 -left-10 -z-10 h-56 w-56 rounded-full bg-secondary/10 blur-2xl" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                  A moment for you
                </span>
                <h2 className="mt-5 max-w-md font-headline-lg text-2xl font-semibold leading-tight text-primary sm:text-3xl">
                  Make a little space for how you&apos;re feeling.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
                  Pause, reflect, and put your thoughts into words. Your voice journal is here whenever you&apos;re ready.
                </p>
              </div>
              <Link
                to="/journal"
                className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-plum-deep hover:shadow-md"
              >
                Open voice journal
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
              <SectionHeading eyebrow="Today at a glance" title="Your overview" />
              <div className="space-y-1">
                <Link to="/cycle" className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-surface-container/75">
                  <span className="flex items-center gap-3"><Icon tone="rose">calendar_month</Icon><span className="text-sm font-medium">Cycle day</span></span>
                  <span className="text-sm font-semibold text-on-surface">{loading ? "—" : cycleDay || "—"}</span>
                </Link>
                <Link to="/symptoms" className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-surface-container/75">
                  <span className="flex items-center gap-3"><Icon tone="plum">edit_note</Icon><span className="text-sm font-medium">In latest check-in</span></span>
                  <span className="text-sm font-semibold text-on-surface">{loading ? "—" : getSymptomCount(latestSymptom)}</span>
                </Link>
                <Link to="/cycle" className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-surface-container/75">
                  <span className="flex items-center gap-3"><Icon tone="sage">water_drop</Icon><span className="text-sm font-medium">Next period estimate</span></span>
                  <span className="text-right text-xs font-semibold text-on-surface">
                    {loading || daysUntilNextPeriod === null
                      ? "—"
                      : daysUntilNextPeriod === 0
                        ? "Expected soon"
                        : `~${daysUntilNextPeriod} days`}
                  </span>
                </Link>
                <Link to="/assessment" className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-surface-container/75">
                  <span className="flex items-center gap-3"><Icon tone="gold">auto_awesome</Icon><span className="text-sm font-medium">Assessment</span></span>
                  <span className="text-right text-xs font-semibold text-on-surface">{assessmentStage || "Get started"}</span>
                </Link>
              </div>
              <p className="mt-3 border-t border-outline-variant/50 pt-3 text-xs leading-5 text-on-surface-variant">
                Cycle dates are estimates based on the information you have logged.
              </p>
            </section>

            <section className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
              <div className="flex items-start gap-3">
                <Icon tone="sage">diversity_3</Icon>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">Women supporting women</p>
                  <h2 className="mt-1 font-headline-md text-lg font-semibold text-on-surface">
                    You don&apos;t have to figure it out alone.
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                    Find a support circle and connect with women navigating midlife too.
                  </p>
                  {joinedGroups.length > 0 && (
                    <p className="mt-2 text-[11px] font-medium text-secondary">
                      {joinedGroups.slice(0, 2).map((group) => group.name).join(" · ")}
                    </p>
                  )}
                  {communityError && (
                    <p role="status" className="mt-2 text-xs leading-5 text-risk-high">
                      {communityError}
                    </p>
                  )}
                  <Link to="/community" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-tertiary">
                    {joinedGroups.length ? "Open your circles" : "Explore support circles"}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/55 bg-white p-5 shadow-[0_14px_38px_-28px_rgba(43,21,56,0.36)] sm:p-6">
              <SectionHeading eyebrow="Small steps count" title="Quick actions" />
              <div className="space-y-2">
                {[
                  { label: "Log symptoms", icon: "edit_note", to: "/symptoms", tone: "rose" },
                  { label: "Add cycle data", icon: "calendar_add_on", to: "/cycle", tone: "plum" },
                  { label: "Get an assessment", icon: "auto_awesome", to: "/assessment", tone: "gold" },
                  { label: "Explore gentle movement", icon: "self_improvement", to: "/exercise", tone: "sage" },
                  { label: "Meet your community", icon: "diversity_3", to: "/community", tone: "rose" },
                ].map((action) => (
                  <Link key={action.to} to={action.to} className="group flex items-center justify-between gap-3 rounded-xl border border-outline-variant/50 px-3 py-2.5 transition hover:border-primary/25 hover:bg-surface-container/65">
                    <span className="flex items-center gap-3">
                      <Icon tone={action.tone}>{action.icon}</Icon>
                      <span className="text-xs font-semibold text-on-surface">{action.label}</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform group-hover:translate-x-0.5">chevron_right</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-tertiary/10 bg-gradient-to-br from-[#f8eaf1] to-[#f7f1f6] p-5 sm:p-6">
              <span className="material-symbols-outlined text-tertiary">favorite</span>
              <p className="mt-2 font-headline-md text-lg font-semibold text-primary">A gentle reminder</p>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                Your wellbeing is personal. Take what feels helpful, and leave room for your own pace.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
