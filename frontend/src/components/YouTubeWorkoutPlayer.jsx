import { useEffect, useRef, useState } from "react"

let youtubeApiPromise

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      script.onerror = reject
      document.head.appendChild(script)
    }
  })

  return youtubeApiPromise
}

function UnavailablePanel({ title, videoId }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#211c20] px-5 text-center text-white">
      <span className="material-symbols-outlined text-3xl text-[#ff8585]">play_disabled</span>
      <p className="text-sm font-semibold">This video cannot play in the embedded player</p>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#211c20] hover:bg-white/90"
      >
        Open {title} on YouTube
      </a>
    </div>
  )
}

export default function YouTubeWorkoutPlayer({ videoId, title, unavailable = false }) {
  const playerHostRef = useRef(null)
  const playerRef = useRef(null)
  const [hasError, setHasError] = useState(unavailable)

  useEffect(() => {
    if (unavailable || hasError) return undefined

    let cancelled = false

    loadYouTubeApi()
      .then((youtube) => {
        if (cancelled || !playerHostRef.current) return
        playerRef.current = new youtube.Player(playerHostRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              event.target.mute()
              event.target.playVideo()
            },
            onError: () => setHasError(true),
          },
        })
      })
      .catch(() => setHasError(true))

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId, unavailable, hasError])

  if (hasError) {
    return <UnavailablePanel title={title} videoId={videoId} />
  }

  return <div ref={playerHostRef} className="h-full w-full" aria-label={`${title} video player`} />
}
