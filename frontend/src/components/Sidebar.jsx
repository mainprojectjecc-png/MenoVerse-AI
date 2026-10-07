import { Link, useLocation } from "react-router-dom"

const navGroups = [
  {
    label: "Your health",
    links: [
      { to: "/dashboard", icon: "home", label: "Home" },
      { to: "/cycle", icon: "calendar_month", label: "Cycle tracker" },
      { to: "/symptoms", icon: "edit_note", label: "Symptoms" },
      { to: "/insights", icon: "analytics", label: "Health insights" },
      { to: "/community", icon: "diversity_3", label: "Community" },
    ],
  },
  {
    label: "Personalized care",
    links: [
      { to: "/assessment", icon: "fact_check", label: "Assessment" },
      { to: "/xai", icon: "psychology", label: "AI explanation" },
      { to: "/journal", icon: "mic", label: "Voice journal" },
    ],
  },
  {
    label: "Wellbeing",
    links: [
      { to: "/nutrition", icon: "restaurant", label: "Nutrition" },
      { to: "/diet", icon: "restaurant_menu", label: "Meal ideas" },
      { to: "/exercise", icon: "fitness_center", label: "Movement" },
      { to: "/education", icon: "menu_book", label: "Learn" },
    ],
  },
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
        border-r border-outline-variant/50 bg-white
        flex-col
        transition-all duration-300 ease-in-out
        shadow-[8px_0_32px_-28px_rgba(43,21,56,0.28)]
        ${collapsed ? "w-20" : "w-72"}
      `}
    >

      {/* LOGO */}
      <Link
        to="/dashboard"
        className={`flex h-[76px] shrink-0 items-center border-b border-outline-variant/50 transition-all duration-300 ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[23px]">spa</span>
        </span>
        {!collapsed && (
          <span>
            <span className="block font-headline-md text-lg font-semibold leading-tight text-primary">
              MenoVerse AI
            </span>
            <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-on-surface-variant">
              Your personal wellness space
            </span>
          </span>
        )}
      </Link>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav aria-label="Main navigation" className="flex flex-col gap-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/75">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const active =
                    location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`)

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      title={collapsed ? link.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center rounded-xl transition-all duration-200 ${
                        collapsed
                          ? "mx-auto h-12 w-12 justify-center"
                          : "w-full gap-3 px-3 py-2.5"
                      } ${
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-on-surface-variant hover:bg-surface-container/80 hover:text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined shrink-0 text-[20px]">
                        {link.icon}
                      </span>
                      {!collapsed && (
                        <span className="truncate text-[13px]">{link.label}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* USER PROFILE */}
      <div className="shrink-0 border-t border-outline-variant/50 p-3">

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
            className="flex items-center gap-3 rounded-2xl border border-outline-variant/55 bg-background/75 p-3 transition-colors hover:bg-surface-container"
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