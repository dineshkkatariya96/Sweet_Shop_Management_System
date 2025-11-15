import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Sweet Shop 🍬
      </Link>
      <Link className="hover:text-blue-600" to="/orders">
        My Orders
      </Link>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link className="hover:text-blue-600" to="/login">
              Login
            </Link>
            <Link className="hover:text-blue-600" to="/register">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link className="hover:text-blue-600" to="/dashboard">
              Dashboard
            </Link>

            {isAdmin && (
              <Link className="hover:text-blue-600" to="/admin">
                Admin Panel
              </Link>
            )}

            {isAdmin && (
              <Link className="hover:text-blue-600" to="/admin/orders">
                Admin Orders
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
