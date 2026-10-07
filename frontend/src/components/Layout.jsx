import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"
import { bottomNavLinks } from "./bottomNavLinks"

const menuLinks = [
  ...bottomNavLinks,
  { to: "/nutrition", icon: "restaurant", label: "Nutrition" },
  { to: "/assessment", icon: "fact_check", label: "Assessment" },
  { to: "/xai", icon: "psychology", label: "AI Explanation" },
  { to: "/journal", icon: "mic", label: "Voice Journal" },
  { to: "/exercise", icon: "fitness_center", label: "Exercise" },
  { to: "/education", icon: "menu_book", label: "Education" },
  { to: "/profile", icon: "person", label: "Profile" },
]

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches

  const stored = localStorage.getItem("user")
  const user = stored ? JSON.parse(stored) : null

  const name = user?.Name || "User"
  const activeLink = menuLinks.find((link) =>
    location.pathname === link.to || location.pathname.startsWith(`${link.to}/`)
  )

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* COMMON SIDEBAR */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* MAIN AREA */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}
        `}
      >

        <header
          className="
            sticky top-0 z-30 flex h-[76px] items-center gap-4
            border-b border-outline-variant/55 bg-white/90 px-4 shadow-[0_8px_28px_-26px_rgba(43,21,56,0.45)] backdrop-blur-xl
            sm:px-6 lg:px-8
          "
        >
          <div className="relative">
            <button
              onClick={() => {
                if (isDesktop) {
                  setSidebarCollapsed((prev) => !prev)
                } else {
                  setMenuOpen((prev) => !prev)
                }
              }}
              className="
                flex h-10 w-10 items-center justify-center rounded-xl
                text-on-surface-variant transition-colors hover:bg-surface-container
                hover:text-primary
              "
              aria-label="Toggle navigation"
              aria-expanded={isDesktop ? !sidebarCollapsed : menuOpen}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isDesktop
                  ? sidebarCollapsed ? "menu_open" : "menu"
                  : menuOpen ? "close" : "menu"}
              </span>
            </button>

            {menuOpen && (
              <nav
                id="header-navigation-menu"
                aria-label="Main navigation"
                className="absolute left-0 top-full z-50 mt-3 max-h-[calc(100dvh-10rem)] w-64 overflow-y-auto rounded-2xl border border-outline-variant bg-white p-3 shadow-xl lg:hidden"
              >
                {menuLinks.map((link) => {
                  const active =
                    location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`)

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                        active
                          ? "bg-primary font-semibold text-white"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[21px]">
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>

          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[21px]">spa</span>
            </span>
            <span className="hidden font-headline-md text-lg font-semibold text-primary sm:inline lg:hidden">
              MenoVerse
            </span>
          </Link>

          <div className="mx-1 hidden h-8 w-px bg-outline-variant/70 sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {activeLink?.label || "Your wellness"}
            </p>
            <p className="hidden text-xs text-on-surface-variant sm:block">
              Your personal wellness space
            </p>
          </div>

          <div className="flex-1" />

          <Link
            to="/assessment"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-plum-deep hover:shadow-md sm:inline-flex"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
            New assessment
          </Link>

          <Link
            to="/profile"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center rounded-full
              border-2 border-white bg-secondary-container text-sm font-bold
              text-on-secondary-container shadow-sm ring-1 ring-outline-variant/60
            "
            aria-label={`Open profile for ${name}`}
            title={name}
          >
            {initials}
          </Link>

        </header>

        {/* PAGE CONTENT */}
        <main className="min-h-[calc(100vh-76px)]">
          <Outlet />
        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav />

    </div>
  )
}