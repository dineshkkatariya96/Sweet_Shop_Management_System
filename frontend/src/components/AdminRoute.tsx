import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <h1 className="p-10 text-2xl">Loading...</h1>;

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/not-authorized" />;

  return children;
}
