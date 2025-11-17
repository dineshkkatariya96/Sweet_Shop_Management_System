// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  CakeIcon,
  ShoppingCartIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface ActionCardProps {
  to: string;
  icon: React.ReactElement;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "yellow";
  badge?: string;
}

const ActionCard = ({
  to,
  icon,
  title,
  description,
  color,
  badge,
}: ActionCardProps) => {
  const theme = {
    purple: "from-purple-500 to-purple-700",
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    yellow: "from-yellow-400 to-yellow-600",
  }[color];

  return (
    <Link
      to={to}
      className="
        group p-6 sm:p-8 rounded-2xl bg-white 
        shadow-lg hover:shadow-2xl 
        border-2 border-gray-100
        transition-all duration-300 
        hover:-translate-y-3 hover:scale-[1.05]
        relative overflow-hidden
        card-hover
        flex flex-col justify-between h-full
      "
    >
      <div
        className={`
          absolute inset-0 opacity-0 
          group-hover:opacity-20 transition-all
          bg-linear-to-br ${theme}
        `}
      />
      {badge && (
        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
          {badge}
        </div>
      )}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-start justify-between">
          <div
            className={`
              p-4 rounded-xl 
              bg-linear-to-br ${theme}
              text-white shadow-lg
              group-hover:scale-110 transition-transform
            `}
          >
            {icon}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 transition-all">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
      </div>

      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1">
        <span className="text-purple-600 font-bold">→</span>
      </div>
    </Link>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  color: string;
  subtext?: string;
}) => (
  <div className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-white/60">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-3 rounded-lg bg-linear-to-br ${color} text-white shadow-md`}>
        {icon}
      </div>
      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
    </div>
    <p className="text-gray-600 text-sm font-medium">{label}</p>
    <p className="text-3xl font-extrabold text-gray-900 mt-2">{value}</p>
    {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState<{ sweets: number; orders: number }>({ sweets: 0, orders: 0 });
  const [loading, setLoading] = useState(false);

  // If user is not present, redirect to login
  useEffect(() => {
  if (!loading && !user) {
    navigate("/login");
  }
}, [user, loading, navigate]);


  useEffect(() => {
    // fetch only when user exists
    if (!user) return;

    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      try {
        // use your api instance (interceptor adds Authorization header)
        const sweetsRes = await api.get("/sweets");
        const ordersUrl = user.role === "ADMIN" ? "/admin/orders" : "/orders";
        const ordersRes = await api.get(ordersUrl);

        if (!cancelled) {
          setStats({
            sweets: Array.isArray(sweetsRes.data?.sweets) ? sweetsRes.data.sweets.length : 0,
            orders: Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders.length : 0,
          });
        }
      } catch (err: any) {
        // handle 401: clear stored auth and redirect to login
        const status = err?.response?.status;
        if (status === 401) {
          console.warn("Auth error - logging out");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser && setUser(null as any);
          navigate("/login");
        } else {
          console.error("Error fetching stats:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [user, navigate, setUser]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const userName = (user.email || "").split("@")[0] || "User";
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-start py-16 px-4 pt-24">
      <div className="w-full max-w-6xl">
        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 sm:p-12 mb-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <SparklesIcon className="h-12 w-12 text-purple-600 animate-bounce-soft" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-2">
              Hello,{" "}
              <span className="text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
                {displayName}
              </span>{" "}
              👋
            </h1>

            <p className="text-gray-700 text-lg sm:text-xl mt-3 font-medium">
              {isAdmin ? "🏪 Manage your sweet shop with ease" : "🍬 Explore and order your favourite sweets"}
            </p>
          </div>

          <div className="border-t-2 border-gray-200" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <div className="glass rounded-xl p-4 text-center border border-white/60">
              <p className="text-gray-600 text-sm font-medium">Role</p>
              <p className="text-lg font-bold text-purple-600 mt-2">
                {isAdmin ? "👨‍💼 Admin" : "👤 Customer"}
              </p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/60">
              <p className="text-gray-600 text-sm font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-2 truncate">{user.email}</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/60 col-span-2 sm:col-span-1">
              <p className="text-gray-600 text-sm font-medium">Status</p>
              <p className="text-lg font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                <CheckCircleIcon className="h-5 w-5" /> Active
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<CakeIcon className="h-6 w-6" />}
            label="Total Sweets"
            value={loading ? "…" : stats.sweets}
            color="from-blue-500 to-blue-700"
            subtext="In our collection"
          />
          <StatCard
            icon={<ShoppingCartIcon className="h-6 w-6" />}
            label={isAdmin ? "Total Orders" : "My Orders"}
            value={loading ? "…" : stats.orders}
            color="from-purple-500 to-purple-700"
            subtext={isAdmin ? "From all customers" : "Your purchases"}
          />
          <StatCard
            icon={<FireIcon className="h-6 w-6" />}
            label="Member Since"
            value="Today"
            color="from-pink-500 to-pink-700"
            subtext="Welcome aboard!"
          />
        </div>

        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <ActionCard
              to="/sweets"
              icon={<CakeIcon className="h-7 w-7" />}
              title="View All Sweets"
              description="Browse our delicious sweet collection"
              color="blue"
              badge="Popular"
            />

            {!isAdmin && (
              <ActionCard
                to="/orders"
                icon={<ShoppingCartIcon className="h-7 w-7" />}
                title="My Orders"
                description="Track and review your past purchases"
                color="purple"
              />
            )}

            {isAdmin && (
              <>
                <ActionCard
                  to="/admin/add-sweet"
                  icon={<PlusCircleIcon className="h-7 w-7" />}
                  title="Add New Sweet"
                  description="Add a new item to your shop inventory"
                  color="green"
                />

                <ActionCard
                  to="/admin/orders"
                  icon={<ClipboardDocumentListIcon className="h-7 w-7" />}
                  title="View All Orders"
                  description="Monitor & manage all customer orders"
                  color="yellow"
                />
              </>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 mt-8 text-center animate-fade-in-up">
          <p className="text-gray-700 font-medium mb-2">
            {isAdmin ? "👨‍💼 Welcome to your admin dashboard!" : "🍬 Ready to explore delicious sweets?"}
          </p>
          <p className="text-gray-600 text-sm">
            {isAdmin
              ? "Manage your inventory, track orders, and grow your business."
              : "Browse, search, and order your favorite sweets in just a few clicks."}
          </p>
        </div>
      </div>
    </div>
  );
}
