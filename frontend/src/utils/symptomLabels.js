export function symptomSeverityLabel(value) {
  const labels = {
    0: "Not reported",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
  }

  return labels[Number(value)] || "Not reported"
}