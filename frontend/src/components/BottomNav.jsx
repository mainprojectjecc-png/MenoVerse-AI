import { Link, useLocation } from "react-router-dom"
import { bottomNavLinks } from "./bottomNavLinks"

export default function BottomNav() {
  const location = useLocation()
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/70 bg-white/90 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-8px_30px_rgba(43,21,56,0.06)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center justify-around">
        {bottomNavLinks.map((link) => {
          const active = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
                active ? "font-semibold text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className={`material-symbols-outlined rounded-xl px-3 py-1 text-[21px] ${
                  active ? "bg-primary-container" : ""
                }`}
              >
                {link.icon}
              </span>
              <span className="truncate text-[10px]">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}