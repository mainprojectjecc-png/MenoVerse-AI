function StatCard({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      
      <div className="flex items-center justify-between">
        
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {value}
          </h3>
        </div>

        <div className="text-2xl">
          {icon}
        </div>

      </div>

      <p className="text-xs text-gray-500 mt-3">
        {description}
      </p>

    </div>
  )
}

export default StatCard