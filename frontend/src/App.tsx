import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<h1 className="p-10">Home</h1>} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1 className="p-10">User Dashboard</h1>
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1 className="p-10">Admin Panel</h1>
            </AdminRoute>
          }
        />

        <Route path="/not-authorized" element={<h1>Not Authorized</h1>} />
      </Routes>
    </div>
  );
}
