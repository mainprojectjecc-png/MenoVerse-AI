import { NavLink } from "react-router-dom"

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Cycle Tracking",
      path: "/cycle",
      icon: "📅",
    },
    {
      name: "Symptoms",
      path: "/symptoms",
      icon: "📝",
    },
  ]

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">

      {/* Logo */}
      <div className="mb-8 px-3">
        <h1 className="text-2xl font-bold text-pink-600">
          MenoVerse AI
        </h1>

        <p className="text-sm text-gray-500">
          Your health companion
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}

export default Sidebar