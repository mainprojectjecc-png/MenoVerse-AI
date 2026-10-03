import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { assessYogaPose, getYogaPoseProfile } from "./yogaPoseMonitor"

const MEDIAPIPE_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js",
]

const CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
  [27, 31],
  [28, 32],
]

const SESSION_STORAGE_KEY = "menoverse.exercise.sessions"

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener("load", resolve, { once: true })
      if (window.Pose) resolve()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.crossOrigin = "anonymous"
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

function drawPose(canvas, landmarks, score) {
  const context = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height
  context.clearRect(0, 0, width, height)
  const color = score >= 80 ? "#84A59D" : score >= 60 ? "#D9A05B" : "#BC6C4D"

  context.lineWidth = 5
  context.lineCap = "round"
  context.strokeStyle = color
  CONNECTIONS.forEach(([startIndex, endIndex]) => {
    const start = landmarks[startIndex]
    const end = landmarks[endIndex]
    if (!start || !end || start.visibility < 0.5 || end.visibility < 0.5) return
    context.beginPath()
    context.moveTo(start.x * width, start.y * height)
    context.lineTo(end.x * width, end.y * height)
    context.stroke()
  })

  landmarks.forEach((landmark) => {
    if (!landmark || landmark.visibility < 0.5) return
    context.beginPath()
    context.arc(landmark.x * width, landmark.y * height, 6, 0, Math.PI * 2)
    context.fillStyle = color
    context.fill()
  })
}

