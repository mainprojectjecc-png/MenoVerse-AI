import { Link, useLocation } from "react-router-dom"

export default function BottomNav() {
  const location = useLocation()
  const path = location.pathname

  const isActive = (p) => path.startsWith(p)

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#FAF7F0]/90 backdrop-blur-lg flex justify-around items-center px-2 pb-7 pt-3 border-t border-[#D1CEC0]/30 md:hidden">
      
      <Link to="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-[#535845]' : 'text-[#464740]'}`}>
        <span className="material-symbols-outlined text-[26px]" style={{fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "'FILL' 0"}}>home</span>
        <span className={`text-[11px] mt-1 ${isActive('/dashboard') ? 'font-bold' : ''}`}>Home</span>
      </Link>

      <Link to="/cycle" className={`flex flex-col items-center ${isActive('/cycle') ? 'text-[#535845]' : 'text-[#464740]'}`}>
        <span className="material-symbols-outlined text-[26px]" style={{fontVariationSettings: isActive('/cycle') ? "'FILL' 1" : "'FILL' 0"}}>calendar_today</span>
        <span className={`text-[11px] mt-1 ${isActive('/cycle') ? 'font-bold' : ''}`}>Tracking</span>
      </Link>

      <Link to="/symptoms" className={`flex flex-col items-center ${isActive('/symptoms') ? 'text-[#535845]' : 'text-[#464740]'}`}>
        <span className="material-symbols-outlined text-[26px]" style={{fontVariationSettings: isActive('/symptoms') ? "'FILL' 1" : "'FILL' 0"}}>edit_note</span>
        <span className={`text-[11px] mt-1 ${isActive('/symptoms') ? 'font-bold' : ''}`}>Symptoms</span>
      </Link>

      <Link to="/insights" className={`flex flex-col items-center ${isActive('/insights') ? 'text-[#535845]' : 'text-[#464740]'}`}>
        <span className="material-symbols-outlined text-[26px]" style={{fontVariationSettings: isActive('/insights') ? "'FILL' 1" : "'FILL' 0"}}>insights</span>
        <span className={`text-[11px] mt-1 ${isActive('/insights') ? 'font-bold' : ''}`}>Insights</span>
      </Link>

    </nav>
  )
}