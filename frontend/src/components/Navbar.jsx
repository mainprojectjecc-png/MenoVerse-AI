function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      
      {/* Welcome Message */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back 👋
        </h2>

        <p className="text-sm text-gray-500">
          Your wellness journey starts here.
        </p>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          👩
        </div>

        <div>
          <p className="font-medium text-gray-800">
            User
          </p>

          <p className="text-xs text-gray-500">
            Wellness Member
          </p>
        </div>

      </div>

    </header>
  )
}

export default Navbar