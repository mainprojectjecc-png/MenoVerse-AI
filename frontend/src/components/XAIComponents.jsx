function formatValue(factor) {
  if (factor.value === undefined || factor.value === null || factor.value === "") {
    return "Not available"
  }
  if (factor.key === "Weight_kg") {
    return `${factor.value} kg`
  }
  return String(factor.value)
}

function directionLabel(direction) {
  if (direction === "moves_to_later_stage") return "↑ Later-stage influence"
  if (direction === "moves_to_earlier_stage") return "↓ Earlier-stage influence"
  if (direction === "increases_risk") return "↑ Higher risk influence"
  if (direction === "decreases_risk") return "↓ Lower risk influence"
  return "No noticeable influence"
}

function influenceLabel(impact) {
  if (impact === "high") return "Strong influence"
  if (impact === "moderate") return "Moderate influence"
  return "Small influence"
}

function factorExplanation(factor) {
  if (factor.direction === "moves_to_later_stage") {
    return "Compared with alternatives observed in the training data, this answer was associated with the model shifting toward a later stage."
  }
  if (factor.direction === "moves_to_earlier_stage") {
    return "Compared with alternatives observed in the training data, this answer was associated with the model shifting toward an earlier stage."
  }
  if (factor.direction === "increases_risk") {
    return "Compared with other observed answers, this answer was associated with the AI moving its estimated risk higher."
  }
  if (factor.direction === "decreases_risk") {
    return "Compared with other observed answers, this answer was associated with the AI moving its estimated risk lower."
  }
  return "This answer made little difference to the AI result in this comparison."
}

export function XAIRiskSummary({ riskLevel }) {
  const stageStyles = {
    Premenopause: "bg-risk-low/15 text-[#42675f]",
    "Early perimenopause": "bg-[#D9A05B]/20 text-[#76502c]",
    "Late perimenopause": "bg-[#D9A05B]/20 text-[#76502c]",
    Postmenopause: "bg-risk-high/15 text-[#8b4933]",
    Early: "bg-risk-low/15 text-[#42675f]",
    Perimenopause: "bg-[#D9A05B]/20 text-[#76502c]",
  }
  const stageStyle = stageStyles[riskLevel] || "bg-surface-container text-on-surface"
  const isStage = Object.hasOwn(stageStyles, riskLevel)

  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-sm border border-outline-variant/30"
      aria-labelledby="xai-result-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
            Your AI result
          </p>
          <h2 id="xai-result-heading" className="mt-2 font-headline-md text-headline-md text-plum-deep">
            {riskLevel}
          </h2>
        </div>
        <span className={`rounded-full px-4 py-2 text-label-sm font-semibold ${stageStyle}`}>
          {isStage ? "Menopause stage estimate" : `${riskLevel} pattern`}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        {isStage
          ? `The model matched your answers most closely with the ${riskLevel} stage.`
          : `Your answers currently align most closely with a ${riskLevel.toLowerCase()} pattern in the AI model.`}
      </p>
    </section>
  )
}

