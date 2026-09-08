const TONE_CLASSES = {
  primary: {
    iconBg: "bg-primary/5 group-hover:bg-primary/10",
    iconBgStatic: "bg-primary/10",
    iconText: "text-primary",
    hoverBorder: "hover:border-primary/30",
    fill: "bg-primary",
  },
  "risk-high": {
    iconBg: "bg-risk-high/5 group-hover:bg-risk-high/10",
    iconBgStatic: "bg-risk-high/10",
    iconText: "text-risk-high",
    hoverBorder: "hover:border-risk-high/30",
    fill: "bg-risk-high",
  },
  "risk-low": {
    iconBg: "bg-risk-low/5 group-hover:bg-risk-low/10",
    iconBgStatic: "bg-risk-low/10",
    iconText: "text-risk-low",
    hoverBorder: "hover:border-risk-low/30",
    fill: "bg-risk-low",
  },
  tertiary: {
    iconBg: "bg-tertiary/5 group-hover:bg-tertiary/10",
    iconBgStatic: "bg-tertiary/10",
    iconText: "text-tertiary",
    hoverBorder: "hover:border-tertiary/30",
    fill: "bg-tertiary",
  },
}

/**
 * Mini bar chart used inside the "compact" variant.
 * bars: [{ height: 0-100, opacity: 0-1 }]
 * contained: true -> boxed style (bg-surface-container, padded, tighter gap)
 *            false -> plain style (no background, wider gap) e.g. Sleep card
 */
function MiniBars({ bars, fillClass, contained = true }) {
  return (
    <div
      className={`w-full h-14 flex items-end overflow-hidden ${
        contained
          ? "bg-surface-container rounded-xl gap-1.5 px-3 py-2"
          : "gap-2 px-1"
      }`}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`flex-1 rounded-full ${fillClass}`}
          style={{ height: `${bar.height}%`, opacity: bar.opacity }}
        />
      ))}
    </div>
  )
}

function ProgressBar({ progress, fillClass }) {
  return (
    <div className="w-full bg-surface-container-high rounded-full h-3">
      <div
        className={`h-3 rounded-full shadow-sm ${fillClass}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/**
 * StatCard
 *
 * variant="compact" (default): icon + more_horiz row, label, big value,
 *   then either a mini bar chart or a progress bar underneath.
 *   Matches the Heart Rate / Sleep cards.
 *
 * variant="wide": icon + label + value grouped in one header row,
 *   more_horiz on the right, progress bar (with optional caption) below.
 *   Matches the Daily Steps card.
 */
export default function StatCard({
  variant = "compact",
  icon,
  tone = "primary",
  label,
  value,
  unit,
  bars,
  barsContained = true,
  progress,
  progressLabel,
  onClick,
}) {
  const t = TONE_CLASSES[tone] || TONE_CLASSES.primary
  const clickable = typeof onClick === "function"

  if (variant === "wide") {
    return (
      <div
        onClick={onClick}
        className={`bg-surface rounded-2xl p-8 soft-shadow border border-outline-variant/10 ${
          clickable ? "cursor-pointer" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${t.iconBgStatic}`}>
              <span
                className={`material-symbols-outlined ${t.iconText}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>

            <div>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">
                {label}
              </p>
              <span className="font-headline-md text-plum-deep">{value}</span>
            </div>
          </div>

          <span className="material-symbols-outlined text-outline">
            more_horiz
          </span>
        </div>

        {typeof progress === "number" && (
          <ProgressBar progress={progress} fillClass={t.fill} />
        )}

        {progressLabel && (
          <p className="text-label-sm text-on-surface-variant mt-4 font-bold">
            {progressLabel}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-2xl p-6 soft-shadow border border-outline-variant/10 transition-all group ${
        t.hoverBorder
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className={`p-3 rounded-2xl transition-colors ${t.iconBg}`}>
          <span
            className={`material-symbols-outlined ${t.iconText}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        <span className="material-symbols-outlined text-outline">
          more_horiz
        </span>
      </div>

      <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </p>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="font-headline-lg text-plum-deep">{value}</span>

        {unit && (
          <span className="font-label-sm text-on-surface-variant font-bold">
            {unit}
          </span>
        )}
      </div>

      {bars && (
        <MiniBars bars={bars} fillClass={t.fill} contained={barsContained} />
      )}

      {typeof progress === "number" && (
        <ProgressBar progress={progress} fillClass={t.fill} />
      )}
    </div>
  )
}
