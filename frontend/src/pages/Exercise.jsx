import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import YogaPoseIllustration from "../components/YogaPoseIllustration"
import WorkoutDemoIllustration from "../components/WorkoutDemoIllustration"
import YouTubeWorkoutPlayer from "../components/YouTubeWorkoutPlayer"

const SESSION_STORAGE_KEY = "menoverse.exercise.sessions"

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const routines = [
  {
    id: "yoga",
    title: "Yoga Practices",
    desc: "A gentle flow through ten poses with alignment guidance.",
    targetMinutes: 30,
    level: "Gentle",
    category: "Restorative Yoga",
    icon: "self_improvement",
    steps: [
      { title: "Cat-Cow Pose", duration: 3, cue: "Move slowly between a gentle arch and a rounded back, following your breath.", correction: "Keep wrists under shoulders and knees under hips. Move the spine evenly; avoid dropping your belly or forcing your neck." },
      { title: "Child's Pose", duration: 3, cue: "Rest your hips back and let your arms reach forward or relax beside you.", correction: "Widen your knees or place a cushion under your chest if needed. Keep the neck relaxed and do not force your hips toward your heels." },
      { title: "Bridge Pose", duration: 3, cue: "Lie on your back with knees bent and feet grounded, then gently lift your hips.", correction: "Keep feet hip-width apart and knees pointing forward. Lift only to a comfortable height; avoid turning your head or pushing into pain." },
      { title: "Legs Up the Wall", duration: 3, cue: "Rest on your back with your legs supported vertically or against a wall.", correction: "Move your hips farther from the wall or bend your knees for comfort. Support your head and stop if you notice numbness or tingling." },
      { title: "Reclined Bound Angle", duration: 3, cue: "Lie back with the soles of your feet together and knees open.", correction: "Support each thigh with a cushion so your knees can relax. Do not press the knees down or strain your inner thighs." },
      { title: "Cobra Pose", duration: 3, cue: "Press lightly through your hands to lift your chest a comfortable amount.", correction: "Keep elbows softly bent and shoulders away from ears. Use a small lift and avoid pushing your arms straight or compressing your lower back." },
      { title: "Standing Forward Fold", duration: 3, cue: "Hinge at your hips and let your upper body fold forward comfortably.", correction: "Keep knees softly bent and let your head hang without pulling it down. Reduce the fold if you feel a strong stretch or strain." },
      { title: "Seated Twist", duration: 3, cue: "Sit tall and rotate your upper body gently to one side, then switch.", correction: "Keep both sitting bones grounded and turn from your torso. Avoid pulling on your knee or forcing the twist through your neck." },
      { title: "Warrior II Pose", duration: 3, cue: "Stand in a comfortable wide stance, bend the front knee, and reach your arms out.", correction: "Keep the front knee pointing in the same direction as your toes and shoulders relaxed over your hips. Shorten your stance if balance feels difficult." },
      { title: "Supine Twist", duration: 3, cue: "Lie on your back and let bent knees lower gently to one side, then switch.", correction: "Keep both shoulders comfortably supported and place a cushion under your knees if needed. Use a smaller range if your back feels strained." },
    ],
  },
  {
    id: "strength",
    title: "Strength Training",
    desc: "Low-impact strength with alignment reminders.",
    targetMinutes: 20,
    level: "Beginner",
    category: "Strength Training",
    icon: "fitness_center",
    steps: [
      { title: "Pelvic floor bridge", duration: 7, cue: "Keep ribs relaxed and lift only as high as feels comfortable." },
      { title: "Supported chair squat", duration: 7, cue: "Keep knees tracking over toes and chest comfortably lifted." },
      { title: "Wall push-up", duration: 6, cue: "Keep a long line from head to hips; do not lock your elbows." },
    ],
  },
  {
    id: "zumba",
    title: "Beginner Friendly Zumba",
    desc: "Follow beginner dance videos with comfortable, low-impact steps.",
    targetMinutes: 20,
    level: "Beginner",
    category: "Dance",
    icon: "music_note",
    steps: [
      { title: "Dance warm-up", duration: 4, cue: "March gently in place and loosen your shoulders before adding steps.", videoId: "YKQIGAv7qb4", videoUnavailable: true },
      { title: "Salsa side steps", duration: 6, cue: "Step side to side with a soft knee bend; keep the steps small and comfortable.", videoId: "Glo3oDSt3BY" },
      { title: "Merengue march", duration: 6, cue: "March to the rhythm, staying tall and letting your arms move naturally.", videoId: "a2w6oB6mEws" },
      { title: "Cool-down sway", duration: 4, cue: "Slow the pace, sway gently, and let your breathing settle." },
    ],
  },
  {
    id: "cardio",
    title: "Cardio Workout",
    desc: "A low-impact walk and easy cool-down.",
    targetMinutes: 20,
    level: "Beginner",
    category: "Gentle Cardio",
    icon: "directions_walk",
    steps: [
      { title: "Easy warm-up walk", duration: 4, cue: "Start at a pace where you can speak comfortably." },
      { title: "Low-impact brisk walk", duration: 12, cue: "Stay upright, relax your shoulders, and shorten your stride if needed." },
      { title: "Slow cool-down walk", duration: 4, cue: "Ease your pace and let your breathing settle." },
    ],
  },
]

