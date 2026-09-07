import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

          {/* SIDEBAR TOGGLE */}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="
              w-10 h-10
              rounded-full
              hover:bg-[#e8e2cf]/60
              flex items-center
              justify-center
              transition-all
            "
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined text-[24px]">
              menu
            </span>
          </button>

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
          >
            SJ
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