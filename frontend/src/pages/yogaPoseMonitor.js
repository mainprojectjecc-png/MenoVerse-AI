const poseProfiles = {
  "Cat-Cow Pose": {
    durationMinutes: 3,
    camera: "Place the camera at hip height from the side. Keep your head, hands, hips, and knees in frame.",
    landmarks: [11, 15, 23, 25],
    positive: "Your hands and knees look stacked. Keep moving gently with your breath.",
    checks: (points) => [
      [Math.abs(points[15].x - points[11].x) < 0.2, "Bring your wrists closer beneath your shoulders."],
      [Math.abs(points[25].x - points[23].x) < 0.2, "Bring your knees closer beneath your hips."],
    ],
  },
  "Child's Pose": {
    durationMinutes: 3,
    camera: "Use a side view and keep your head, hips, knees, and feet visible.",
    landmarks: [0, 11, 23, 27],
    positive: "Your head and hips look relaxed. Stay within a comfortable range.",
    checks: (points) => [
      [Math.hypot(points[23].x - points[27].x, points[23].y - points[27].y) < 0.38, "Move your hips gently toward your heels, or add support beneath your torso."],
      [points[0].y > points[11].y - 0.08, "Let your head rest in line with your arms; avoid lifting or straining your neck."],
    ],
  },
  "Sphinx Pose": {
    durationMinutes: 3,
    camera: "Use a side view so the camera can see your shoulders, elbows, wrists, and hips.",
    landmarks: [11, 13, 15, 23],
    positive: "Your forearms and chest position look steady. Keep the lift easy.",
    checks: (points) => [
      [Math.abs(points[13].x - points[11].x) < 0.22, "Bring your elbows closer beneath your shoulders."],
      [points[11].y < points[23].y + 0.04, "Lengthen through your spine and lower your chest if your lower back feels compressed."],
    ],
  },
  "Bridge Pose": {
    durationMinutes: 3,
    camera: "Use a side view and keep your shoulders, hips, knees, and feet visible.",
    landmarks: [11, 23, 25, 27],
    positive: "Your hips are lifted in a controlled bridge. Keep your knees pointing forward and breathe easily.",
    checks: (points) => [
      [points[23].y < points[25].y + 0.02, "Press through your feet and lift your hips only to a comfortable height."],
      [Math.abs(points[25].x - points[27].x) < 0.24, "Keep your knees above your ankles and avoid letting them fall inward."],
    ],
  },
  "Legs Up the Wall": {
    durationMinutes: 3,
    camera: "Use a side view and include your shoulders, hips, knees, and ankles in frame.",
    landmarks: [11, 23, 25, 27],
    positive: "Your legs appear lifted. Keep your back and breathing comfortable.",
    checks: (points) => [
      [Math.abs(points[11].y - points[23].y) < 0.24, "Settle your shoulders and hips comfortably on the floor; use a folded blanket for support."],
      [points[27].y < points[23].y + 0.08 && Math.abs(points[27].x - points[23].x) < 0.48, "Guide your legs upward or bend your knees. Move farther from the wall if you feel strain."],
    ],
  },
  "Reclined Bound Angle": {
    durationMinutes: 3,
    camera: "A front or diagonal view works best. Keep your shoulders, hips, knees, and ankles visible.",
    landmarks: [11, 12, 23, 24, 25, 26, 27, 28],
    positive: "Your reclined position looks relaxed. Let props support your thighs.",
    checks: (points) => [
      [Math.abs(((points[11].y + points[12].y) / 2) - ((points[23].y + points[24].y) / 2)) < 0.24, "Settle your upper back and hips onto your support."],
      [Math.abs(points[25].x - points[26].x) > Math.abs(points[23].x - points[24].x) + 0.06, "Let your knees open only as far as comfortable; support each thigh with a cushion."],
    ],
  },
  "Cobra Pose": {
    durationMinutes: 3,
    camera: "Use a side view so your shoulders, elbows, wrists, hips, and lower body are visible.",
    landmarks: [11, 13, 15, 23],
    positive: "Your chest lift looks controlled. Keep your shoulders relaxed and elbows soft.",
    checks: (points) => [
      [angleAt(points[11], points[13], points[15]) > 85, "Keep your elbows softly bent instead of locking your arms."],
      [points[11].y < points[23].y + 0.04, "Lift only as high as comfortable and lengthen through your lower back."],
    ],
  },
  "Standing Forward Fold": {
    durationMinutes: 3,
    camera: "Use a side view and keep your shoulders, hips, knees, and ankles in frame.",
    landmarks: [11, 23, 25, 27],
    positive: "Your fold looks controlled. Keep a soft bend in your knees.",
    checks: (points) => [
      [angleAt(points[11], points[23], points[25]) < 155, "Hinge gently from your hips; bend your knees more if needed."],
      [angleAt(points[23], points[25], points[27]) > 125, "Keep your knees soft rather than dropping into a squat."],
    ],
  },
  "Seated Twist": {
    durationMinutes: 3,
    camera: "Use a diagonal view and keep your shoulders, hips, and bent legs visible.",
    landmarks: [11, 23, 25, 27],
    positive: "Your seated posture looks upright. A single camera view cannot reliably measure spinal rotation, so keep the twist gentle.",
    checks: (points) => [
      [angleAt(points[23], points[25], points[27]) < 145, "Sit on a cushion or bend your knees so the seated position feels supported."],
      [angleAt(points[11], points[23], points[25]) > 45, "Lengthen your spine before rotating; avoid pulling yourself deeper into the twist."],
    ],
  },
  "Warrior II Pose": {
    durationMinutes: 3,
    camera: "Face the camera and step back far enough to show both hands and feet.",
    landmarks: [11, 12, 15, 16, 23, 24, 25, 26, 27, 28],
    positive: "Your arms look extended and your stance is set. Keep your front knee tracking with your toes.",
    checks: (points) => [
      [Math.abs(points[15].y - points[11].y) < 0.22 && Math.abs(points[16].y - points[12].y) < 0.22, "Reach both arms out around shoulder height and relax your shoulders."],
      [Math.min(angleAt(points[23], points[25], points[27]), angleAt(points[24], points[26], points[28])) < 158, "Bend the front knee gently and keep it pointing in the same direction as your toes."],
    ],
  },
  "Supine Twist": {
    durationMinutes: 3,
    camera: "Use a side or diagonal view and keep your shoulders, hips, knees, and ankles visible.",
    landmarks: [11, 23, 25, 27],
    positive: "Your reclined position looks settled. A single camera cannot reliably measure the twist depth; keep both shoulders comfortable.",
    checks: (points) => [
      [Math.abs(points[11].y - points[23].y) < 0.25, "Let your upper back and hips rest comfortably on the floor."],
      [angleAt(points[23], points[25], points[27]) < 150, "Bend your knees and reduce the twist range if your back feels strained."],
    ],
  },
}

function isVisible(point) {
  return Boolean(point)
    && Number.isFinite(point.x)
    && Number.isFinite(point.y)
    && (point.visibility == null || point.visibility >= 0.45)
}

function angleAt(first, middle, last) {
  const firstAngle = Math.atan2(first.y - middle.y, first.x - middle.x)
  const lastAngle = Math.atan2(last.y - middle.y, last.x - middle.x)
  const difference = Math.abs(firstAngle - lastAngle) * 180 / Math.PI
  return difference > 180 ? 360 - difference : difference
}

export function getYogaPoseProfile(poseName) {
  return poseProfiles[poseName] || null
}

export function assessYogaPose(poseName, landmarks) {
  const profile = getYogaPoseProfile(poseName)
  if (!profile) return null

  if (profile.landmarks.some((index) => !isVisible(landmarks[index]))) {
    return {
      score: 0,
      feedback: `Pose landmarks are not clear yet. ${profile.camera}`,
    }
  }

  const checks = profile.checks(landmarks)
  const passedChecks = checks.filter(([passed]) => passed).length
  return {
    score: Math.round((passedChecks / checks.length) * 100),
    feedback: passedChecks === checks.length
      ? profile.positive
      : checks.find(([passed]) => !passed)[1],
  }
}