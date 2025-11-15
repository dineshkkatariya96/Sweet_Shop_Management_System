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

  // Fetch sweets
  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/sweets");
      setSweets(res.data.sweets || res.data);
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

  // Buy sweet (customer)
  const handleBuy = async (sweetId: number) => {
    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${sweetId}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Purchase successful!");
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Purchase failed.");
    }
  };

  // Admin delete sweet
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
      alert(err.response?.data?.message || "Cannot delete sweet.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading sweets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        🍬 Sweet Collections
      </h1>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
      )}

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sweets.map((sweet) => (
          <div
            key={sweet.id}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {sweet.name}
            </h2>

            <p className="text-gray-700 mb-2">
              <strong>Category:</strong> {sweet.category}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Price:</strong> ₹{sweet.price}
            </p>

            <p className="text-gray-700 mb-4">
              <strong>Stock:</strong> {sweet.stock}
            </p>

            {/* USER Button */}
            {(!isAdmin && sweet.stock > 0) && (
              <button
                onClick={() => handleBuy(sweet.id)}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
              >
                Buy Now
              </button>
            )}

            {/* Out of stock */}
            {!isAdmin && sweet.stock === 0 && (
              <p className="text-red-600 font-semibold text-center">
                Out of Stock
              </p>
            )}

            {/* ADMIN Buttons */}
            {isAdmin && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/admin/edit-sweet/${sweet.id}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(sweet.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all shadow"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}
