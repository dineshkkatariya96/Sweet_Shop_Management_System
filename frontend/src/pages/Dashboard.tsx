import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 shadow-xl backdrop-blur-md rounded-2xl p-10 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
            Welcome, {user.email.split("@")[0]} 👋
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            {isAdmin ? "Administrator Dashboard" : "Customer Dashboard"}
          </p>
        </div>

        {/* Menu */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* View sweets */}
          <button
            onClick={() => navigate("/sweets")}
            className="p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-center text-lg font-semibold transition-all"
          >
            🍬 View All Sweets
          </button>

          {/* User orders */}
          {!isAdmin && (
            <button
              onClick={() => navigate("/orders")}
              className="p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md text-center text-lg font-semibold transition-all"
            >
              🛒 My Orders
            </button>
          )}

          {/* Admin: Add sweet */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/add-sweet")}
              className="p-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md text-center text-lg font-semibold transition-all"
            >
              ➕ Add New Sweet
            </button>
          )}

          {/* Admin: View all orders */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/orders")}
              className="p-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md text-center text-lg font-semibold transition-all"
            >
              📦 View All Orders
            </button>
          )}

          {/* Admin: Manage sweets */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/manage-sweets")}
              className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md text-center text-lg font-semibold transition-all"
            >
              🛠 Manage Sweets
            </button>
          )}
        </div>

        {/* Logout */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
