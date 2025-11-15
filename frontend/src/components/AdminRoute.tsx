import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: any) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/not-authorized" />;

  return children;
}
