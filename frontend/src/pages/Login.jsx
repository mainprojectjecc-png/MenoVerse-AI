import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      localStorage.setItem("user", JSON.stringify({ email: form.email }))
      navigate("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#fff9e8] flex flex-col font-['Plus_Jakarta_Sans'] text-[#3F3D35]">
      <header className="h-14 px-4 flex items-center justify-between bg-[#fff9e8] sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#e8e2cf]/50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[14px] font-semibold">Login</h1>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6">
        <h2 className="font-['Playfair_Display'] text-[40px] font-bold text-[#535845] mb-2">MenoVerse</h2>
        <div className="w-12 h-[2px] bg-[#6b705c]/30 mx-auto rounded-full mb-8"></div>

        {/* MIDDLE-AGED WOMAN 45 YEARS - REALISTIC, FLAT */}
        <div className="w-28 h-28 mb-8 rounded-full overflow-hidden bg-[#eee8d4] border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face&auto=format"
            alt="woman 45 years"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="w-full max-w-sm bg-white rounded-[28px] p-8 border border-[#e8e2cf]/50">
          <div className="text-center mb-8">
            <h3 className="font-['Playfair_Display'] text-[28px] font-semibold">Welcome Back</h3>
            <p className="text-[15px] text-[#464740] mt-1">Sign in to continue your wellness journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#464740]/50">mail</span>
              <input id="email" name="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address" type="email" className="w-full bg-[#faf4df] rounded-xl py-4 pl-12 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-[#535845]/20" />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#464740]/50">lock</span>
              <input id="password" name="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type={showPass? "text" : "password"} className="w-full bg-[#faf4df] rounded-xl py-4 pl-12 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-[#535845]/20" />
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#464740]/60">
                <span className="material-symbols-outlined text-[20px]">{showPass? "visibility_off" : "visibility"}</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[12px] text-[#5f604b] font-medium">Forgot Password?</button>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#535845] text-white py-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2">
              {loading? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : <>Sign In <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-[#e8e2cf]"></div>
            <span className="text-[12px] text-[#464740]/60">or</span>
            <div className="h-[1px] flex-1 bg-[#e8e2cf]"></div>
          </div>

          <div className="flex gap-4">
            <button onClick={()=>navigate("/dashboard")} className="flex-1 bg-[#faf4df] py-3 rounded-xl flex justify-center hover:bg-[#f4eeda]">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G"/>
            </button>
            <button onClick={()=>navigate("/dashboard")} className="flex-1 bg-[#faf4df] py-3 rounded-xl flex justify-center hover:bg-[#f4eeda]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.665-1.48 3.666-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/></svg>
            </button>
          </div>
        </div>

        <p className="mt-8 text-[15px] text-[#464740]">
          Don't have an account? <Link to="/register" className="text-[#535845] font-semibold hover:underline">Create one</Link>
        </p>
      </main>
    </div>
  )
}