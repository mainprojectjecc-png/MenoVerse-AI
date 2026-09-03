import BottomNav from "../components/BottomNav"
import { Link } from "react-router-dom"
import { useState } from "react"

function Insights() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fff9e8] text-[#3F3D35] pb-24">
      <header className="bg-[#FAF7F0]/80 backdrop-blur-md sticky top-0 z-40 w-full flex items-center justify-between px-6 py-5 border-b border-[#D1CEC0]/30">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="text-[#6B705C]">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <Link to="/dashboard" className="text-[20px] font-semibold text-[#6B705C] italic" style={{fontFamily:'Playfair Display'}}>MenoVerse AI</Link>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#6B705C]/20">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC5p4CdH1Quys6vmdRAY3SJtRyqMmhiX7jZRQOa5a1c411CMWfz33Zx2KHMYM-6QtCArjk7qIauw-RZrRNNPRmfOcKJr0SiRe3HxsdZS_T50EtysaWzyKI0e5UgJLBGREatiG7v0lONSYOBuT8SFFzlCJjG0fX87-8PCcRPt-Z1Hs8j75qFrT3XKG9KMoL8RxCVkAXPwT7f_-ln-nAaR02jxPMQo1IQVM-0HJjrYV6-y9DeAzqccJZOw" alt="profile" />
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}>
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#FAF7F0] shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-semibold text-[#6B705C] italic" style={{fontFamily:'Playfair Display'}}>MenoVerse AI</h2>
              <button onClick={() => setMenuOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/dashboard" className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#6B705C]/10"><span className="material-symbols-outlined">home</span>Dashboard</Link>
              <Link to="/cycle" className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#6B705C]/10"><span className="material-symbols-outlined">calendar_month</span>Cycle Tracking</Link>
              <Link to="/symptoms" className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#6B705C]/10"><span className="material-symbols-outlined">edit_note</span>Symptoms</Link>
              <Link to="/insights" className="flex items-center gap-4 p-4 rounded-xl bg-[#6B705C]/10 text-[#535845] font-bold"><span className="material-symbols-outlined">insights</span>Insights</Link>
            </nav>
          </aside>
        </div>
      )}

      <main className="max-w-[1100px] mx-auto px-6 pt-10 space-y-10">
        <section>
          <h2 className="text-[36px] font-bold text-[#3F3D35]" style={{fontFamily:'Playfair Display'}}>Your AI Insights</h2>
          <p className="text-[#464740] mt-2">Personalized patterns from your logs and wearables</p>
        </section>

        {/* AI Weekly Report Card */}
        <div className="bg-[#535845] text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#e8e2cf]">auto_awesome</span>
              <span className="text-xs tracking-widest uppercase font-bold text-[#e8e2cf]">AI Generated</span>
            </div>
            <h3 className="text-2xl italic mb-4" style={{fontFamily:'Playfair Display'}}>Hormonal Shift Detected</h3>
            <p className="text-[#e8e2cf]/80 leading-relaxed mb-6">"Your sleep disruptions increased 40% during late luteal phase. Combined with temperature spikes, this suggests progesterone sensitivity."</p>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">Sleep • High</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-xs">Temp • +0.8°C</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D1CEC0]/20">
            <h4 className="font-semibold flex items-center gap-2"><span className="material-symbols-outlined text-[#BC6C4D]">local_fire_department</span> Hot Flash Pattern</h4>
            <p className="text-sm text-[#464740] mt-3">Most frequent between 2-4 PM, triggered by caffeine. Try reducing intake after 1 PM.</p>
            <div className="mt-6 h-20 flex items-end gap-1.5">
              <div className="flex-1 bg-[#BC6C4D]/20 h-[30%] rounded-full"></div>
              <div className="flex-1 bg-[#BC6C4D]/40 h-[60%] rounded-full"></div>
              <div className="flex-1 bg-[#BC6C4D] h-[90%] rounded-full"></div>
              <div className="flex-1 bg-[#BC6C4D]/30 h-[40%] rounded-full"></div>
              <div className="flex-1 bg-[#BC6C4D]/50 h-[70%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D1CEC0]/20">
            <h4 className="font-semibold flex items-center gap-2"><span className="material-symbols-outlined text-[#6B705C]">bedtime</span> Sleep Quality</h4>
            <p className="text-sm text-[#464740] mt-3">Average 6h 45m this week. Deep sleep improved after logging evening walks.</p>
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2"><span>Goal 8h</span><span className="font-bold">84%</span></div>
              <div className="w-full h-2.5 bg-[#FAF7F0] rounded-full"><div className="h-full bg-[#6B705C] rounded-full" style={{width:'84%'}}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D1CEC0]/20">
          <h4 className="font-semibold mb-6">Recommendations</h4>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-[#fff9e8] rounded-xl"><span className="w-8 h-8 bg-[#6B705C] text-white rounded-full flex items-center justify-center text-sm">1</span><p className="text-sm">Consider magnesium glycinate before bed - your sleep data shows improvement potential.</p></div>
            <div className="flex gap-4 p-4 bg-[#fff9e8] rounded-xl"><span className="w-8 h-8 bg-[#6B705C] text-white rounded-full flex items-center justify-center text-sm">2</span><p className="text-sm">Schedule walk 30 mins after lunch - correlates with 20% less fatigue in your logs.</p></div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
export default Insights