export function XAIContributionChart({ factors }) {
  const chartFactors = factors
    .filter((factor) => Number(factor.contribution) > 0)
    .slice(0, 6)
  const maxContribution = chartFactors[0]?.contribution || 0

  if (!chartFactors.length) {
    return (
      <p className="rounded-xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant">
        There is no noticeable difference to show for individual answers in this result.
      </p>
    )
  }

  return (
    <div className="space-y-4" aria-label="Relative influence chart">
      {chartFactors.map((factor) => {
        const width = maxContribution
          ? Math.max(4, (factor.contribution / maxContribution) * 100)
          : 0
        const increases = [
          "moves_to_later_stage",
          "increases_risk",
        ].includes(factor.direction)

        return (
          <div key={factor.key}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold text-on-surface">{factor.feature}</span>
              <span className={increases ? "text-risk-high" : "text-[#52776e]"}>
                {directionLabel(factor.direction)}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-container-high"
              role="img"
              aria-label={`${factor.feature}: ${directionLabel(factor.direction)}, relative contribution ${Math.round(width)} percent`}
            >
              <div
                className={`h-full rounded-full ${increases ? "bg-risk-high" : "bg-risk-low"}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className="pt-1 text-xs leading-relaxed text-on-surface-variant">
        Bar lengths compare the influence of your answers with one another.
        They are not probabilities or percentages.
      </p>
    </div>
  )
}

export function XAIFactorCard({ factor }) {
  const increases = [
    "moves_to_later_stage",
    "increases_risk",
  ].includes(factor.direction)

  return (
    <article className="rounded-xl bg-surface-container-low p-4">
      <div className="flex items-start gap-3">
        <span
          className={`material-symbols-outlined mt-0.5 rounded-lg p-2 text-[19px] ${
            increases
              ? "bg-[#F5E1D7] text-risk-high"
              : "bg-[#E2E8D9] text-[#52776e]"
          }`}
          aria-hidden="true"
        >
          {["moves_to_later_stage", "increases_risk"].includes(factor.direction)
            ? "north_east"
            : ["moves_to_earlier_stage", "decreases_risk"].includes(factor.direction)
              ? "south_east"
              : "remove"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-on-surface">{factor.feature}</h3>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-on-surface-variant">
              {influenceLabel(factor.impact)}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-on-surface-variant">
            Your answer: {formatValue(factor)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {factorExplanation(factor)}
          </p>
        </div>
      </div>
    </article>
  )
}

export function XAIFactorList({ title, factors, emptyText }) {
  return (
    <details className="group rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true">{title}</span>
          <span className="shrink-0 text-sm font-normal text-on-surface-variant">
            ({factors.length})
          </span>
        </span>
        <span className="material-symbols-outlined shrink-0 text-on-surface-variant transition-transform group-open:rotate-180" aria-hidden="true">
          expand_more
        </span>
      </summary>
      <div className="mt-4 space-y-3">
        {factors.length ? (
          factors.map((factor) => (
            <XAIFactorCard key={factor.key} factor={factor} />
          ))
        ) : (
          <p className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
            {emptyText}
          </p>
        )}
      </div>
    </details>
  )
}

export function XAIExplanation({ method }) {
  return (
    <div className="space-y-4">
      <details className="group rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-headline-md text-headline-md text-plum-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span>How does the AI work?</span>
          <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180" aria-hidden="true">
            expand_more
          </span>
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-on-surface-variant">
          <p>
            The AI looks at the answers you provided and compares them with
            patterns it learned from previous assessment data. It then estimates
            which category your answers most closely match.
          </p>
          <p>
            The explanation shows which of your answers changed the model’s
            estimate the most. These influences describe how the AI responded
            to your answers; they do not show that an answer caused the result.
          </p>
        </div>
      </details>

      <details className="group rounded-2xl bg-white p-5 shadow-sm border border-outline-variant/30 md:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span>Technical details</span>
          <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180" aria-hidden="true">
            expand_more
          </span>
        </summary>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-on-surface-variant">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container-low p-4">
              <dt className="text-xs">Model</dt>
              <dd className="mt-1 font-semibold text-on-surface">Random Forest Classifier</dd>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <dt className="text-xs">Inputs</dt>
              <dd className="mt-1 font-semibold text-on-surface">16 assessment features</dd>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4 sm:col-span-2">
              <dt className="text-xs">Explanation method</dt>
              <dd className="mt-1 font-semibold text-on-surface">Local sensitivity comparison</dd>
            </div>
          </dl>
          <p>
            {method ||
              "For each answer, the system compares the current model estimate with estimates produced when that answer is replaced with other values observed in the training data. The difference helps describe how strongly that answer influenced this result."}
          </p>
          <p className="font-semibold text-on-surface">
            This explains model behavior; it does not prove causation.
          </p>
        </div>
      </details>
    </div>
  )
}

export function XAIInsight({ text }) {
  return (
    <section className="rounded-2xl bg-primary p-6 text-white shadow-sm md:p-7">
      <div className="flex items-center gap-2 text-[#e8e2cf]">
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
          auto_awesome
        </span>
        <p className="text-label-sm uppercase tracking-[0.12em] font-semibold">
          Your personalized insight
        </p>
      </div>
      <p className="mt-4 font-headline-md text-headline-md leading-snug">{text}</p>
    </section>
  )
}

export function XAIDisclaimer() {
  return (
    <aside className="flex items-start gap-3 rounded-2xl bg-surface-container-high p-5 text-sm leading-relaxed text-on-surface-variant">
      <span className="material-symbols-outlined mt-0.5 text-tertiary" aria-hidden="true">
        health_and_safety
      </span>
      <p>
        <strong className="text-on-surface">Important: </strong>
        This AI result is for informational purposes only. It is not a medical
        diagnosis and should not replace advice from a qualified healthcare
        professional.
      </p>
    </aside>
  )
}

export function XAITakeaway() {
  return (
    <section className="rounded-2xl bg-surface-container-high p-5 md:p-6">
      <h2 className="font-headline-md text-headline-md text-plum-deep">
        What should I take from this?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        Your AI result is based on patterns in the answers you provided. This
        explanation helps you understand which answers influenced the model most.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
        Use it as a guide to understanding your assessment, not as a medical diagnosis.
      </p>
    </section>
  )
}
