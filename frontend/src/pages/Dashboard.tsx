import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
      {/* Background glow */}
      <div
        className={`
          absolute inset-0 opacity-0 
          group-hover:opacity-20 transition-all
          bg-linear-to-br ${theme}
        `}
      />

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
          {badge}
        </div>
      )}

      <div className="flex flex-col gap-4 relative z-10">
        {/* Icon Container */}
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
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
      </div>

      {/* Hover Arrow */}
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
  const { user } = useAuth();
  const [stats, setStats] = useState({ sweets: 0, orders: 0 });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const sweetsRes = await axios.get("http://localhost:3000/api/sweets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersRes = await axios.get(
          user?.role === "ADMIN"
            ? "http://localhost:3000/api/admin/orders"
            : "http://localhost:3000/api/orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStats({
          sweets: sweetsRes.data.sweets?.length || 0,
          orders: ordersRes.data.orders?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const userName = user.email.split("@")[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-start py-16 px-4 pt-24">
      <div className="w-full max-w-6xl">
        {/* HEADER */}
        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 sm:p-12 mb-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <SparklesIcon className="h-12 w-12 text-purple-600 animate-bounce-soft" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-2">
              Hello, <span className="text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
                {displayName}
              </span>
              👋
            </h1>

            <p className="text-gray-700 text-lg sm:text-xl mt-3 font-medium">
              {isAdmin
                ? "🏪 Manage your sweet shop with ease"
                : "🍬 Explore and order your favourite sweets"}
            </p>
          </div>

          <div className="border-t-2 border-gray-200" />

          {/* USER INFO CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <div className="glass rounded-xl p-4 text-center border border-white/60">
              <p className="text-gray-600 text-sm font-medium">Role</p>
              <p className="text-lg font-bold text-purple-600 mt-2">
                {isAdmin ? "👨‍💼 Admin" : "👤 Customer"}
              </p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/60">
              <p className="text-gray-600 text-sm font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-2 truncate">
                {user.email}
              </p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/60 col-span-2 sm:col-span-1">
              <p className="text-gray-600 text-sm font-medium">Status</p>
              <p className="text-lg font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                <CheckCircleIcon className="h-5 w-5" /> Active
              </p>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<CakeIcon className="h-6 w-6" />}
            label="Total Sweets"
            value={stats.sweets}
            color="from-blue-500 to-blue-700"
            subtext="In our collection"
          />
          <StatCard
            icon={<ShoppingCartIcon className="h-6 w-6" />}
            label={isAdmin ? "Total Orders" : "My Orders"}
            value={stats.orders}
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

        {/* ACTION CARDS */}
        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Browse Sweets - All Users */}
            <ActionCard
              to="/sweets"
              icon={<CakeIcon className="h-7 w-7" />}
              title="View All Sweets"
              description="Browse our delicious sweet collection"
              color="blue"
              badge="Popular"
            />

            {/* Customer-Only Card */}
            {!isAdmin && (
              <ActionCard
                to="/orders"
                icon={<ShoppingCartIcon className="h-7 w-7" />}
                title="My Orders"
                description="Track and review your past purchases"
                color="purple"
              />
            )}

            {/* Admin-Only Cards */}
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

        {/* WELCOME MESSAGE */}
        <div className="glass rounded-3xl shadow-2xl border-2 border-white/40 p-8 mt-8 text-center animate-fade-in-up">
          <p className="text-gray-700 font-medium mb-2">
            {isAdmin
              ? "👨‍💼 Welcome to your admin dashboard!"
              : "🍬 Ready to explore delicious sweets?"}
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