export default function PostureExercise() {
  const [searchParams] = useSearchParams()
  const selectedPose = searchParams.get("pose")
  const selectedProfile = getYogaPoseProfile(selectedPose)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const poseRef = useRef(null)
  const streamRef = useRef(null)
  const elapsedRef = useRef(0)
  const sessionSavedRef = useRef(false)
  const selectedPoseRef = useRef(selectedPose)
  const selectedProfileRef = useRef(selectedProfile)
  const [status, setStatus] = useState("Loading posture coach...")
  const [cameraError, setCameraError] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("Position yourself in the frame to begin.")
  const [isActive, setIsActive] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!isActive) return undefined
    const intervalId = setInterval(() => {
      elapsedRef.current += 1
      setElapsedSeconds(elapsedRef.current)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [isActive])

  useEffect(() => {
    selectedPoseRef.current = selectedPose
    selectedProfileRef.current = selectedProfile
  }, [selectedPose, selectedProfile])

  const savePostureSession = () => {
    if (sessionSavedRef.current || elapsedRef.current === 0) return
    let sessions
    try {
      sessions = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "[]")
    } catch {
      sessions = []
    }
    const nextSessions = [{
      exercise: selectedPoseRef.current || "AI Posture Reset",
      durationSeconds: elapsedRef.current,
      targetMinutes: selectedProfileRef.current?.durationMinutes || 10,
      completedAt: new Date().toISOString(),
    }, ...sessions].slice(0, 20)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSessions))
    sessionSavedRef.current = true
  }

  useEffect(() => {
    let cancelled = false

    async function startSession() {
      try {
        await Promise.all(MEDIAPIPE_SCRIPTS.map(loadScript))
        if (cancelled) return

        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        })
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
        pose.onResults((results) => {
          if (!canvasRef.current || !results.poseLandmarks) {
            setFeedback(selectedProfileRef.current
              ? `Landmarks are not clear yet. ${selectedProfileRef.current.camera}`
              : "Step back until your head and shoulders are visible.")
            setScore(0)
            return
          }

          const landmarks = results.poseLandmarks
          const poseName = selectedPoseRef.current
          if (poseName) {
            const assessment = assessYogaPose(poseName, landmarks)
            if (assessment) {
              drawPose(canvasRef.current, landmarks, assessment.score)
              setScore(assessment.score)
              setFeedback(assessment.feedback)
              return
            }
          }

          const leftShoulder = landmarks[11]
          const rightShoulder = landmarks[12]
          const leftEar = landmarks[7]
          const rightEar = landmarks[8]
          const shoulderTilt = Math.abs(Math.atan2(
            rightShoulder.y - leftShoulder.y,
            rightShoulder.x - leftShoulder.x,
          ) * 180 / Math.PI)
          const ear = leftEar.visibility > rightEar.visibility ? leftEar : rightEar
          const shoulder = leftEar.visibility > rightEar.visibility ? leftShoulder : rightShoulder
          const headOffset = Math.abs(ear.x - shoulder.x)
          const shoulderScore = Math.max(0, 100 - shoulderTilt * 5)
          const headScore = Math.max(0, 100 - headOffset * 320)
          const nextScore = Math.round((shoulderScore + headScore) / 2)
          drawPose(canvasRef.current, landmarks, nextScore)
          setScore(nextScore)
          setFeedback(nextScore >= 85
            ? "Beautiful alignment. Keep breathing steadily."
            : shoulderTilt > 8
              ? "Soften your shoulders and level them gently."
              : headOffset > 0.12
                ? "Draw your chin back over your shoulders."
                : "Find a comfortable, tall posture.")
        })
        poseRef.current = pose

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraError("")
        setStatus("Camera ready")
        setIsActive(true)

        const detect = async () => {
          if (cancelled || !videoRef.current || videoRef.current.readyState < 2) return
          await pose.send({ image: videoRef.current })
          if (!cancelled) requestAnimationFrame(detect)
        }
        detect()
      } catch {
        if (!cancelled) {
          setStatus("Camera unavailable")
          setCameraError("Camera access is needed for live posture feedback. Allow camera access and try again.")
        }
      }
    }

    startSession()
    return () => {
      cancelled = true
      savePostureSession()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      poseRef.current?.close()
    }
  }, [])

  const stopCamera = () => {
    savePostureSession()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    setIsActive(false)
    setStatus("Session paused")
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <main className="max-w-[1180px] mx-auto px-6 lg:px-8 py-8">
        <Link to="/exercise" className="inline-flex items-center gap-2 text-sm text-primary mb-6">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exercise library
        </Link>

        <section className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
            {selectedPose ? "Live asana monitoring" : "Live exercise"}
          </p>
          <h1 className="text-[32px] md:text-[42px] leading-tight text-plum-deep" style={{ fontFamily: "Playfair Display" }}>
            {selectedPose || "AI Posture Reset"}
          </h1>
          <p className="text-on-surface-variant max-w-2xl mt-2">
            {selectedProfile
              ? selectedProfile.camera
              : "Follow your alignment in real time with private, browser-based movement feedback."}
          </p>
        </section>

        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)] gap-6">
          <section className="bg-[#3F3D35] rounded-2xl p-3 shadow-lg">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100" muted playsInline />
              <canvas ref={canvasRef} width="1280" height="720" className="absolute inset-0 w-full h-full -scale-x-100" />
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#3F3D35] text-white p-6 text-center">
                  <span className="material-symbols-outlined text-4xl mb-3">videocam</span>
                  <p className="font-semibold">{status}</p>
                  {cameraError && <p className="text-sm text-white/70 mt-2 max-w-sm">{cameraError}</p>}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-2 pt-3 text-white">
              <div>
                <span className="text-sm text-white/75">{status}</span>
                <p className="text-xs text-white/60 mt-1">Time worked: {formatDuration(elapsedSeconds)}</p>
              </div>
              {isActive && (
                <button type="button" onClick={stopCamera} className="text-sm px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition">
                  Pause session
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
              <p className="text-sm text-on-surface-variant">
                {selectedPose ? "Pose alignment estimate" : "Posture score"}
              </p>
              <div className="flex items-end gap-2 mt-2">
                <strong className="text-6xl text-primary" style={{ fontFamily: "Playfair Display" }}>{score}</strong>
                <span className="text-xl text-on-surface-variant mb-2">%</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden mt-4">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${score}%` }} />
              </div>
              <p className="text-sm text-on-surface-variant mt-4">{feedback}</p>
              {selectedPose && (
                <p className="mt-4 border-t border-outline-variant/30 pt-3 text-xs leading-relaxed text-on-surface-variant">
                  Camera feedback estimates visible joint positions. It cannot diagnose injuries or reliably measure every movement from one angle. Stop if you feel pain.
                  {selectedProfile && ` Session goal: ${selectedProfile.durationMinutes} minutes.`}
                </p>
              )}
            </section>
            <section className="bg-lavender-mist/50 rounded-2xl p-6 border border-lavender-mist">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">health_and_safety</span>
                <h2 className="text-lg text-plum-deep" style={{ fontFamily: "Playfair Display" }}>
                  {selectedPose ? "Posture correction" : "A gentle reset"}
                </h2>
              </div>
              <p className="text-sm text-on-surface-variant">
                {selectedPose
                  ? selectedPose === "Seated Twist" || selectedPose === "Supine Twist"
                    ? "Keep the movement small and comfortable. The camera checks your visible setup, but cannot verify the depth of a spinal twist."
                    : "Use the on-screen alignment cue as a gentle adjustment. Keep breathing and use props or a smaller range if needed."
                  : "Keep both feet grounded, let your shoulders soften, and breathe without forcing the position."}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}