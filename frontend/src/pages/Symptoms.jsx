import BottomNav from "../components/BottomNav"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function Symptoms() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    hotFlashes: "none",
    sleep: "none",
    mood: "none",
    jointPain: "none",
    fatigue: "none",
    notes: ""
  })

  const handleChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleSubmit = () => {
    console.log("Symptoms:", formData)
    alert("Symptoms saved! Backend connection Day 2")
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#fff9e8] text-[#3F3D35] pb-24">
      <header className="fixed top-0 w-full z-50 bg-[#FAF7F0]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 flex items-center px-6 gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e8e2cf]/50">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[24px] font-semibold flex-1" style={{fontFamily:'Playfair Display'}}>Today's Symptoms</h1>
          <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e8e2cf]/50 md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img alt="Profile" className="w-8 h-8 rounded-full object-cover hidden md:block" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC5p4CdH1Quys6vmdRAY3SJtRyqMmhiX7jZRQOa5a1c411CMWfz33Zx2KHMYM-6QtCArjk7qIauw-RZrRNNPRmfOcKJr0SiRe3HxsdZS_T50EtysaWzyKI0e5UgJLBGREatiG7v0lONSYOBuT8SFFzlCJjG0fX87-8PCcRPt-Z1Hs8j75qFrT3XKG9KMoL8RxCVkAXPwT7f_-ln-nAaR02jxPMQo1IQVM-0HJjrYV6-y9DeAzqccJZOw" />
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
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10"><span className="material-symbols-outlined">home</span>Dashboard</Link>
              <Link to="/cycle" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10"><span className="material-symbols-outlined">calendar_month</span>Cycle Tracking</Link>
              <Link to="/symptoms" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 text-primary font-bold"><span className="material-symbols-outlined">edit_note</span>Symptoms</Link>
              <Link to="/insights" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10"><span className="material-symbols-outlined">analytics</span>Insights</Link>
            </nav>
          </aside>
        </div>
      )}

      <main className="relative w-full pt-16 bg-[#fff9e8] min-h-screen">
        <div className="flex flex-col w-full p-6 gap-12 pb-24 max-w-[800px] mx-auto">
          <section className="flex flex-col gap-4 mt-4">
            <h2 className="text-[28px] md:text-[32px] font-semibold leading-tight" style={{fontFamily:'Playfair Display'}}>How are you feeling today?</h2>
            <p className="text-[16px] text-[#464740]">Log your symptoms to help MenoVerse understand your patterns and offer personalized support.</p>
          </section>

          <section className="flex flex-col gap-4">
            <article className="bg-[#faf4df] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#BC6C4D]/10 flex items-center justify-center text-[#BC6C4D]"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>device_thermostat</span></div>
                <div><h3 className="text-sm font-semibold">Hot Flashes</h3><p className="text-xs text-[#464740]">Intensity</p></div>
              </div>
              <select value={formData.hotFlashes} onChange={(e) => handleChange("hotFlashes", e.target.value)} className="bg-white rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"><option value="none">None</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
            </article>
            <article className="bg-[#faf4df] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#6b705c]/20 flex items-center justify-center text-[#535845]"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>bedtime</span></div>
                <div><h3 className="text-sm font-semibold">Sleep Quality</h3><p className="text-xs text-[#464740]">Disruptions</p></div>
              </div>
              <select value={formData.sleep} onChange={(e) => handleChange("sleep", e.target.value)} className="bg-white rounded-lg px-3 py-2 text-sm outline-none"><option value="none">None</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
            </article>
            <article className="bg-[#faf4df] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8f644c]/20 flex items-center justify-center text-[#744c36]"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>mood</span></div>
                <div><h3 className="text-sm font-semibold">Mood</h3><p className="text-xs text-[#464740]">Fluctuations</p></div>
              </div>
              <select value={formData.mood} onChange={(e) => handleChange("mood", e.target.value)} className="bg-white rounded-lg px-3 py-2 text-sm outline-none"><option value="none">None</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
            </article>
            <article className="bg-[#faf4df] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e2e1c7]/50 flex items-center justify-center text-[#5f604b]"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>accessibility_new</span></div>
                <div><h3 className="text-sm font-semibold">Joint Pain</h3><p className="text-xs text-[#464740]">Discomfort</p></div>
              </div>
              <select value={formData.jointPain} onChange={(e) => handleChange("jointPain", e.target.value)} className="bg-white rounded-lg px-3 py-2 text-sm outline-none"><option value="none">None</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
            </article>
            <article className="bg-[#faf4df] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e8e2cf] flex items-center justify-center text-[#3F3D35]"><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>psychology</span></div>
                <div><h3 className="text-sm font-semibold">Fatigue</h3><p className="text-xs text-[#464740]">Energy Levels</p></div>
              </div>
              <select value={formData.fatigue} onChange={(e) => handleChange("fatigue", e.target.value)} className="bg-white rounded-lg px-3 py-2 text-sm outline-none"><option value="none">None</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
            </article>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Additional Notes (Optional)</label>
            <textarea value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} className="w-full bg-[#faf4df] rounded-xl p-4 text-sm placeholder:text-[#464740]/50 outline-none resize-none shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="Any specific triggers or context to remember today?" rows="4"></textarea>
          </section>

          <section className="mt-2">
            <button onClick={handleSubmit} className="w-full bg-[#535845] hover:bg-[#444937] text-white text-sm font-semibold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">save</span>Save Entry
            </button>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default Symptoms