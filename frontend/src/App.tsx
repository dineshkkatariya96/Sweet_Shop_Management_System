import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SweetList from "./pages/SweetList";
import OrderHistory from "./pages/OrderHistory";
import AddSweet from "./pages/admin/AddSweet";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1 className="p-10">Home</h1>} />
        <Route
          path="/sweets"
          element={
            <ProtectedRoute>
              <SweetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrderHistory />
            </AdminRoute>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/admin/orders" element={<AdminOrderHistory />} />
         <Route path="/admin/add-sweet" element={
  <AdminRoute>
    <AddSweet />
  </AdminRoute>
} />

        {/* Protected - User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
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
