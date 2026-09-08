import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]
const DEFAULT_CYCLE_LENGTH = 28
const DEFAULT_PERIOD_LENGTH_DAYS = 4 // used when a cycle has no EndDate yet

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, amount) {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

function daysBetween(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  return Math.round((startOfDay(b) - startOfDay(a)) / MS_PER_DAY)
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

// Ovulation typically falls ~14 days before the next period, regardless of
// total cycle length (the luteal phase is fairly constant). We show a small
// +/- 2 day window around that estimate.
function getOvulationWindow(cycleStart, cycleLength) {
  const ovulationDay = cycleLength - 14
  return {
    start: addDays(cycleStart, ovulationDay - 2),
    end: addDays(cycleStart, ovulationDay + 2),
  }
}

function getMenstruationWindow(cycle) {
  const start = new Date(cycle.StartDate)
  const end = cycle.EndDate
    ? new Date(cycle.EndDate)
    : addDays(start, DEFAULT_PERIOD_LENGTH_DAYS)
  return { start, end }
}

function getPhaseLabel(dayInCycle, cycleLength) {
  if (dayInCycle <= 5) return "Menstrual phase"
  const ovulationDay = cycleLength - 14
  if (dayInCycle < ovulationDay - 2) return "Follicular phase"
  if (dayInCycle <= ovulationDay + 2) return "Ovulation window"
  return "Luteal phase"
}

function buildCalendarGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = (firstOfMonth.getDay() + 6) % 7 // Mon=0 ... Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      inCurrentMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inCurrentMonth: true })
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    cells.push({ date: addDays(last, 1), inCurrentMonth: false })
  }

  return cells
}

