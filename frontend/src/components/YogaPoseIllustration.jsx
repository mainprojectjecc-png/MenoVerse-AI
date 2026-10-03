import catCowPose from "../assets/poses/Gemini_Generated_Image_92vojy92vojy92vo.png"
import childsPose from "../assets/poses/Gemini_Generated_Image_d76oikd76oikd76o.png"
import bridgePose from "../assets/poses/Gemini_Generated_Image_gf25jggf25jggf25.png"
import legsUpWall from "../assets/poses/Gemini_Generated_Image_kvrw78kvrw78kvrw.png"
import reclinedBoundAngle from "../assets/poses/Gemini_Generated_Image_lba5aklba5aklba5.png"
import cobraPose from "../assets/poses/Gemini_Generated_Image_lb1z6klb1z6klb1z.png"
import forwardFold from "../assets/poses/Gemini_Generated_Image_lba5aklba5aklba5 (1).png"
import seatedTwist from "../assets/poses/Gemini_Generated_Image_pkp81cpkp81cpkp8.png"
import warriorPose from "../assets/poses/Gemini_Generated_Image_qa8xecqa8xecqa8x.png"
import supineTwist from "../assets/poses/Gemini_Generated_Image_ssi4mdssi4mdssi4.png"
import yogaFallback from "../assets/poses/Gemini_Generated_Image_yq89ejyq89ejyq89.png"

const poseArtwork = {
  "Cat-Cow Pose": { image: catCowPose },
  "Child's Pose": { image: childsPose },
  "Bridge Pose": { image: bridgePose },
  "Legs Up the Wall": { image: legsUpWall },
  "Reclined Bound Angle": { image: reclinedBoundAngle },
  "Cobra Pose": { image: cobraPose },
  "Standing Forward Fold": { image: forwardFold },
  "Seated Twist": { image: seatedTwist },
  "Warrior II Pose": { image: warriorPose },
  "Supine Twist": { image: supineTwist },
}

const poseArtworkFallback = {
  head: [27, 39],
  body: "M31 42 Q47 34 68 40 L79 43 M34 43 L27 59 L25 75 M42 43 L39 58 L39 74 M76 43 L85 57 L86 73 M70 43 L77 57 L76 73",
}

export default function YogaPoseIllustration({ poseName }) {
  const artwork = poseArtwork[poseName] || { image: yogaFallback }

  if (artwork.image) {
    return (
      <img
        src={artwork.image}
        alt={`${poseName} pose illustration`}
        className="h-[86px] w-[112px] shrink-0 rounded-lg object-cover shadow-sm"
        loading="lazy"
        onError={(event) => {
          const fallback = event.currentTarget.parentElement?.querySelector("svg")
          if (fallback) {
            event.currentTarget.style.display = "none"
            fallback.style.display = "block"
          }
        }}
      />
    )
  }

  const [headX, headY] = poseArtworkFallback.head

  return (
    <svg
      viewBox="0 0 128 92"
      role="img"
      aria-label={`${poseName} pose illustration`}
      className="h-[86px] w-[112px] shrink-0 rounded-lg bg-[#edf1e8]"
    >
      <path d="M10 79 H118" stroke="#cfb994" strokeWidth="2" strokeLinecap="round" />
      <path d={poseArtworkFallback.body} fill="none" stroke="#354e49" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d={poseArtworkFallback.body} fill="none" stroke="#d5a17e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={headX} cy={headY} r="8" fill="#d5a17e" stroke="#354e49" strokeWidth="2" />
      <path d={`M${headX - 7} ${headY - 2} Q${headX - 4} ${headY - 11} ${headX + 4} ${headY - 8} Q${headX + 10} ${headY - 5} ${headX + 6} ${headY + 1}`} fill="#354e49" />
      <circle cx={headX + 3} cy={headY} r="0.8" fill="#354e49" />
      <path d={`M${headX + 4} ${headY + 4} q2 1 3 0`} fill="none" stroke="#a66452" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}