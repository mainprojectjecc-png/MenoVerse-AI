const demoFigures = {
  "Pelvic floor bridge": {
    head: [103, 60],
    pose: "M96 61 L78 58 L61 55 L45 61 M46 61 L35 52 L24 51 M48 61 L37 55 L25 55 M61 55 L54 42 L43 37 L31 42 M63 55 L56 44 L45 39 L34 44",
  },
  "Supported chair squat": {
    head: [54, 17],
    pose: "M57 25 L60 45 L72 53 M58 31 L43 40 L35 35 M59 32 L73 39 L82 34 M60 45 L76 50 L82 66 L95 68 M60 46 L48 56 L44 69 L56 70 M95 40 L95 72 L112 72",
  },
  "Wall push-up": {
    head: [42, 28],
    pose: "M49 31 L66 42 L82 51 L96 55 M53 35 L70 44 L87 50 L102 48 M96 55 L91 69 L88 78 M100 54 L98 68 L96 77 M45 30 L39 42 L34 54 M41 31 L35 42 L31 54 M30 39 L30 74",
  },
  "Dance warm-up": {
    head: [62, 15],
    pose: "M62 23 L62 45 M61 30 L44 34 L33 27 M64 30 L80 34 L91 25 M62 45 L52 57 L49 73 L38 75 M64 45 L73 56 L81 69 L94 72",
  },
  "Salsa side steps": {
    head: [62, 15],
    pose: "M62 23 L63 44 M62 30 L43 26 L27 20 M63 30 L81 24 L99 29 M63 44 L48 51 L33 62 L23 69 M65 44 L79 50 L94 60 L106 58",
  },
  "Merengue march": {
    head: [62, 15],
    pose: "M62 23 L62 45 M61 30 L44 35 L33 28 M64 30 L80 35 L91 28 M62 45 L49 53 L45 68 L34 71 M64 45 L77 51 L83 64 L96 67",
  },
  "Cool-down sway": {
    head: [62, 15],
    pose: "M62 23 Q67 34 62 45 M62 30 L45 35 L35 29 M64 30 L79 34 L90 28 M62 45 L51 57 L48 73 L37 76 M63 45 L74 57 L80 73 L92 75",
  },
  "Easy warm-up walk": {
    head: [62, 15],
    pose: "M62 23 L62 45 M61 30 L48 36 L42 45 M64 30 L77 36 L83 44 M62 45 L52 55 L45 69 L34 70 M64 45 L75 54 L83 65 L96 64",
  },
  "Low-impact brisk walk": {
    head: [62, 15],
    pose: "M62 23 L63 45 M62 30 L45 35 L35 29 M64 30 L80 34 L91 27 M63 45 L49 53 L38 62 L26 61 M65 45 L77 52 L88 60 L102 57",
  },
  "Slow cool-down walk": {
    head: [62, 15],
    pose: "M62 23 L62 45 M61 30 L47 36 L39 31 M64 30 L77 36 L85 32 M62 45 L52 56 L47 69 L37 72 M64 45 L75 56 L81 69 L92 72",
  },
}

export default function WorkoutDemoIllustration({ title }) {
  const figure = demoFigures[title] || demoFigures["Easy warm-up walk"]
  const [headX, headY] = figure.head

  return (
    <svg
      viewBox="0 0 128 92"
      role="img"
      aria-label={`${title} human movement demonstration`}
      className="h-[86px] w-[112px] shrink-0 rounded-lg bg-[#edf1e8]"
    >
      <path d="M10 79 H118" stroke="#cfb994" strokeWidth="2" strokeLinecap="round" />
      <path d={figure.pose} fill="none" stroke="#d5a17e" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={figure.pose} fill="none" stroke="#354e49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 24 Q62 19 67 24 L69 45 L57 45 Z" fill="#468979" />
      <circle cx={headX} cy={headY} r="7" fill="#d5a17e" stroke="#354e49" strokeWidth="2" />
      <path d={`M${headX - 6} ${headY - 2} Q${headX} ${headY - 12} ${headX + 7} ${headY - 4}`} fill="none" stroke="#354e49" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}