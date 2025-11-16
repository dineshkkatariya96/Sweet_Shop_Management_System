import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import a relevant icon for the logout button
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    // --- UI Improvement ---
    // 1. sticky top-0: Makes the navbar stay at the top.
    // 2. z-50: Ensures it's above other content.
    // 3. bg-white/80 backdrop-blur-md: The exact "glassmorphism" effect from your forms.
    // 4. shadow-lg: A slightly stronger shadow to make it "pop".
    // 5. border-b...: A subtle border to match the form card.
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center border-b border-white/30">
      
      {/* --- UI Improvement: Themed Logo --- */}
      <Link 
        to="/" 
        className="text-2xl font-extrabold text-purple-600 hover:text-purple-700 transition"
      >
        Sweet Shop 🍬
      </Link>

      {/* --- UI Improvement: Grouped & Themed Links --- */}
      <div className="flex items-center gap-6">
        {!user && (
          <>
            <Link 
              to="/login" 
              className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Login
            </Link>
            {/* Themed "primary" button */}
            <Link 
              to="/register"
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {/* Themed "text" links */}
            <Link 
              to="/dashboard"
              className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/orders"
              className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              My Orders
            </Link>

            {isAdmin && (
              <Link 
                to="/admin/orders"
                className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Admin Orders
              </Link>
            )}

            {/* Themed "danger" button/link */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}