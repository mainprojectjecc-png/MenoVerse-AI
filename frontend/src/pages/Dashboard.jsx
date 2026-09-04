import BottomNav from "../components/BottomNav"
import { Link } from "react-router-dom"
import { useState } from "react"

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">

      {/* TOP NAVIGATION */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 w-full flex items-center justify-between px-margin-mobile py-5 md:px-margin-desktop border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="text-primary hover:scale-110 transition-transform" aria-label="Open menu">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <Link to="/dashboard" className="font-headline-md text-headline-md text-primary italic">
            MenoVerse AI
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-8 mr-8">
            <Link to="/dashboard" className="font-label-md text-primary font-bold border-b-2 border-primary pb-1">Home</Link>
            <Link to="/cycle" className="font-label-md text-on-surface-variant hover:text-primary transition-colors">Tracking</Link>
            <Link to="/insights" className="font-label-md text-on-surface-variant hover:text-primary transition-colors">Insights</Link>
          </nav>
          <button className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm" aria-label="Profile">
            <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC5p4CdH1Quys6vmdRAY3SJtRyqMmhiX7jZRQOa5a1c411CMWfz33Zx2KHMYM-6QtCArjk7qIauw-RZrRNNPRmfOcKJr0SiRe3HxsdZS_T50EtysaWzyKI0e5UgJLBGREatiG7v0lONSYOBuT8SFFzlCJjG0fX87-8PCcRPt-Z1Hs8j75qFrT3XKG9KMoL8RxCVkAXPwT7f_-ln-nAaR02jxPMQo1IQVM-0HJjrYV6-y9DeAzqccJZOw" />
          </button>
        </div>
      </header>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}>
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline-md text-primary italic">MenoVerse AI</h2>
              <button onClick={() => setMenuOpen(false)} className="text-on-surface-variant hover:text-primary" aria-label="Close menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">home</span> Dashboard
              </Link>
              <Link to="/cycle" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">calendar_month</span> Cycle Tracking
              </Link>
              <Link to="/symptoms" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">edit_note</span> Symptoms
              </Link>
              <Link to="/insights" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">analytics</span> Insights
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <section className="mb-12">
          <h2 className="font-headline-xl text-headline-xl text-plum-deep mb-3">Good morning, Sarah.</h2>
          <p className="text-on-surface-variant flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            Today is Day 14 of your cycle
            <span className="text-tertiary font-bold">• Ovulation Window</span>
          </p>
        </section>

        <section className="mb-12">
          <div className="bg-primary text-white rounded-2xl p-8 md:p-10 relative overflow-hidden soft-shadow">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute left-1/4 -top-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />
            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary-container">auto_awesome</span>
                  <h3 className="font-headline-md text-headline-md">Your Weekly Insights</h3>
                </div>
                <p className="text-lavender-mist font-body-lg mb-8 leading-relaxed italic">
                  "Your skin temperature has spiked by 0.8°C over the last 3 nights, often a precursor to increased night sweat frequency."
                </p>
                <button onClick={() => alert("AI report generation will be connected later.")} className="bg-white text-primary px-8 py-3.5 rounded-xl font-label-md hover:bg-lavender-mist transition-all flex items-center gap-3 active:scale-95 shadow-md">
                  Generate AI Report <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </button>
              </div>
              <div className="hidden md:block">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-inner border-4 border-white/10">
                  <img alt="Serene morning" className="w-full h-full object-cover opacity-80 mix-blend-soft-light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGpMnWZxRfjy4oItBaPyxD9PR-etZV8CGt_C3r5zvjIeR2nTeFwenomr2lWpFW8mnot5hoL7_Y-e1rjbN1RKeGkKW0jrOSDlLhT93bakm5p3zuNNdGgOXJiG2zOYuNH9K7IR1jE3KONydJ1Ki34aHZmqNtwcwKGDz_eR4xGM0ACPqzCHcyrvah1mTAhbH4lkwjt1dL04NbAg7ZV3EANKXxIsafng4QbhIik0MMDtcdVrN4VwFjWXPPcQ" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-5 bg-surface rounded-2xl p-8 soft-shadow border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="font-label-md text-primary uppercase tracking-[0.1em] font-bold">Risk Assessment</span>
                <div className="bg-risk-high/10 p-2 rounded-full"><span className="material-symbols-outlined text-risk-high">error</span></div>
              </div>
              <h3 className="font-headline-md text-headline-md text-plum-deep mb-8">Perimenopause Risk Level</h3>
              <div className="flex flex-col items-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-surface-container-high/50 mb-6">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle className="text-outline-variant/30" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8" />
                    <circle className="text-risk-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="66" strokeLinecap="round" strokeWidth="8" />
                  </svg>
                  <div className="text-center">
                    <span className="font-headline-lg text-risk-high text-[44px]">85</span>
                    <p className="text-label-sm font-bold text-on-surface-variant">/100</p>
                  </div>
                </div>
                <div className="bg-risk-high text-white px-8 py-2.5 rounded-full font-label-md shadow-sm">High Likelihood</div>
              </div>
            </div>
            <div className="mt-8 p-5 bg-risk-high/5 rounded-2xl border border-risk-high/10 italic">
              <p className="text-body-md text-on-surface leading-relaxed"><strong>Recommendation:</strong> Based on your elevated symptoms and hormone trends, we recommend consulting a healthcare professional for further clinical evaluation.</p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-gutter">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              <div className="bg-surface rounded-2xl p-6 soft-shadow border border-outline-variant/10 hover:border-tertiary/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-risk-high/5 rounded-2xl group-hover:bg-risk-high/10 transition-colors"><span className="material-symbols-outlined text-risk-high" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span></div>
                  <span className="material-symbols-outlined text-outline">more_horiz</span>
                </div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Heart Rate</p>
                <div className="flex items-baseline gap-2 mb-6"><span className="font-headline-lg text-plum-deep">78</span><span className="font-label-sm text-on-surface-variant font-bold">bpm</span></div>
                <div className="w-full h-14 bg-surface-container rounded-xl flex items-end gap-1.5 px-3 py-2 overflow-hidden">
                  <div className="flex-1 bg-risk-high/30 rounded-full h-1/2" /><div className="flex-1 bg-risk-high/50 rounded-full h-2/3" /><div className="flex-1 bg-risk-high/30 rounded-full h-1/3" /><div className="flex-1 bg-risk-high/70 rounded-full h-3/4" /><div className="flex-1 bg-risk-high/40 rounded-full h-2/3" /><div className="flex-1 bg-risk-high rounded-full h-full" />
                </div>
              </div>
              <div className="bg-surface rounded-2xl p-6 soft-shadow border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>nights_stay</span></div>
                  <span className="material-symbols-outlined text-outline">more_horiz</span>
                </div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Sleep</p>
                <div className="flex items-baseline gap-2 mb-6"><span className="font-headline-lg text-plum-deep">7h 20m</span></div>
                <div className="w-full h-14 flex items-end gap-2 px-1">
                  <div className="flex-1 bg-primary/20 rounded-full h-[40%]" /><div className="flex-1 bg-primary/40 rounded-full h-[60%]" /><div className="flex-1 bg-primary/80 rounded-full h-[85%]" /><div className="flex-1 bg-primary/50 rounded-full h-[50%]" /><div className="flex-1 bg-primary/20 rounded-full h-[30%]" /><div className="flex-1 bg-primary/60 rounded-full h-[70%]" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-8 soft-shadow border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-risk-low/10 rounded-2xl"><span className="material-symbols-outlined text-risk-low" style={{ fontVariationSettings: "'FILL' 1" }}>footprint</span></div>
                  <div><p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Daily Steps</p><span className="font-headline-md text-plum-deep">4,526</span></div>
                </div>
                <span className="material-symbols-outlined text-outline">more_horiz</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-3"><div className="bg-risk-low h-3 rounded-full shadow-sm" style={{ width: "45%" }} /></div>
              <p className="text-label-sm text-on-surface-variant mt-4 font-bold">Goal: 10,000</p>
            </div>

            <div className="bg-surface rounded-2xl p-8 soft-shadow border-2 border-primary/10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline-md text-plum-deep italic">Quick Log Symptoms</h4>
                <Link to="/symptoms" className="text-primary font-label-md hover:underline decoration-2 underline-offset-4">View History</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/symptoms" className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"><span className="material-symbols-outlined text-[20px] text-tertiary">wb_sunny</span>Hot Flashes</Link>
                <Link to="/symptoms" className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"><span className="material-symbols-outlined text-[20px] text-tertiary">sentiment_dissatisfied</span>Mood Changes</Link>
                <Link to="/symptoms" className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"><span className="material-symbols-outlined text-[20px] text-tertiary">battery_alert</span>Fatigue</Link>
                <Link to="/symptoms" className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3 active:scale-95"><span className="material-symbols-outlined text-[20px] text-tertiary">nights_stay</span>Night Sweats</Link>
                <Link to="/symptoms" className="bg-primary text-white flex items-center justify-center w-12 h-12 rounded-xl active:scale-95 transition-all shadow-md" aria-label="Add symptom"><span className="material-symbols-outlined">add</span></Link>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="bg-surface-container-high rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 soft-shadow border border-white/50">
            <div className="text-center md:text-left flex-1">
              <h3 className="font-headline-md text-plum-deep mb-2">MenoVerse Watch S3</h3>
              <p className="text-on-surface-variant text-label-md mb-8 flex items-center justify-center md:justify-start gap-2 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-risk-low shadow-[0_0_8px_rgba(132,165,157,0.6)]" />Connected &amp; Monitoring</p>
              <div className="flex gap-8 justify-center md:justify-start">
                <div className="flex flex-col items-center"><span className="material-symbols-outlined text-primary mb-2 text-[28px]">battery_charging_90</span><span className="text-label-sm font-bold">92%</span></div>
                <div className="flex flex-col items-center"><span className="material-symbols-outlined text-primary mb-2 text-[28px]">sync</span><span className="text-label-sm font-bold">Synced</span></div>
              </div>
            </div>
            <div className="w-full md:w-64 aspect-[4/3] bg-surface rounded-2xl flex items-center justify-center p-6 shadow-inner border border-outline-variant/10">
              <img className="w-full h-full object-contain filter drop-shadow-xl" alt="MenoVerse smartwatch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0IRv_zBCjv5RuIqg5zJs0LsO8xw6LSkNT8p1AU8wK4JuiSLQix2zrYlrpav2yFZ5WfQCnhgeJIgtKc5FqX14JoiHkb-BisPqLPXpIWTlU0IIx6x71D61--lA7cavmxN5tkLs3CvDnvjnt6d5nfVA942_L9p3afLOS9traziEL2y9RtVy6fNSmM_c33UuDJQyPxluyuvCqpWgtAgdAm72NHEe8y9zDMM3OfmVnSKEN_gEzunH9gFf9aJw" />
            </div>
          </div>
        </section>
      </main>

      {/* FIXED - UNIFIED BOTTOM NAV */}
      <BottomNav />

      <div className="fixed bottom-28 right-6 md:bottom-12 md:right-12 z-40">
        <button onClick={() => alert("Voice Journal will be connected later.")} className="bg-tertiary text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group" aria-label="Voice Journal">
          <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">mic</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard