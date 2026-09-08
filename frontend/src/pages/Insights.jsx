import { Link } from "react-router-dom"

export default function Insights() {
  return (
    <div className="min-h-screen bg-[#fff9e8] text-[#3F3D35] pb-24 md:pb-0">

      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-10">

        {/* PAGE HEADER */}
        <section>
          <h2
            className="text-[36px] font-bold text-[#3F3D35]"
            style={{ fontFamily: "Playfair Display" }}
          >
            Your Health Insights
          </h2>

          <p className="text-[#464740] mt-2">
            Personalized patterns from your logs and wearables
          </p>
        </section>

        {/* AI WEEKLY REPORT */}
        <div className="bg-[#535845] text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#e8e2cf]">
                auto_awesome
              </span>

              <span className="text-xs tracking-widest uppercase font-bold text-[#e8e2cf]">
                AI Generated
              </span>
            </div>

            <h3
              className="text-2xl italic mb-4"
              style={{ fontFamily: "Playfair Display" }}
            >
              Hormonal Shift Detected
            </h3>

            <p className="text-[#e8e2cf]/80 leading-relaxed mb-6">
              "Your sleep disruptions increased 40% during late luteal phase.
              Combined with temperature spikes, this suggests progesterone
              sensitivity."
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                Sleep • High
              </span>

              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                Temp • +0.8°C
              </span>
            </div>
          </div>
        </div>

        {/* PATTERN CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* HOT FLASH PATTERN */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D1CEC0]/20">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#BC6C4D]">
                local_fire_department
              </span>

              Hot Flash Pattern
            </h4>

            <p className="text-sm text-[#464740] mt-3">
              Most frequent between 2-4 PM, triggered by caffeine. Try
              reducing intake after 1 PM.
            </p>

            <div className="mt-6 h-20 flex items-end gap-1.5">
              <div className="flex-1 bg-[#BC6C4D]/20 h-[30%] rounded-full" />
              <div className="flex-1 bg-[#BC6C4D]/40 h-[60%] rounded-full" />
              <div className="flex-1 bg-[#BC6C4D] h-[90%] rounded-full" />
              <div className="flex-1 bg-[#BC6C4D]/30 h-[40%] rounded-full" />
              <div className="flex-1 bg-[#BC6C4D]/50 h-[70%] rounded-full" />
            </div>
          </div>

          {/* SLEEP QUALITY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D1CEC0]/20">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6B705C]">
                bedtime
              </span>

              Sleep Quality
            </h4>

            <p className="text-sm text-[#464740] mt-3">
              Average 6h 45m this week. Deep sleep improved after logging
              evening walks.
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2">
                <span>Goal 8h</span>

                <span className="font-bold">
                  84%
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#FAF7F0] rounded-full">
                <div
                  className="h-full bg-[#6B705C] rounded-full"
                  style={{ width: "84%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D1CEC0]/20">
          <h4 className="font-semibold mb-6">
            Recommendations
          </h4>

          <div className="space-y-4">

            {/* RECOMMENDATION 1 */}
            <div className="flex gap-4 p-4 bg-[#fff9e8] rounded-xl">
              <span className="w-8 h-8 bg-[#6B705C] text-white rounded-full flex items-center justify-center text-sm shrink-0">
                1
              </span>

              <p className="text-sm">
                Consider magnesium glycinate before bed - your sleep data
                shows improvement potential.
              </p>
            </div>

            {/* RECOMMENDATION 2 */}
            <div className="flex gap-4 p-4 bg-[#fff9e8] rounded-xl">
              <span className="w-8 h-8 bg-[#6B705C] text-white rounded-full flex items-center justify-center text-sm shrink-0">
                2
              </span>

              <p className="text-sm">
                Schedule walk 30 mins after lunch - correlates with 20% less
                fatigue in your logs.
              </p>
            </div>

          </div>
        </div>

        {/* BACK TO DASHBOARD */}
        <div className="flex justify-center pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#6B705C] font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>

            Back to Dashboard
          </Link>
        </div>

      </main>
    </div>
  )
}