export default function Exercise() {
  const [activeSessionKey, setActiveSessionKey] = useState("")
  const [activeSessionName, setActiveSessionName] = useState("")
  const [activeTargetMinutes, setActiveTargetMinutes] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (!isWorkoutActive) return undefined
    const intervalId = setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => clearInterval(intervalId)
  }, [isWorkoutActive])

  const startWorkout = (routine, step) => {
    const sessionKey = `${routine.id}:${step.title}`
    if (activeSessionKey === sessionKey) {
      setIsWorkoutActive((active) => !active)
      return
    }
    if (activeSessionKey && elapsedSeconds > 0) {
      const nextSessions = [{
        exercise: activeSessionName,
        durationSeconds: elapsedSeconds,
        targetMinutes: activeTargetMinutes,
        completedAt: new Date().toISOString(),
      }, ...sessions].slice(0, 20)
      setSessions(nextSessions)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSessions))
    }
    setActiveSessionKey(sessionKey)
    setActiveSessionName(`${routine.title} · ${step.title}`)
    setActiveTargetMinutes(step.duration)
    setElapsedSeconds(0)
    setIsWorkoutActive(true)
  }

  const saveWorkout = () => {
    if (!activeSessionKey || elapsedSeconds === 0) return
    const nextSessions = [{
      exercise: activeSessionName,
      durationSeconds: elapsedSeconds,
      targetMinutes: activeTargetMinutes,
      completedAt: new Date().toISOString(),
    }, ...sessions].slice(0, 20)
    setSessions(nextSessions)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSessions))
    setActiveSessionKey("")
    setActiveSessionName("")
    setActiveTargetMinutes(0)
    setElapsedSeconds(0)
    setIsWorkoutActive(false)
  }

  const totalWorkoutSeconds = sessions.reduce(
    (total, session) => total + (Number(session.durationSeconds) || 0),
    0,
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

        <nav aria-label="Workout modules" className="mb-8 flex flex-wrap gap-2 border-y border-outline-variant/40 py-4">
          {routines.map((routine) => (
            <a
              key={routine.id}
              href={`#module-${routine.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">{routine.icon}</span>
              {routine.title}
            </a>
          ))}
        </nav>

        <p className="mb-8 text-sm text-on-surface-variant">
          Total time logged: <strong className="text-plum-deep">{formatDuration(totalWorkoutSeconds)}</strong>
        </p>

        <div className="space-y-12">
          {routines.map((routine) => (
            <section key={routine.id} id={`module-${routine.id}`} className="scroll-mt-8">
              <div className="mb-5 flex items-start gap-4 border-b border-outline-variant/40 pb-4">
                <span className="material-symbols-outlined flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container/50 text-primary text-2xl">
                  {routine.icon}
                </span>
                <div>
                  <h2 className="text-2xl text-plum-deep" style={{ fontFamily: "Playfair Display" }}>{routine.title}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">{routine.desc} · {routine.targetMinutes} min plan</p>
                  {routine.id === "yoga" && (
                    <a
                      href="https://myyogateacher.com/articles/yoga-for-menopause"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-primary underline underline-offset-2"
                    >
                      Yoga pose photo reference: MyYogaTeacher
                    </a>
                  )}
                </div>
              </div>

              <ol className="grid gap-4 md:grid-cols-2">
                {routine.steps.map((step, index) => {
                  const sessionKey = `${routine.id}:${step.title}`
                  const isCurrent = activeSessionKey === sessionKey
                  const sessionName = `${routine.title} · ${step.title}`
                  const loggedSeconds = sessions
                    .filter((session) => session.exercise === sessionName)
                    .reduce((total, session) => total + (Number(session.durationSeconds) || 0), 0)
                  const currentElapsed = isCurrent ? elapsedSeconds : 0
                  const currentProgress = isCurrent
                    ? Math.min(100, Math.round((currentElapsed / (step.duration * 60)) * 100))
                    : 0

                  return (
                    <li key={sessionKey} className="overflow-hidden rounded-xl border border-outline-variant/35 bg-surface">
                      <div className="flex gap-4 p-4">
                        {routine.id === "yoga" ? (
                          <YogaPoseIllustration poseName={step.title} />
                        ) : (
                          <WorkoutDemoIllustration title={step.title} />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-semibold text-plum-deep">{index + 1}. {step.title}</h3>
                            <span className="shrink-0 text-xs font-semibold text-primary">{step.duration} min</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{step.cue}</p>
                          {step.correction && (
                            <p className="mt-2 border-l-2 border-primary/50 pl-3 text-xs leading-relaxed text-on-surface-variant">
                              <strong className="text-primary">Posture correction:</strong> {step.correction}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant/25 bg-surface-container-low/50 p-3">
                        <button
                          type="button"
                          onClick={() => startWorkout(routine, step)}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isCurrent && isWorkoutActive ? "pause" : "play_arrow"}
                          </span>
                          {isCurrent ? isWorkoutActive ? "Pause workout" : "Resume workout" : "Start workout"}
                        </button>
                        {step.videoId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${step.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                          >
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            Watch video
                          </a>
                        )}
                        {routine.id === "yoga" && (
                          <Link
                            to={`/exercise/posture?pose=${encodeURIComponent(step.title)}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                          >
                            <span className="material-symbols-outlined text-[18px]">videocam</span>
                            Camera correction
                          </Link>
                        )}
                        <span className="ml-auto text-sm tabular-nums text-on-surface-variant">
                          {isCurrent ? formatDuration(currentElapsed) : formatDuration(loggedSeconds)}
                        </span>
                      </div>

                      {isCurrent && (
                        <div className={`grid gap-5 px-4 pb-4 ${step.videoId ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]" : ""}`}>
                          <div>
                            <div className="flex justify-between text-xs text-on-surface-variant">
                              <span>{currentProgress >= 100 ? "Session goal reached" : "Session progress"}</span>
                              <span>{currentProgress}% of {step.duration} min</span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-container-high" role="progressbar" aria-label={`${step.title} progress`} aria-valuenow={currentProgress} aria-valuemin={0} aria-valuemax={100}>
                              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${currentProgress}%` }} />
                            </div>
                            <button
                              type="button"
                              onClick={saveWorkout}
                              disabled={elapsedSeconds === 0}
                              className="mt-3 rounded-lg border border-outline-variant px-3 py-2 text-sm font-semibold text-on-surface disabled:opacity-40"
                            >
                              Finish & save session
                            </button>
                          </div>
                          {step.videoId && (
                            <div>
                              <div className="aspect-video overflow-hidden rounded-lg bg-black">
                                <YouTubeWorkoutPlayer
                                  key={step.videoId}
                                  videoId={step.videoId}
                                  title={step.title}
                                  unavailable={step.videoUnavailable}
                                />
                              </div>
                              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                                <span>{step.videoUnavailable ? "The video owner may have removed it or restricted playback." : "Video starts muted. Use the player controls for sound and playback."}</span>
                                <a
                                  href={`https://www.youtube.com/watch?v=${step.videoId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-semibold text-primary underline underline-offset-2"
                                >
                                  Open on YouTube
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>


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
                Gentle movement can support stress management, mood, and overall wellbeing as part of a balanced routine.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}