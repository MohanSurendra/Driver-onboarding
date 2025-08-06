// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Step1 from "./pages/Dashboard/Step1";
import Step2 from "./pages/Dashboard/Step2";
import Step2_5 from "./pages/Dashboard/Step2_5";
import Step3 from "./pages/Dashboard/Step3";
import Step4 from "./pages/Dashboard/Step4";
import Step5 from "./pages/Dashboard/Step5";
import HomeDashboard from "./pages/Dashboard/HomeDashboard";
import StatusCheck from "./pages/Dashboard/StatusCheck";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminReview from "./pages/Admin/AdminReview";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/status-check" element={<StatusCheck />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/step1" element={<ProtectedRoute><Step1 /></ProtectedRoute>} />
        <Route path="/dashboard/step2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
        <Route path="/dashboard/step2_5" element={<ProtectedRoute><Step2_5 /></ProtectedRoute>} />
        <Route path="/dashboard/step3" element={<ProtectedRoute><Step3 /></ProtectedRoute>} />
        <Route path="/dashboard/step4" element={<ProtectedRoute><Step4 /></ProtectedRoute>} />
        <Route path="/dashboard/step5" element={<ProtectedRoute><Step5 /></ProtectedRoute>} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/review/:driverId"
          element={
            <ProtectedRoute adminOnly>
              <AdminReview />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
