import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/login", {
        Email: form.email,
        Password: form.password,
      })
      localStorage.setItem("user", JSON.stringify(res.data))
      localStorage.setItem("token", res.data.access_token)
      navigate("/dashboard")
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed. Please check your credentials."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-['Plus_Jakarta_Sans'] text-on-surface">
      <header className="h-14 px-4 flex items-center justify-between bg-background sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[14px] font-semibold">Login</h1>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6">
        <h2 className="font-['Playfair_Display'] text-[40px] font-bold text-primary mb-2">MenoVerse</h2>
        <div className="w-12 h-[2px] bg-tertiary mx-auto rounded-full mb-8"></div>

        <div className="w-28 h-28 mb-8 rounded-full overflow-hidden bg-secondary-container border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face&auto=format"
            alt="woman 45 years"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="w-full max-w-sm bg-white rounded-[28px] p-8 border border-outline-variant soft-shadow">
          <div className="text-center mb-8">
            <h3 className="font-['Playfair_Display'] text-[28px] font-semibold">Welcome Back</h3>
            <p className="text-[15px] text-on-surface-variant mt-1">Sign in to continue your wellness journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
              <input id="email" name="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address" type="email" className="w-full bg-surface-container rounded-xl py-4 pl-12 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
              <input id="password" name="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type={showPass? "text" : "password"} className="w-full bg-surface-container rounded-xl py-4 pl-12 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-primary/30" />
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">{showPass? "visibility_off" : "visibility"}</span>
              </button>
            </div>

            {error && (
              <p className="text-center text-[14px] text-risk-high font-medium">{error}</p>
            )}

            <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-tertiary text-white py-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors">
              {loading? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : <>Sign In <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>}
            </button>
          </form>
        </div>

        <p className="mt-8 text-[15px] text-on-surface-variant">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:text-tertiary hover:underline">Create one</Link>
        </p>
      </main>
    </div>
  )
}