import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"
import { bottomNavLinks } from "./bottomNavLinks"

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const stored = localStorage.getItem("user")
  const user = stored ? JSON.parse(stored) : null

  const name = user?.Name || "User"

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#F0EAD6]">

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

        {/* COMMON TOP HEADER */}
        <header
          className="
            h-[86px]
            bg-[#FAF7F0]
            border-b border-[#e8e2cf]
            flex items-center
            px-6
            sticky top-0
            z-30
          "
        >

          {/* MENU */}
          <div className="relative">
            <button
              onClick={() => {
                setSidebarCollapsed((prev) => !prev)
                setMenuOpen((prev) => !prev)
              }}
              className="
                w-10 h-10
                rounded-full
                hover:bg-[#e8e2cf]/60
                flex items-center
                justify-center
                transition-all
              "
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="header-navigation-menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>

            {menuOpen && (
              <nav
                id="header-navigation-menu"
                aria-label="Main navigation"
                className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-[#e8e2cf] bg-[#FAF7F0] p-3 shadow-xl z-50"
              >
                {bottomNavLinks.map((link) => {
                  const active =
                    location.pathname === link.to ||
                    (link.to === "/education" &&
                      location.pathname.startsWith("/education/"))

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-colors ${
                        active
                          ? "bg-[#535845] font-semibold text-white"
                          : "text-[#3F3D35] hover:bg-[#e8e2cf]/60"
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

          {/* BRAND */}
          <Link
            to="/dashboard"
            className="
              ml-4
              text-[#6B705C]
              italic
              text-[16px]
            "
            style={{ fontFamily: "Playfair Display" }}
          >
            MenoVerse AI
          </Link>

          <div className="flex-1" />

          {/* TOP NAVIGATION */}
          <nav className="hidden xl:flex items-center gap-8 mr-8">

            <Link
              to="/dashboard"
              className="text-sm text-[#535845] hover:text-[#535845]"
            >
              Home
            </Link>

            <Link
              to="/cycle"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Tracking
            </Link>

            <Link
              to="/symptoms"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Symptoms
            </Link>

            <Link
              to="/journal"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Journal
            </Link>

            <Link
              to="/insights"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Insights
            </Link>

            <Link
              to="/nutrition"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Nutrition
            </Link>

            <Link
              to="/exercise"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Exercise
            </Link>

            <Link
              to="/education"
              className="text-sm text-[#77776d] hover:text-[#535845]"
            >
              Education
            </Link>

          </nav>

          {/* PROFILE */}
          <Link
            to="/profile"
            className="
              w-10 h-10
              rounded-full
              bg-[#B7B7A4]
              flex items-center
              justify-center
              font-bold
              text-sm
            "
            aria-label={`Open profile for ${name}`}
            title={name}
          >
            {initials}
          </Link>

        </header>

        {/* PAGE CONTENT */}
        <main className="min-h-[calc(100vh-86px)]">
          <Outlet />
        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav />

    </div>
  )
}