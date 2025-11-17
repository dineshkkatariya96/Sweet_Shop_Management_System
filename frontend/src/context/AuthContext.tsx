// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
  id: string; // <- changed to string (backend uses string IDs)
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (u: User | null, token?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (token && userData) {
      try {
        setUserState(JSON.parse(userData));
      } catch {
        // ignore parse errors
      }
    }

    setLoading(false);
  }, []);

  // setUser now optionally accepts token so login code can call setUser(user, token)
  const setUser = (u: User | null, token?: string | null) => {
    setUserState(u);

    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }

    // if token provided, persist and attach to api
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "ADMIN",
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
