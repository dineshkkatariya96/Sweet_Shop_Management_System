import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-300">

        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-4">
          Welcome, {user?.email}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Manage your sweets, view orders and explore app features.
        </p>

        <div className="space-y-4">

          <button
            onClick={() => navigate("/sweets")}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
          >
            🍬 View Sweets
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            🛒 Your Orders
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
            >
              🔧 Admin Dashboard
            </button>
          )}

          <button
            onClick={logout}
            className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition"
          >
            🚪 Logout
          </button>

        </div>
      </div>
    </div>
  );
}
