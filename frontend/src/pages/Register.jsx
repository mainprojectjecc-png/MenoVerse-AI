import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [agree, setAgree] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  // Simple password strength
  const getStrength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length > 5) s++
    if (p.length > 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    return s // 0-4
  }
  const strength = getStrength(form.password)
  const strengthPercent = (strength / 4) * 100
  const strengthColor = strength < 2? "bg-[#BC6C4D]" : strength < 3? "bg-[#e8c547]" : "bg-[#84A59D]"

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agree) {
      alert("Please agree to Privacy Policy and Terms")
      return
    }
    localStorage.setItem("user", JSON.stringify(form))
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#fff9e8] flex flex-col text-[#3F3D35] font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between bg-[#fff9e8]/80 backdrop-blur-xl sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#e8e2cf]/50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[14px] font-semibold tracking-wide">Register</h1>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 px-6 py-4 max-w-[480px] mx-auto w-full flex flex-col">
        {/* Icon */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#eee8d4] flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(107,112,92,0.3)]">
            <span className="material-symbols-outlined text-[#535845] text-[36px]" style={{fontVariationSettings:"'FILL' 0"}}>spa</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] text-[42px] leading-[44px] font-bold text-[#1e1c10]">Begin Your<br/>Journey</h2>
          <p className="text-[16px] text-[#464740] mt-4 leading-[24px] px-2">Join MenoVerse for personalized perimenopause support and insights.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          {/* Full Name */}
          <div>
            <label className="text-[15px] font-medium text-[#1e1c10] mb-2 block">Full Name</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A596] text-[22px]">person</span>
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Doe" className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-4 text-[16px] placeholder:text-[#A8A596]/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#535845]/20 border border-transparent focus:border-[#535845]/20" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[15px] font-medium text-[#1e1c10] mb-2 block">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A596] text-[22px]">mail</span>
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="jane@example.com" className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-4 text-[16px] placeholder:text-[#A8A596]/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#535845]/20 border border-transparent" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[15px] font-medium text-[#1e1c10] mb-2 block">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A596] text-[22px]">lock</span>
              <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" type={showPass? "text" : "password"} className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-12 text-[16px] placeholder:text-[#A8A596]/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#535845]/20 border border-transparent tracking-[4px]" />
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A596] hover:text-[#535845]">
                <span className="material-symbols-outlined text-[22px]">{showPass? "visibility" : "visibility_off"}</span>
              </button>
            </div>
            {/* Strength bar */}
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#e8e2cf] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{width:`${strengthPercent}%`}}></div>
              </div>
              <p className="text-right text-[12px] text-[#A8A596] mt-1">Password Strength</p>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <button type="button" onClick={()=>setAgree(!agree)} className={`w-6 h-6 min-w-[24px] rounded-[6px] border-2 flex items-center justify-center transition-all ${agree? "bg-[#535845] border-[#535845]" : "border-[#c7c7bd] bg-white"}`}>
              {agree && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
            </button>
            <p className="text-[14px] leading-[20px] text-[#3F3D35]">I agree to the <span className="font-semibold underline underline-offset-2">Privacy Policy</span> and <span className="font-semibold underline underline-offset-2">Terms of Service</span>.</p>
          </div>

          {/* Button */}
          <div className="pt-6">
            <button type="submit" className="w-full bg-[#535845] hover:bg-[#444937] text-white py-[18px] rounded-2xl text-[16px] font-semibold shadow-[0_8px_20px_-8px_rgba(83,88,69,0.5)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              Create Account <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <p className="text-center text-[12px] tracking-[0.15em] text-[#A8A596] font-medium mt-6">SECURE. PRIVATE. EMPATHETIC.</p>

            <p className="text-center text-[15px] mt-8">
              Already have an account? <Link to="/login" className="font-semibold text-[#1e1c10] hover:underline">Sign in</Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}