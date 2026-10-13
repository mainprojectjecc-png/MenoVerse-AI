import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../api/axios"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get("token") || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) {
      window.history.replaceState({}, "", "/reset-password")
    }
  }, [token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")
    setError("")
    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new link.")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/password-reset/confirm", {
        Token: token,
        Password: password,
      })
      setMessage(response.data.message)
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "The password could not be reset. Request a new link and try again.",
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
            Set a new password
          </h1>
          <p className="mt-2 text-[15px] text-on-surface-variant">
            Choose a password with at least 6 characters.
          </p>
        </div>
        {message ? (
          <div className="space-y-5 text-center">
            <p role="status" className="text-[14px] text-primary">{message}</p>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-primary py-4 text-[14px] font-semibold text-white hover:bg-tertiary"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="sr-only">New password</span>
              <input
                autoComplete="new-password"
                className="w-full rounded-xl bg-surface-container px-4 py-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                required
                type="password"
                value={password}
              />
            </label>
            <label className="block">
              <span className="sr-only">Confirm new password</span>
              <input
                autoComplete="new-password"
                className="w-full rounded-xl bg-surface-container px-4 py-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
                minLength={6}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                required
                type="password"
                value={confirmPassword}
              />
            </label>
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
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
        {!message && (
          <p className="mt-6 text-center text-[14px] text-on-surface-variant">
            Need another link?{" "}
            <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
              Request a new one
            </Link>
          </p>
        )}
      </section>
    </main>
  )
}
