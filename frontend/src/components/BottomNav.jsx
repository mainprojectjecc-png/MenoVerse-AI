import { Link, useLocation } from "react-router-dom"
const links = [
  { to: "/dashboard", icon: "home", label: "Home" },
  { to: "/cycle", icon: "calendar_month", label: "Cycle" },
  { to: "/symptoms", icon: "edit_note", label: "Symptoms" },
  { to: "/insights", icon: "analytics", label: "Insights" },
  { to: "/profile", icon: "person", label: "Profile" },
]
export default function BottomNav() {
  const location = useLocation()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF7F0] border-t border-[#e8e2cf] flex justify-around py-2 z-40 lg:hidden">
      {links.map(l => {
        const active = location.pathname === l.to
        return (
          <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${active? "text-[#535845]" : "text-gray-500"}`}>
            <span className="material-symbols-outlined text-[22px]">{l.icon}</span>
            <span className="text-[10px]">{l.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}