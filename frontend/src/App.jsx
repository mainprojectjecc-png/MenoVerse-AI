import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import CycleTracking from "./pages/CycleTracking";
import Symptoms from "./pages/Symptoms";
import Journal from "./pages/VoiceJournal";
import Insights from "./pages/Insights";
import Nutrition from "./pages/Nutrition";
import Exercise from "./pages/Exercise";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            COMMON LAYOUT
        ================================= */}

        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Cycle Tracking */}
          <Route
            path="/cycle"
            element={<CycleTracking />}
          />

          {/* Symptoms */}
          <Route
            path="/symptoms"
            element={<Symptoms />}
          />

          {/* Voice Journal */}
          <Route
            path="/journal"
            element={<Journal />}
          />

          {/* Insights */}
          <Route
            path="/insights"
            element={<Insights />}
          />

          {/* Nutrition */}
          <Route
            path="/nutrition"
            element={<Nutrition />}
          />

          {/* Exercise */}
          <Route
            path="/exercise"
            element={<Exercise />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* ================================
            DEFAULT ROUTE
        ================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ================================
            404 ROUTE
        ================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;