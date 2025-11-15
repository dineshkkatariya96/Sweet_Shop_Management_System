import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.email} 👋
      </h1>

      <p className="text-gray-700 text-lg">
        Here you can browse sweets, purchase items, and track your orders.
      </p>

      <div className="mt-6">
        <a
          href="/sweets"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Sweets 🍬
        </a>
      </div>
    </div>
  );
}
