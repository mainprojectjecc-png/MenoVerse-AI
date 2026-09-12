import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Symptoms() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    hotFlashes: "none",
    sleep: "none",
    mood: "none",
    fatigue: "none",
    headache: "none",
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const severityToNumber = (value) => {
    switch (value) {
      case "mild":
        return 1
      case "moderate":
        return 2
      case "severe":
        return 3
      default:
        return 0
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null")

      if (!user?.UserID) {
        setError("Please log in again.")
        return
      }

      await api.post("/symptoms", {
        UserID: user.UserID,
        LogDate: new Date().toISOString().split("T")[0],
        HotFlashes: severityToNumber(formData.hotFlashes),
        Mood: formData.mood,
        SleepQuality: formData.sleep,
        Fatigue: severityToNumber(formData.fatigue),
        Headache: severityToNumber(formData.headache),
      })

      navigate("/dashboard")
    } catch (err) {
      console.error("Failed to save symptoms:", err)
      setError(
        err.response?.data?.detail ||
          "Failed to save symptoms. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  const symptoms = [
    {
      key: "hotFlashes",
      label: "Hot Flashes",
      sub: "Intensity",
      icon: "device_thermostat",
    },
    {
      key: "sleep",
      label: "Sleep Quality",
      sub: "Disruptions",
      icon: "bedtime",
    },
    {
      key: "mood",
      label: "Mood",
      sub: "Fluctuations",
      icon: "mood",
    },
    {
      key: "fatigue",
      label: "Fatigue",
      sub: "Energy Levels",
      icon: "psychology",
    },
    {
      key: "headache",
      label: "Headache",
      sub: "Intensity",
      icon: "sick",
    },
  ]

  return (
    <div className="min-h-screen bg-[#fff9e8]">
      <main className="max-w-[900px] mx-auto px-6 lg:px-8 py-8 lg:py-10">

        <section className="mb-7">
          <h1
            className="
              text-[30px]
              md:text-[34px]
              font-semibold
              text-[#3F3D35]
            "
            style={{
              fontFamily: "Playfair Display",
            }}
          >
            How are you feeling today?
          </h1>

          <p className="text-sm text-[#464740] mt-2">
            Log your symptoms to help MenoVerse understand your patterns.
          </p>
        </section>

        <div className="flex flex-col gap-3">

          {symptoms.map((item) => (
            <article
              key={item.key}
              className="
                bg-[#faf4df]
                rounded-2xl
                p-4
                md:p-5
                flex
                items-center
                justify-between
                gap-4
                border
                border-[#eee5c9]
                shadow-sm
              "
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <span className="material-symbols-outlined">
                    {item.icon}
                  </span>
                </div>

                <div>
                  <h3 className="text-[15px] font-semibold">
                    {item.label}
                  </h3>

                  <p className="text-xs text-[#464740]">
                    {item.sub}
                  </p>
                </div>
              </div>

              <select
                value={formData[item.key]}
                onChange={(e) =>
                  handleChange(item.key, e.target.value)
                }
                className="
                  bg-white
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  min-w-[115px]
                  cursor-pointer
                  shrink-0
                "
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </article>
          ))}

          {error && (
            <div className="bg-red-100 text-red-700 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              w-full
              bg-[#535845]
              hover:bg-[#464a3a]
              disabled:opacity-60
              disabled:cursor-not-allowed
              text-white
              font-semibold
              py-4
              rounded-2xl
              mt-3
              transition
            "
          >
            {saving ? "Saving..." : "Save Entry"}
          </button>

        </div>
      </main>
    </div>
  )
}