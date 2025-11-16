import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  CakeIcon,
  ShoppingCartIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

interface ActionCardProps {
  to: string;
  icon: React.ReactElement;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "yellow";
}

const ActionCard = ({ to, icon, title, description, color }: ActionCardProps) => {
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
        group p-7 rounded-xl bg-white 
        shadow-md hover:shadow-2xl 
        border border-gray-100
        transition-all duration-300 
        hover:-translate-y-1 hover:scale-[1.02]
        relative overflow-hidden
      "
    >
      {/* Background glow */}
      <div
        className={`
          absolute inset-0 opacity-0 
          group-hover:opacity-20 transition-all
          bg-gradient-to-br ${theme}
        `}
      />

      <div className="flex items-center gap-5 relative z-10">
        {/* Icon Container */}
        <div
          className={`
            p-4 rounded-xl 
            bg-gradient-to-br ${theme}
            text-white shadow-lg
            group-hover:scale-110 transition-transform
          `}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const userName = user.email.split("@")[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen 
      bg-gradient-to-br from-[#dfe9f3] via-[#f9e9ff] to-[#fce6f5] 
      flex justify-center items-start py-16 px-6">

      <div className="
        w-full max-w-5xl 
        bg-white/60 backdrop-blur-xl 
        shadow-2xl rounded-3xl 
        border border-white/40
        p-10 sm:p-12
      ">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Hello, <span className="text-purple-600">{displayName}</span> 👋
          </h1>

          <p className="text-gray-700 text-lg mt-3 font-medium">
            {isAdmin ? "Manage your sweet shop" : "Explore and order your favourite sweets"}
          </p>
        </div>

        <hr className="border-gray-300 opacity-40 mb-10" />

        {/* MAIN ACTION CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <ActionCard
            to="/sweets"
            icon={<CakeIcon className="h-7 w-7" />}
            title="View All Sweets"
            description="Browse our delicious sweet collection"
            color="blue"
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
            <ActionCard
              to="/admin/add-sweet"
              icon={<PlusCircleIcon className="h-7 w-7" />}
              title="Add New Sweet"
              description="Add a new item to your shop"
              color="green"
            />
          )}

          {isAdmin && (
            <ActionCard
              to="/admin/orders"
              icon={<ClipboardDocumentListIcon className="h-7 w-7" />}
              title="View All Orders"
              description="Monitor & manage customer orders"
              color="yellow"
            />
          )}
        </div>

        {/* LOGOUT */}
        <div className="text-center mt-14">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="
              px-8 py-3 rounded-xl 
              bg-gray-900 text-white 
              font-semibold shadow-lg
              hover:bg-black transition-all
            "
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}
