import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/assessment", icon: "fact_check", label: "Assessment" },
  { to: "/cycle", icon: "calendar_month", label: "Cycle Tracking" },
  { to: "/symptoms", icon: "edit_note", label: "Symptoms" },
  { to: "/journal", icon: "mic", label: "Voice Journal" },
  { to: "/insights", icon: "analytics", label: "Insights" },
  { to: "/nutrition", icon: "restaurant", label: "Nutrition" },
  { to: "/exercise", icon: "fitness_center", label: "Exercise" },
  { to: "/profile", icon: "person", label: "Profile" },
]

function Sidebar({ collapsed }) {
  const location = useLocation()

  return (
    <aside
      className={`
        hidden lg:flex fixed left-0 top-0 bottom-0 z-40
        bg-[#FAF7F0] border-r border-[#e8e2cf]
        flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-72"}
      `}
    >

      {/* LOGO */}
      <div
        className={`
          h-[86px] flex items-center
          border-b border-[#e8e2cf]/50
          shrink-0
          transition-all duration-300
          ${collapsed ? "justify-center px-2" : "px-6"}
        `}
      >
        {collapsed ? (
          <span
            className="text-xl font-semibold italic text-[#3F3D35]"
            style={{ fontFamily: "Playfair Display" }}
          >
            M
          </span>
        ) : (
          <h2
            className="text-[20px] font-semibold italic text-[#3F3D35]"
            style={{ fontFamily: "Playfair Display" }}
          >
            MenoVerse AI
          </h2>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="flex flex-col gap-2">

          {navLinks.map((link) => {
            const active = location.pathname === link.to

            return (
              <Link
                key={link.to}
                to={link.to}
                title={collapsed ? link.label : undefined}
                className={`
                  flex items-center
                  rounded-full
                  transition-all duration-200
                  ${collapsed
                    ? "justify-center w-14 h-14 mx-auto"
                    : "gap-4 px-5 py-3.5 w-full"
                  }
                  ${
                    active
                      ? "bg-[#535845] text-white font-semibold"
                      : "text-[#3F3D35] hover:bg-[#e8e2cf]/60"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[21px] shrink-0">
                  {link.icon}
                </span>

                {!collapsed && (
                  <span className="text-[14px] whitespace-nowrap">
                    {link.label}
                  </span>
                )}
              </Link>
            )
          })}

        </nav>
      </div>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-[#e8e2cf]/50 shrink-0">

        {collapsed ? (
          <Link
            to="/profile"
            title="Sarah J"
            className="w-11 h-11 mx-auto rounded-full bg-[#B7B7A4] flex items-center justify-center font-bold text-sm"
          >
            SJ
          </Link>
        ) : (
          <Link
            to="/profile"
            className="flex items-center gap-3 bg-white rounded-xl p-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#B7B7A4] flex items-center justify-center font-bold text-sm">
              SJ
            </div>

            <div>
              <p className="text-sm font-semibold">
                Sarah J
              </p>

              <p className="text-xs text-gray-500">
                Wellness Member
              </p>
            </div>
          </Link>
        )}

      </div>

    </aside>
  )
}

export default Sidebar