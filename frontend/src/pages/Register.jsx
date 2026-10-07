import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Register() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [agree, setAgree] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!agree) {
      alert("Please agree to Privacy Policy and Terms")
      return
    }
    if (!form.age) {
      setError("Please enter your age")
      return
    }
    setLoading(true)
    try {
      await api.post("/register", {
        Name: form.name,
        Age: parseInt(form.age, 10),
        Email: form.email,
        Password: form.password,
      })

      const loginRes = await api.post("/login", {
        Email: form.email,
        Password: form.password,
      })

      localStorage.setItem("user", JSON.stringify(loginRes.data))
      navigate("/dashboard")
    } catch (err) {
      const detail = err.response?.data?.detail
      let message = "Registration failed. Please try again."

      if (err.code === "ERR_NETWORK") {
        message = "The server is unavailable right now. Start the backend and try again."
      } else if (typeof detail === "string") {
        message = detail
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = detail.map((d) => d.msg).join(", ")
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-on-surface font-['Plus_Jakarta_Sans']">
      <header className="h-14 px-4 flex items-center justify-between bg-background/80 backdrop-blur-xl sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[14px] font-semibold tracking-wide">Register</h1>
        <div className="w-11"></div>
      </header>
      <main className="flex-1 px-6 py-4 max-w-[480px] mx-auto w-full flex flex-col">
        <div className="flex justify-center mt-2 mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(91,42,110,0.3)]">
            <span className="material-symbols-outlined text-primary text-[36px]" style={{fontVariationSettings:"'FILL' 0"}}>spa</span>
          </div>
        </div>
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] text-[42px] leading-[44px] font-bold text-plum-deep">Begin Your<br/>Journey</h2>
          <p className="text-[16px] text-on-surface-variant mt-4 leading-[24px] px-2">Join MenoVerse for personalized perimenopause support and insights.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <div>
            <label className="text-[15px] font-medium text-on-surface mb-2 block">Full Name</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">person</span>
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Doe" className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-4 text-[16px] placeholder:text-on-surface-variant/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-primary/20 border border-outline-variant focus:border-primary/40" />
            </div>
          </div>
          <div>
            <label className="text-[15px] font-medium text-on-surface mb-2 block">Age</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">calendar_today</span>
              <input required type="number" min="1" max="120" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="45" className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-4 text-[16px] placeholder:text-on-surface-variant/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-primary/20 border border-outline-variant focus:border-primary/40" />
            </div>
          </div>
          <div>
            <label className="text-[15px] font-medium text-on-surface mb-2 block">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">mail</span>
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="jane@example.com" className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-4 text-[16px] placeholder:text-on-surface-variant/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-primary/20 border border-outline-variant" />
            </div>
          </div>
          <div>
            <label className="text-[15px] font-medium text-on-surface mb-2 block">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">lock</span>
              <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" type={showPass? "text" : "password"} className="w-full bg-white rounded-2xl py-[18px] pl-12 pr-12 text-[16px] placeholder:text-on-surface-variant/70 outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-primary/20 border border-outline-variant tracking-[4px]" />
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[22px]">{showPass? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-2">
            <button type="button" onClick={()=>setAgree(!agree)} className={`w-6 h-6 min-w-[24px] rounded-[6px] border-2 flex items-center justify-center transition-all ${agree ? "bg-primary border-primary" : "border-outline bg-white"}`}>
              {agree && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
            </button>
            <p className="text-[14px] leading-[20px] text-on-surface">I agree to the <span className="font-semibold underline underline-offset-2">Privacy Policy</span> and <span className="font-semibold underline underline-offset-2">Terms of Service</span>.</p>
          </div>
          {error && <p className="text-center text-[14px] text-risk-high font-medium -mb-2">{error}</p>}
          <div className="pt-6">
            <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-tertiary text-white py-[18px] rounded-2xl text-[16px] font-semibold shadow-[0_8px_20px_-8px_rgba(91,42,110,0.5)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
              {loading? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : <>Create Account <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>}
            </button>
            <p className="text-center text-[15px] mt-8 text-on-surface-variant">Already have an account? <Link to="/login" className="font-semibold text-primary hover:text-tertiary hover:underline">Sign in</Link></p>
          </div>
        </form>
      </main>
    </div>
  )
}
