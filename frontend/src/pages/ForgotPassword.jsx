import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")
    try {
      const response = await api.post("/password-reset/request", { Email: email })
      setMessage(response.data.message)
    } catch (requestError) {
      const detail = requestError.response?.data?.detail
      setError(
        detail && !detail.toLowerCase().includes("not configured")
          ? detail
          : "Password reset is temporarily unavailable. Please try again later.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans'] text-on-surface">
      <Link to="/login" className="mb-8 text-primary font-semibold hover:underline">
        MenoVerse
      </Link>
      <section className="w-full max-w-sm rounded-[28px] border border-outline-variant bg-white p-8 soft-shadow">
        <div className="mb-7 text-center">
          <span className="material-symbols-outlined mb-3 text-[40px] text-primary" aria-hidden="true">
            lock_reset
          </span>
          <h1 className="font-['Playfair_Display'] text-[28px] font-semibold">
            Forgot your password?
          </h1>
          <p className="mt-2 text-[15px] text-on-surface-variant">
            Enter your account email and we’ll send you a reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="w-full rounded-xl bg-surface-container px-4 py-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
              type="email"
              value={email}
            />
          </label>
          {message && (
            <p role="status" className="text-center text-[14px] text-primary">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="text-center text-[14px] text-risk-high">
              {error}
            </p>
          )}
          <button
            className="w-full rounded-xl bg-primary py-4 text-[14px] font-semibold text-white transition-colors hover:bg-tertiary disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-[14px] text-on-surface-variant">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
