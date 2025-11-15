import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SweetList from "./pages/SweetList";
import OrderHistory from "./pages/OrderHistory";
import AdminOrderHistory from "./pages/AdminOrderHistory";

import AddSweet from "./pages/admin/AddSweet";
import EditSweet from "./pages/admin/EditSweet";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<h1 className="p-10">Home</h1>} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PROTECTED ROUTES */}
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1 className="p-10">Admin Panel</h1>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-sweet"
          element={
            <AdminRoute>
              <AddSweet />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-sweet/:id"
          element={
            <AdminRoute>
              <EditSweet />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrderHistory />
            </AdminRoute>
          }
        />

        {/* NOT AUTHORIZED */}
        <Route path="/not-authorized" element={<h1>Not Authorized</h1>} />
      </Routes>
    </div>
  );
}
