import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function ToggleRow({
  label,
  sub,
  defaultActive = false,
}) {
  const [active, setActive] = useState(defaultActive)

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-plum-deep font-semibold">
          {label}
        </p>

        <p className="text-xs text-on-surface-variant">
          {sub}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActive((value) => !value)}
        className={`
          w-10
          h-6
          rounded-full
          relative
          flex
          items-center
          px-1
          transition-colors
          shrink-0
          ${
            active
              ? "bg-primary"
              : "bg-outline-variant"
          }
        `}
      >
        <div
          className={`
            w-4
            h-4
            bg-white
            rounded-full
            transition-transform
            ${
              active
                ? "translate-x-4"
                : "translate-x-0"
            }
          `}
        />
      </button>
    </div>
  )
}

function PrivacyLink({ icon, label }) {
  return (
    <button
      type="button"
      className="
        w-full
        flex
        items-center
        justify-between
        p-3
        rounded-xl
        hover:bg-surface-container-high
        transition
      "
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant">
          {icon}
        </span>

        <span className="text-sm text-plum-deep font-semibold">
          {label}
        </span>
      </div>

      <span className="material-symbols-outlined text-outline">
        chevron_right
      </span>
    </button>
  )
}

export default function Profile() {
  const navigate = useNavigate()

  const stored = localStorage.getItem("user")
  const user = stored ? JSON.parse(stored) : null

  const name = user?.Name || "User"
  const email = user?.Email || ""
  const age = user?.Age || ""

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editEmail, setEditEmail] = useState(email)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  function handleLogout() {
    localStorage.removeItem("user")
    navigate("/login", { replace: true })
  }

  function handleEdit() {
    setEditName(name)
    setEditEmail(email)
    setSaveError("")
    setEditing(true)
  }

  function handleCancel() {
    setEditName(name)
    setEditEmail(email)
    setSaveError("")
    setEditing(false)
  }

  async function handleSaveProfile() {
    if (!user?.UserID) {
      setSaveError("User information not found. Please log in again.")
      return
    }

    if (!editName.trim()) {
      setSaveError("Name cannot be empty.")
      return
    }

    if (!editEmail.trim()) {
      setSaveError("Email cannot be empty.")
      return
    }

    setSaving(true)
    setSaveError("")

    try {
      const updateData = {
  Name: editName.trim(),
  Email: editEmail.trim(),
}

if (
  user?.Age !== undefined &&
  user?.Age !== null &&
  user?.Age !== ""
) {
  updateData.Age = Number(user.Age)
}

const response = await api.put(
  `/users/${user.UserID}`,
  updateData
)

      const updatedUser = {
        ...user,
        Name: response.data.Name,
        Email: response.data.Email,
        Age: response.data.Age,
      }

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      )

      setEditing(false)

      window.location.reload()
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      )
const detail = error.response?.data?.detail