function CycleTracking() {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewDate, setViewDate] = useState(() => new Date())

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setError("Please log in to view your cycle history.")
      setLoading(false)
      return
    }

    const { UserID } = JSON.parse(stored)

    api
      .get(`/cycles/${UserID}`)
      .then((res) => setCycles(res.data))
      .catch((err) => {
        console.error("Failed to load cycles:", err)
        setError("Couldn't load your cycle history. Try again later.")
      })
      .finally(() => setLoading(false))
  }, [])

  const formatDateRange = (start, end) => {
    const opts = { month: "short", day: "numeric" }
    const startLabel = new Date(start).toLocaleDateString("en-US", opts)
    if (!end) return startLabel
    const endLabel = new Date(end).toLocaleDateString("en-US", opts)
    return `${startLabel} – ${endLabel}`
  }

  const monthLabel = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })

  const today = new Date()

  const mostRecentCycle = [...cycles].sort(
    (a, b) => new Date(b.StartDate) - new Date(a.StartDate)
  )[0]

  const currentCycleLength = mostRecentCycle?.CycleLength || DEFAULT_CYCLE_LENGTH
  const dayInCycle = mostRecentCycle
    ? daysBetween(new Date(mostRecentCycle.StartDate), today) + 1
    : null
  const phaseLabel =
    dayInCycle && dayInCycle > 0
      ? getPhaseLabel(dayInCycle, currentCycleLength)
      : null
  const predictedNextPeriod = mostRecentCycle
    ? addDays(new Date(mostRecentCycle.StartDate), currentCycleLength)
    : null
  const daysUntilNextPeriod = predictedNextPeriod
    ? daysBetween(today, predictedNextPeriod)
    : null

  const calendarCells = buildCalendarGrid(viewDate)

  const isMenstruationDay = (date) =>
    cycles.some((cycle) => {
      const { start, end } = getMenstruationWindow(cycle)
      return date >= startOfDay(start) && date <= startOfDay(end)
    })

  const isOvulationDay = (date) =>
    cycles.some((cycle) => {
      const length = cycle.CycleLength || DEFAULT_CYCLE_LENGTH
      const { start, end } = getOvulationWindow(new Date(cycle.StartDate), length)
      return date >= startOfDay(start) && date <= startOfDay(end)
    })

  const goToPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))

  const goToNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0 antialiased">

      {/* MAIN CONTENT */}
      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">

        {/* PAGE HEADER */}
        <section className="space-y-2">
          <h2
            className="font-headline-xl text-[40px] leading-[48px] font-bold text-plum-deep"
            style={{ fontFamily: "Playfair Display" }}
          >
            Cycle History
          </h2>

          <p className="text-on-surface-variant font-medium">
            Understanding your body's rhythm during perimenopause.
          </p>
        </section>


        {/* CURRENT CYCLE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* CALENDAR */}
          <div className="md:col-span-8 bg-surface/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-[0_10px_30px_-10px_rgba(107,112,92,0.1)]">

            <div className="flex items-center justify-between mb-8">

              <h3
                className="text-[24px] font-semibold text-primary italic"
                style={{ fontFamily: "Playfair Display" }}
              >
                {viewDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              <div className="flex gap-4">

                <button
                  onClick={goToPrevMonth}
                  className="p-2 hover:bg-lavender-mist rounded-full"
                  aria-label="Previous month"
                >
                  <span className="material-symbols-outlined text-primary">
                    chevron_left
                  </span>
                </button>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-lavender-mist rounded-full"
                  aria-label="Next month"
                >
                  <span className="material-symbols-outlined text-primary">
                    chevron_right
                  </span>
                </button>

              </div>
            </div>


            {/* DAYS */}
            <div className="grid grid-cols-7 gap-2 mb-4">

              {WEEKDAY_LABELS.map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="text-center text-sm font-semibold text-outline py-2"
                >
                  {day}
                </div>
              ))}

            </div>


            {/* CALENDAR DATES */}
            <div className="grid grid-cols-7 gap-2">

              {calendarCells.map(({ date, inCurrentMonth }) => {
                const isToday = isSameDay(date, today)
                const menstruation = inCurrentMonth && isMenstruationDay(date)
                const ovulation =
                  inCurrentMonth && !menstruation && isOvulationDay(date)

                let cellClasses = "h-12 flex items-center justify-center"

                if (!inCurrentMonth) {
                  cellClasses += " text-outline-variant opacity-30"
                } else if (isToday) {
                  cellClasses += " bg-primary text-white rounded-2xl shadow-md"
                } else if (menstruation) {
                  cellClasses +=
                    " rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 text-risk-high font-bold"
                } else if (ovulation) {
                  cellClasses +=
                    " rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 text-risk-low font-bold"
                }

                return (
                  <div key={date.toISOString()} className={cellClasses}>
                    {date.getDate()}
                  </div>
                )
              })}

            </div>


            {/* LEGEND */}
            <div className="mt-8 flex flex-wrap gap-6 text-xs font-medium">

              <div className="flex items-center gap-2">

                <span className="w-4 h-4 rounded-[45%_55%_60%_40%/50%_40%_60%_50%] bg-risk-high/15 border border-risk-high/30 inline-block" />

                <span className="text-on-surface-variant font-bold">
                  Menstruation
                </span>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-4 h-4 rounded-[60%_40%_50%_50%/40%_50%_50%_60%] bg-risk-low/15 border border-risk-low/30 inline-block" />

                <span className="text-on-surface-variant font-bold">
                  Ovulation Window
                </span>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-4 h-4 bg-primary rounded-lg inline-block" />

                <span className="text-on-surface-variant font-bold">
                  Today
                </span>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE INFORMATION */}
          <div className="md:col-span-4 space-y-5">

            {/* CURRENT STATUS */}
            <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden shadow-lg">

              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <h4 className="text-xs text-lavender-mist mb-4 uppercase tracking-[0.1em] font-bold">
                Current Status
              </h4>

              {mostRecentCycle ? (
                <>
                  <p
                    className="text-[40px] font-bold leading-none"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    Day {dayInCycle}
                  </p>

                  <p className="text-lavender-mist italic mt-1">
                    {phaseLabel}
                  </p>

                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">

                    <span className="text-sm text-lavender-mist">
                      Predicted next period
                    </span>

                    <span className="text-sm font-bold">
                      {daysUntilNextPeriod >= 0
                        ? `${daysUntilNextPeriod} days`
                        : "Overdue"}
                    </span>

                  </div>
                </>
              ) : (
                <p className="text-lavender-mist italic mt-1">
                  Log your first cycle to see your current status here.
                </p>
              )}

            </div>


            {/* CYCLE INSIGHT */}
            {cycles.length > 1 && (
              <div className="bg-surface rounded-2xl p-6 border-l-4 border-risk-low shadow-sm">

                <div className="flex items-start gap-4">

                  <div className="p-3 bg-risk-low/10 rounded-xl">

                    <span className="material-symbols-outlined text-risk-low">
                      insights
                    </span>

                  </div>

                  <div>

                    <h4 className="text-xs uppercase tracking-wider font-bold">
                      Cycle Insight
                    </h4>

                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic">
                      Your cycle is currently {currentCycleLength} days long.
                      Keep logging to track how this changes over time.
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* HISTORY REPORT */}
            <Link
              to="/symptoms"
              className="bg-surface rounded-2xl p-6 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/20 shadow-sm flex items-center justify-between"
            >

              <div className="flex items-center gap-4">

                <span className="material-symbols-outlined text-tertiary">
                  history_edu
                </span>

                <span className="text-sm font-bold">
                  View History Report
                </span>

              </div>

              <span className="material-symbols-outlined text-outline">
                arrow_forward
              </span>

            </Link>

          </div>

        </div>


        {/* PREVIOUS CYCLES */}
        <section className="space-y-8">

          <h3
            className="text-[24px] font-semibold text-plum-deep italic"
            style={{ fontFamily: "Playfair Display" }}
          >
            Previous Cycles
          </h3>


          {loading && (
            <p className="text-on-surface-variant italic">
              Loading your cycle history...
            </p>
          )}

          {!loading && error && (
            <p className="text-risk-high font-medium">{error}</p>
          )}

          {!loading && !error && cycles.length === 0 && (
            <p className="text-on-surface-variant italic">
              No cycles logged yet. Once you start tracking, they'll show up
              here.
            </p>
          )}

          {!loading && !error && cycles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cycles.map((cycle) => (
                <div
                  key={cycle.CycleID}
                  className="bg-surface rounded-2xl p-6 border-t-4 border-primary/20 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-outline font-bold">
                      {monthLabel(cycle.StartDate)}
                    </span>

                    {cycle.CycleLength && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {cycle.CycleLength} Days
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-on-surface-variant font-medium">
                    {formatDateRange(cycle.StartDate, cycle.EndDate)}
                  </p>

                  {cycle.Notes && (
                    <p className="mt-5 text-sm text-on-surface-variant">
                      {cycle.Notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        </section>


        {/* LOG SYMPTOMS CTA */}
        <div className="bg-plum-deep text-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl mb-12">

          <div className="absolute inset-0 opacity-10">

            <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full -ml-20 -mb-20 blur-3xl" />

          </div>


          <div className="flex-1 space-y-6 relative z-10">

            <h3
              className="text-[28px] md:text-[32px] font-semibold italic"
              style={{ fontFamily: "Playfair Display" }}
            >
              Log your symptoms today
            </h3>

            <p className="text-lavender-mist/80 italic">
              Voice journaling or quick-tap logging helps MenoVerse AI build
              your unique hormonal profile.
            </p>


            <div className="flex flex-wrap gap-4 pt-4">

              <Link
                to="/journal"
                className="bg-surface text-plum-deep px-8 py-4 rounded-xl text-sm font-semibold hover:bg-lavender-mist active:scale-95 transition-all flex items-center gap-3 shadow-md"
              >

                <span className="material-symbols-outlined text-primary">
                  mic
                </span>

                Voice Journal

              </Link>


              <Link
                to="/symptoms"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all"
              >
                Quick Log
              </Link>

            </div>

          </div>


          <div className="w-full md:w-1/3 aspect-video relative z-10 overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 bg-primary/20 flex items-center justify-center">

            <span className="material-symbols-outlined text-white/60 text-6xl">
              spa
            </span>

          </div>

        </div>

      </main>

    </div>
  )
}

export default CycleTracking
