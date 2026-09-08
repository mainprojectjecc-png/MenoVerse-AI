import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ToggleRow({
  label,
  sub,
  defaultActive = false,
}) {
  const [active, setActive] =
    useState(defaultActive)

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

  function handleLogout() {
    localStorage.removeItem("user")
    navigate("/login", { replace: true })
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
              SJ
            </div>

            <div className="absolute bottom-1 right-1 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Pro
            </div>

          </div>


          {/* Details */}
          <div className="text-center md:text-left flex-1">

            <h1
              className="text-3xl text-plum-deep italic"
              style={{
                fontFamily: "Playfair Display",
              }}
            >
              Sarah J.
            </h1>

            <p className="text-on-surface-variant text-sm mt-1">
              Managing Perimenopause since 2022
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">

              <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
                Edit Profile
              </button>

              <button className="bg-surface-container-high text-primary px-6 py-2.5 rounded-xl text-sm font-semibold border border-outline-variant/30">
                Share Report
              </button>

            </div>

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
                  48
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
                  24.2
                </p>
                <span className="text-[10px] text-risk-low font-bold">
                  HEALTHY
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
                  Late
                </p>
              </div>

            </div>


            <div className="mt-7 pt-5 border-t border-outline-variant/30">

              <h3 className="text-sm italic mb-4">
                Medical History
              </h3>

              <div className="flex flex-wrap gap-2">

                <span className="px-4 py-1.5 bg-lavender-mist text-primary rounded-xl text-sm">
                  ✓ Thyroid (Managed)
                </span>

                <span className="px-4 py-1.5 bg-lavender-mist text-primary rounded-xl text-sm">
                  ✓ No Allergies
                </span>

                <button className="px-4 py-1.5 border border-dashed border-outline rounded-xl text-sm text-on-surface-variant">
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
                  MenoVerse Watch S3
                </p>

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 bg-risk-low rounded-full" />

                  <span className="text-xs text-on-surface-variant">
                    Connected
                  </span>

                </div>

              </div>

            </div>


            <div className="mt-6 pt-5 border-t border-outline-variant/20">

              <div className="flex justify-between text-sm mb-2">
                <span>Battery</span>
                <strong>82%</strong>
              </div>

              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">

                <div className="h-full bg-risk-low w-[82%]" />

              </div>

              <button className="w-full mt-4 py-3 text-primary text-sm font-semibold rounded-xl hover:bg-lavender-mist">
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
              onClick={handleLogout}
              className="text-risk-high text-sm font-semibold hover:underline">
              Log Out
            </button>

            <span>|</span>

            <button className="text-risk-high text-sm font-semibold hover:underline">
              Delete Data & Account
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}