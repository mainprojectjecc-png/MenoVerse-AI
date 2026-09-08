import { Link } from "react-router-dom"
import StatCard from "../components/StatCard"

function Dashboard() {
  const stored = localStorage.getItem("user")
  const firstName = stored ? JSON.parse(stored).Name?.split(" ")[0] : "there"

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">

      {/* MAIN CONTENT */}
      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-10">

        {/* GREETING */}
        <section className="mb-12">
          <h2 className="font-headline-xl text-headline-xl text-plum-deep mb-3">
            Good morning, {firstName}.
          </h2>

          <p className="text-on-surface-variant flex items-center gap-2 font-medium">
            <span
              className="material-symbols-outlined text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              spa
            </span>

            Today is Day 14 of your cycle

            <span className="text-tertiary font-bold">
              • Ovulation Window
            </span>
          </p>
        </section>


        {/* WEEKLY INSIGHTS */}
        <section className="mb-12">
          <div className="bg-primary text-white rounded-2xl p-8 md:p-10 relative overflow-hidden soft-shadow">

            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

            <div className="absolute left-1/4 -top-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />

            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">

              <div className="md:col-span-2">

                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary-container">
                    auto_awesome
                  </span>

                  <h3 className="font-headline-md text-headline-md">
                    Your Weekly Insights
                  </h3>
                </div>

                <p className="text-lavender-mist font-body-lg mb-8 leading-relaxed italic">
                  "Your skin temperature has spiked by 0.8°C over the last 3
                  nights, often a precursor to increased night sweat frequency."
                </p>

                <button
                  onClick={() =>
                    alert("AI report generation will be connected later.")
                  }
                  className="bg-white text-primary px-8 py-3.5 rounded-xl font-label-md hover:bg-lavender-mist transition-all flex items-center gap-3 active:scale-95 shadow-md"
                >
                  Generate AI Report

                  <span className="material-symbols-outlined text-[18px]">
                    auto_awesome
                  </span>
                </button>

              </div>


              <div className="hidden md:flex items-center justify-center">

                <div className="aspect-square w-full rounded-2xl bg-white/10 border-4 border-white/10 flex items-center justify-center">

                  <span className="material-symbols-outlined text-white/60 text-6xl">
                    wb_twilight
                  </span>

                </div>

              </div>

            </div>
          </div>
        </section>


        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

          {/* RISK ASSESSMENT */}
          <div className="md:col-span-5 bg-surface rounded-2xl p-8 soft-shadow border border-outline-variant/20 flex flex-col justify-between">

            <div>

              <div className="flex justify-between items-start mb-8">

                <span className="font-label-md text-primary uppercase tracking-[0.1em] font-bold">
                  Risk Assessment
                </span>

                <div className="bg-risk-high/10 p-2 rounded-full">
                  <span className="material-symbols-outlined text-risk-high">
                    error
                  </span>
                </div>

              </div>


              <h3 className="font-headline-md text-headline-md text-plum-deep mb-8">
                Perimenopause Risk Level
              </h3>


              <div className="flex flex-col items-center py-6">

                <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-surface-container-high/50 mb-6">

                  <svg className="absolute inset-0 w-full h-full -rotate-90">

                    <circle
                      className="text-outline-variant/30"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                    />

                    <circle
                      className="text-risk-high"
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="70"
                      stroke="currentColor"
                      strokeDasharray="440"
                      strokeDashoffset="66"
                      strokeLinecap="round"
                      strokeWidth="8"
                    />

                  </svg>


                  <div className="text-center">

                    <span className="font-headline-lg text-risk-high text-[44px]">
                      85
                    </span>

                    <p className="text-label-sm font-bold text-on-surface-variant">
                      /100
                    </p>

                  </div>

                </div>


                <div className="bg-risk-high text-white px-8 py-2.5 rounded-full font-label-md shadow-sm">
                  High Likelihood
                </div>

              </div>

            </div>


            <div className="mt-8 p-5 bg-risk-high/5 rounded-2xl border border-risk-high/10 italic">

              <p className="text-body-md text-on-surface leading-relaxed">
                <strong>Recommendation:</strong> Based on your elevated
                symptoms and hormone trends, we recommend consulting a
                healthcare professional for further clinical evaluation.
              </p>

            </div>

          </div>


          {/* RIGHT SIDE CARDS */}
          <div className="md:col-span-7 space-y-gutter">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">

              {/* HEART RATE */}
              <StatCard
                icon="favorite"
                tone="risk-high"
                label="Heart Rate"
                value="78"
                unit="bpm"
                bars={[
                  { height: 50, opacity: 0.3 },
                  { height: 67, opacity: 0.5 },
                  { height: 33, opacity: 0.3 },
                  { height: 75, opacity: 0.7 },
                  { height: 67, opacity: 0.4 },
                  { height: 100, opacity: 1 },
                ]}
              />

              {/* SLEEP */}
              <StatCard
                icon="nights_stay"
                tone="primary"
                label="Sleep"
                value="7h 20m"
                barsContained={false}
                bars={[
                  { height: 40, opacity: 0.2 },
                  { height: 60, opacity: 0.4 },
                  { height: 85, opacity: 0.8 },
                  { height: 50, opacity: 0.5 },
                  { height: 30, opacity: 0.2 },
                  { height: 70, opacity: 0.6 },
                ]}
              />

            </div>


            {/* DAILY STEPS */}
            <StatCard
              variant="wide"
              icon="footprint"
              tone="risk-low"
              label="Daily Steps"
              value="4,526"
              progress={45}
              progressLabel="Goal: 10,000"
            />


            {/* QUICK LOG SYMPTOMS */}
            <div className="bg-surface rounded-2xl p-8 soft-shadow border-2 border-primary/10">

              <div className="flex justify-between items-center mb-6">

                <h4 className="font-headline-md text-plum-deep italic">
                  Quick Log Symptoms
                </h4>

                <Link
                  to="/symptoms"
                  className="text-primary font-label-md hover:underline decoration-2 underline-offset-4"
                >
                  View History
                </Link>

              </div>


              <div className="flex flex-wrap gap-4">

                <Link
                  to="/symptoms"
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    wb_sunny
                  </span>
                  Hot Flashes
                </Link>


                <Link
                  to="/symptoms"
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    sentiment_dissatisfied
                  </span>
                  Mood Changes
                </Link>


                <Link
                  to="/symptoms"
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    battery_alert
                  </span>
                  Fatigue
                </Link>


                <Link
                  to="/symptoms"
                  className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    nights_stay
                  </span>
                  Night Sweats
                </Link>


                <Link
                  to="/symptoms"
                  className="bg-primary text-white flex items-center justify-center w-12 h-12 rounded-xl active:scale-95 transition-all shadow-md"
                  aria-label="Add symptom"
                >
                  <span className="material-symbols-outlined">
                    add
                  </span>
                </Link>

              </div>

            </div>

          </div>
        </div>


        {/* MENO VERSE WATCH */}
        <section className="mt-12">

          <div className="bg-surface-container-high rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 soft-shadow border border-white/50">

            <div className="text-center md:text-left flex-1">

              <h3 className="font-headline-md text-plum-deep mb-2">
                MenoVerse Watch S3
              </h3>

              <p className="text-on-surface-variant text-label-md mb-8 flex items-center justify-center md:justify-start gap-2 font-medium">

                <span className="w-2.5 h-2.5 rounded-full bg-risk-low shadow-[0_0_8px_rgba(132,165,157,0.6)]" />

                Connected &amp; Monitoring

              </p>


              <div className="flex gap-8 justify-center md:justify-start">

                <div className="flex flex-col items-center">

                  <span className="material-symbols-outlined text-primary mb-2 text-[28px]">
                    battery_charging_90
                  </span>

                  <span className="text-label-sm font-bold">
                    92%
                  </span>

                </div>


                <div className="flex flex-col items-center">

                  <span className="material-symbols-outlined text-primary mb-2 text-[28px]">
                    sync
                  </span>

                  <span className="text-label-sm font-bold">
                    Synced
                  </span>

                </div>

              </div>

            </div>


            <div className="w-full md:w-64 aspect-[4/3] bg-surface rounded-2xl flex items-center justify-center p-6 shadow-inner border border-outline-variant/10">

              <span className="material-symbols-outlined text-primary text-6xl">
                watch
              </span>

            </div>

          </div>

        </section>

      </main>


      {/* FLOATING VOICE JOURNAL BUTTON */}
      <div className="fixed bottom-28 right-6 md:bottom-12 md:right-12 z-40">

        <Link
          to="/journal"
          className="bg-tertiary text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          aria-label="Voice Journal"
        >

          <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
            mic
          </span>

        </Link>

      </div>

    </div>
  )
}

export default Dashboard