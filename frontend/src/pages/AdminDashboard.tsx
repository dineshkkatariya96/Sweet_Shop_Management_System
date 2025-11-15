import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets", { params: { page: 1 } });
      setSweets(res.data.sweets || []);
    } catch (err: any) {
      console.error("Failed to load sweets:", err);
      alert("Failed to load sweets");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  if (!isAdmin) return <div className="p-8">Not authorized</div>;

  // -----------------------------
  // DELETE SWEET
  // -----------------------------
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;

    try {
      await api.delete(`/sweets/${id}`);
      alert("Sweet deleted");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  // -----------------------------
  // RESTOCK SWEET
  // -----------------------------
  const handleRestock = async (id: number) => {
    const qtyStr = prompt("Enter restock quantity (positive number):", "10");
    if (!qtyStr) return;

    const qty = Number(qtyStr);
    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    try {
      await api.post(`/sweets/${id}/restock`, { quantity: qty });
      alert("Restocked successfully");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Restock failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Link
          to="/admin/sweets/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Sweet
        </Link>
      </div>

      {loading ? (
        <p className="text-lg">Loading sweets...</p>
      ) : sweets.length === 0 ? (
        <p>No sweets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-lg shadow border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{s.name}</h2>

              <p className="text-gray-600 mt-1">Category: {s.category}</p>
              <p className="text-green-600 font-medium mt-1">₹ {s.price}</p>
              <p className="text-sm mt-1">Stock: {s.quantity}</p>

              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to={`/admin/sweets/${s.id}/edit`}
                  className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-center"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleRestock(s.id)}
                  className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
