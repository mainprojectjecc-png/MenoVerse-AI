import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import CycleTracking from "./pages/CycleTracking"
import Symptoms from "./pages/Symptoms"
import Insights from "./pages/Insights"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cycle" element={<CycleTracking />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App