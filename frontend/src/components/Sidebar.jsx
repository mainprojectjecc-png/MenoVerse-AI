import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/assessment", icon: "fact_check", label: "Assessment" },
  { to: "/cycle", icon: "calendar_month", label: "Cycle Tracking" },
  { to: "/symptoms", icon: "edit_note", label: "Symptoms" },
  { to: "/journal", icon: "mic", label: "Voice Journal" },
  { to: "/insights", icon: "analytics", label: "Insights" },
  { to: "/xai", icon: "psychology", label: "AI Explanation" },
  { to: "/nutrition", icon: "restaurant", label: "Nutrition" },
  { to: "/diet", icon: "restaurant_menu", label: "Diet" },
  { to: "/exercise", icon: "fitness_center", label: "Exercise" },
  { to: "/education", icon: "menu_book", label: "Education" },
  { to: "/profile", icon: "person", label: "Profile" },
]

function Sidebar({ collapsed }) {
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
    <aside
      className={`
        hidden lg:flex fixed left-0 top-0 bottom-0 z-40
        border-r border-outline-variant/70 bg-white
        flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-72"}
      `}
    >

      {/* LOGO */}
      <Link
        to="/dashboard"
        className={`flex h-[76px] shrink-0 items-center border-b border-outline-variant/60 transition-all duration-300 ${
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm">
          M
        </span>
        {!collapsed && (
          <span>
            <span className="block font-headline-md text-lg font-semibold leading-tight text-primary">
              MenoVerse
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
              Wellness
            </span>
          </span>
        )}
      </Link>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/80">
            Your workspace
          </p>
        )}
        <nav className="flex flex-col gap-1.5">

          {navLinks.map((link) => {
            const active =
              location.pathname === link.to ||
              location.pathname.startsWith(`${link.to}/`)

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
                    : "gap-3 px-4 py-3 w-full"
                  }
                  ${
                    active
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                  }
                `}
              >
                <span className={`material-symbols-outlined shrink-0 text-[21px] ${active ? "text-white" : ""}`}>
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
      <div className="shrink-0 border-t border-outline-variant/60 p-4">

        {collapsed ? (
          <Link
            to="/profile"
            title={name}
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container ring-1 ring-outline-variant/60"
          >
            {initials}
          </Link>
        ) : (
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-background/70 p-3 transition-colors hover:bg-surface-container"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">
                {name}
              </p>

              <p className="text-xs text-on-surface-variant">
                Personal account
              </p>
            </div>
          </Link>
        )}

      </div>

    </aside>
  )
}

export default Sidebar