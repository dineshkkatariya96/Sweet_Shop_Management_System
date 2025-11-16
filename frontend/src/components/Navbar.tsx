import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg px-4 sm:px-6 py-4 border-b-2 border-purple-100/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text hover:scale-110 transition-transform"
        >
          🍬 Sweet Shop
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-4 sm:gap-6">
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 font-semibold hover:text-purple-600 transition-all hover:scale-110"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 sm:px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:text-purple-600 transition-all rounded-lg hover:bg-purple-50"
              >
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </Link>

              {/* My Orders Link (Customer Only) */}
              {!isAdmin && (
                <Link
                  to="/orders"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:text-purple-600 transition-all rounded-lg hover:bg-purple-50"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Orders
                </Link>
              )}

              {/* Admin Orders Link (Admin Only) */}
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold hover:text-orange-600 transition-all rounded-lg hover:bg-orange-50"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                  Orders
                </Link>
              )}

              {/* Mobile Menu Icon */}
              <button
                onClick={() => navigate("/dashboard")}
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <HomeIcon className="h-6 w-6 text-gray-700" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-all hover:scale-105"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}