if (Array.isArray(detail)) {
  setSaveError(
    detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(", ")
  )
} else {
  setSaveError(
    detail ||
      "Failed to update profile. Please try again."
  )
}
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <main className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">

        {/* =================================================
            PROFILE HEADER
        ================================================== */}

        <section
          className="
            bg-surface
            rounded-2xl
            p-6
            shadow-sm
            border
            border-outline-variant/20
            flex
            flex-col
            md:flex-row
            items-center
            gap-6
          "
        >
          {/* Avatar */}

          <div className="relative shrink-0">
            <div
              className="
                w-28
                h-28
                rounded-full
                bg-primary-container
                flex
                items-center
                justify-center
                text-on-primary-container
                text-3xl
                font-bold
              "
            >
              {initials}
            </div>

            <div className="absolute bottom-1 right-1 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Pro
            </div>
          </div>

          {/* Profile Details */}

          <div className="text-center md:text-left flex-1">

            {editing ? (
              <div className="space-y-4 text-left">

                <div>
                  <label className="block text-sm font-semibold text-plum-deep mb-1">
                    Name
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="
                      w-full
                      border
                      border-outline-variant
                      rounded-xl
                      px-4
                      py-2.5
                      bg-surface
                      outline-none
                      focus:ring-2
                      focus:ring-primary/30
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-plum-deep mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) =>
                      setEditEmail(e.target.value)
                    }
                    className="
                      w-full
                      border
                      border-outline-variant
                      rounded-xl
                      px-4
                      py-2.5
                      bg-surface
                      outline-none
                      focus:ring-2
                      focus:ring-primary/30
                    "
                  />
                </div>

                {saveError && (
                  <p className="text-sm text-risk-high font-semibold">
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="
                      bg-surface-container-high
                      text-primary
                      px-6
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="
                      bg-primary
                      text-white
                      px-6
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      disabled:opacity-50
                    "
                  >
                    {saving
                      ? "Saving..."
                      : "Save Profile"}
                  </button>

                </div>
              </div>
            ) : (
              <>
                <h1
                  className="text-3xl text-plum-deep italic"
                  style={{
                    fontFamily: "Playfair Display",
                  }}
                >
                  {name}
                </h1>

                <p className="text-on-surface-variant text-sm mt-1">
                  {email}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="
                      bg-primary
                      text-white
                      px-6
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>

                    Edit Profile
                  </button>

                  <button
                    type="button"
                    className="
                      bg-surface-container-high
                      text-primary
                      px-6
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      border
                      border-outline-variant/30
                    "
                  >
                    Share Report
                  </button>

                </div>
              </>
            )}

          </div>
        </section>


        {/* =================================================
            HEALTH + DEVICE
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

          {/* Health Profile */}

          <section className="lg:col-span-8 bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/20">

            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">

              <h2
                className="text-xl text-primary italic flex items-center gap-2"
                style={{
                  fontFamily: "Playfair Display",
                }}
              >
                <span className="material-symbols-outlined">
                  clinical_notes
                </span>

                Health Profile
              </h2>

              <span className="hidden sm:block text-xs text-on-surface-variant px-3 py-1 bg-surface-container-high rounded-full">
                Last synced: Today
              </span>

            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">

              <div className="bg-surface-container-high p-4 rounded-xl text-center">
                <span className="text-xs text-on-surface-variant">
                  Age
                </span>

                <p
                  className="text-xl text-plum-deep"
                  style={{
                    fontFamily: "Playfair Display",
                  }}
                >
                  {age || "—"}
                </p>
              </div>

              <div className="bg-surface-container-high p-4 rounded-xl text-center">

                <span className="text-xs text-on-surface-variant">
                  BMI
                </span>

                <p
                  className="text-xl text-plum-deep"
                  style={{
                    fontFamily: "Playfair Display",
                  }}
                >
                  —
                </p>

                <span className="text-[10px] text-on-surface-variant font-bold">
                  No data
                </span>

              </div>

              <div className="bg-surface-container-high p-4 rounded-xl text-center">

                <span className="text-xs text-on-surface-variant">
                  Cycle Phase
                </span>

                <p
                  className="text-xl text-plum-deep"
                  style={{
                    fontFamily: "Playfair Display",
                  }}
                >
                  —
                </p>

                <span className="text-[10px] text-on-surface-variant font-bold">
                  No data
                </span>

              </div>

            </div>

            <div className="mt-7 pt-5 border-t border-outline-variant/30">

              <h3 className="text-sm italic mb-4">
                Medical History
              </h3>

              <div className="flex flex-wrap gap-2">

                <span className="px-4 py-1.5 bg-lavender-mist text-primary rounded-xl text-sm">
                  No medical history recorded
                </span>

                <button
                  type="button"
                  className="px-4 py-1.5 border border-dashed border-outline rounded-xl text-sm text-on-surface-variant"
                >
                  + Add Condition
                </button>

              </div>

            </div>

          </section>


          {/* Device */}

          <section className="lg:col-span-4 bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/20">

            <h2
              className="text-xl text-primary italic flex items-center gap-2"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              <span className="material-symbols-outlined">
                watch_later
              </span>

              Device Sync
            </h2>

            <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl mt-6">

              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">
                  watch
                </span>
              </div>

              <div>

                <p className="text-sm text-plum-deep font-semibold">
                  No device connected
                </p>

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 bg-outline rounded-full" />

                  <span className="text-xs text-on-surface-variant">
                    No data available
                  </span>

                </div>

              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-outline-variant/20">

              <div className="flex justify-between text-sm mb-2">
                <span>Battery</span>
                <strong>—</strong>
              </div>

              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full w-0" />
              </div>

              <button
                type="button"
                className="w-full mt-4 py-3 text-primary text-sm font-semibold rounded-xl hover:bg-lavender-mist"
              >
                Sync Data Now
              </button>

            </div>

          </section>


          {/* Notifications */}

          <section className="lg:col-span-6 bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/20">

            <h2
              className="text-xl text-primary italic flex items-center gap-2 mb-6"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              <span className="material-symbols-outlined">
                notifications_active
              </span>

              Notifications
            </h2>

            <div className="space-y-5">

              <ToggleRow
                label="Symptom Log Reminders"
                sub="Daily at 8:00 PM"
                defaultActive
              />

              <ToggleRow
                label="AI Insight Alerts"
                sub="Immediate notifications for trends"
                defaultActive
              />

              <ToggleRow
                label="Weekly Summary"
                sub="Monday mornings"
              />

            </div>

          </section>


          {/* Privacy */}

          <section className="lg:col-span-6 bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/20">

            <h2
              className="text-xl text-primary italic flex items-center gap-2 mb-4"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              <span className="material-symbols-outlined">
                lock_person
              </span>

              Privacy
            </h2>

            <div>

              <PrivacyLink
                icon="database"
                label="Data Export (JSON/PDF)"
              />

              <PrivacyLink
                icon="encrypted"
                label="Biometric Lock"
              />

              <PrivacyLink
                icon="partner_exchange"
                label="Third-party Sharing"
              />

            </div>

          </section>

        </div>


        {/* =================================================
            ACCOUNT ACTIONS
        ================================================== */}

        <section className="mt-6 mb-8 bg-risk-high/5 border border-risk-high/20 rounded-2xl p-6 text-center">

          <h3 className="text-xs text-risk-high uppercase tracking-widest font-bold">
            Account Actions
          </h3>

          <div className="flex justify-center gap-6 mt-4">

            <button
              type="button"
              onClick={handleLogout}
              className="text-risk-high text-sm font-semibold hover:underline"
            >
              Log Out
            </button>

            <span>|</span>

            <button
              type="button"
              className="text-risk-high text-sm font-semibold hover:underline"
            >
              Delete Data & Account
            </button>

          </div>

        </section>

      </main>
    </div>
  )
}