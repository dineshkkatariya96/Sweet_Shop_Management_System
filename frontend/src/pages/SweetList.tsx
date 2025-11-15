import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Sweet {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export default function SweetList() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const isAdmin = user?.role === "ADMIN";

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/sweets");

      // 🔥 FIX: Map quantity → stock
      const mapped = res.data.sweets.map((s: any) => ({
        ...s,
        stock: s.stock ?? s.quantity,
      }));

      setSweets(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // BUY
  const handleBuy = async (sweetId: number) => {
    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${sweetId}/purchase`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Purchase successful!");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Purchase failed.");
    }
  };

  // DELETE
  const handleDelete = async (sweetId: number) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/sweets/${sweetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Sweet deleted!");
      fetchSweets();

    } catch (err: any) {
      alert(err.response?.data?.error || "Cannot delete sweet.");
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading sweets...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-8">

      <h1 className="text-4xl font-bold text-center mb-10">🍬 Sweet Collections</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {sweets.map((sweet) => (
          <div key={sweet.id}
            className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">

            <h2 className="text-2xl font-bold">{sweet.name}</h2>

            <p className="mt-2"><b>Category:</b> {sweet.category}</p>
            <p className="mt-1"><b>Price:</b> ₹{sweet.price}</p>
            <p className="mt-1"><b>Stock:</b> {sweet.stock}</p>

            {/* CUSTOMER BUY BUTTON */}
            {!isAdmin && sweet.stock > 0 && (
              <button
                onClick={() => handleBuy(sweet.id)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Buy Now
              </button>
            )}

            {/* OUT OF STOCK */}
            {!isAdmin && sweet.stock === 0 && (
              <p className="text-center text-red-600 mt-4 font-semibold">
                Out of Stock
              </p>
            )}

            {/* ADMIN BUTTONS */}
            {isAdmin && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/admin/edit-sweet/${sweet.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(sweet.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}

          </div>
        ))}

      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}
