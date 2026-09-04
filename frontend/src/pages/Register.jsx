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
      const res = await api.post("/register", {
        Name: form.name,
        Age: parseInt(form.age, 10),
        Email: form.email,
        Password: form.password,
      })
      // backend returns the created user (UserID, Name, Age, Email)
      localStorage.setItem("user", JSON.stringify(res.data))
      navigate("/dashboard")
    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
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
        <div className="flex