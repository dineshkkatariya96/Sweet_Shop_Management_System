import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  // ⏳ Wait until AuthContext loads user from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  // ❌ No user after loading → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → render page
  return children;
}
