import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<h1 className="p-10">Home</h1>} />

        {/* Auth pages */}
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>User Dashboard</h1>
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1>Admin Panel</h1>
            </AdminRoute>
          }
        />

        <Route path="/not-authorized" element={<h1>Not Authorized</h1>} />
      </Routes>
    </div>
  );
}
