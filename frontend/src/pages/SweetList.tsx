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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const isAdmin = user?.role === "ADMIN";

  // Fetch sweets API
  const fetchSweets = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category) query.append("category", category);

      const res = await axios.get(
        `http://localhost:3000/api/sweets?${query.toString()}`
      );

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSweets();
  };

  // BUY SWEET
  const handleBuy = async (sweetId: number) => {
    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${sweetId}/purchase`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Purchase Successful!");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Purchase failed.");
    }
  };

  // DELETE SWEET
  const handleDelete = async (sweetId: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/sweets/${sweetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Sweet Deleted!");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading sweets...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fce1ff] via-[#e0d7ff] to-[#c5e1ff] p-10">

      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-900 tracking-wide drop-shadow-lg">
        🍬 Our Delicious Sweet Collection
      </h1>

      {/* Search / Filter */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
      >
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 w-full sm:w-80 rounded-2xl bg-white shadow-md border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <select
          className="px-4 py-3 rounded-2xl bg-white border shadow-md focus:ring-2 focus:ring-purple-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Milk">Milk</option>
          <option value="Dryfruit">Dryfruit</option>
          <option value="Sugar-free">Sugar-free</option>
        </select>

        <button
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md font-semibold transition"
        >
          🔍 Search
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
      )}

      {/* SWEET CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sweets.map((sweet) => (
          <div
            key={sweet.id}
            className="
              bg-white/70 backdrop-blur-md
              border border-white/50
              p-7 rounded-3xl shadow-xl 
              hover:shadow-3xl transition-all 
              hover:-translate-y-1
            "
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {sweet.name}
            </h2>

            <div className="space-y-1 text-gray-700">
              <p><strong>Category:</strong> {sweet.category}</p>
              <p><strong>Price:</strong> ₹{sweet.price}</p>
              <p>
                <strong>Stock Left:</strong>{" "}
                <span
                  className={
                    sweet.stock === 0
                      ? "text-red-600 font-bold"
                      : "text-green-700 font-semibold"
                  }
                >
                  {sweet.stock}
                </span>
              </p>
            </div>

            {/* BUY BUTTON - CUSTOMER */}
            {!isAdmin && sweet.stock > 0 && (
              <button
                onClick={() => handleBuy(sweet.id)}
                className="
                  w-full mt-5 py-3 
                  bg-green-600 hover:bg-green-700 
                  text-white font-semibold 
                  rounded-xl shadow transition
                "
              >
                🛒 Buy Now
              </button>
            )}

            {!isAdmin && sweet.stock === 0 && (
              <p className="text-center mt-5 text-red-600 font-semibold">
                ❌ Out of Stock
              </p>
            )}

            {/* ADMIN BUTTONS */}
            {isAdmin && (
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => navigate(`/admin/edit-sweet/${sweet.id}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => navigate(`/admin/restock/${sweet.id}`)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow"
                >
                  📦 Restock
                </button>

                <button
                  onClick={() => handleDelete(sweet.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow"
                >
                  ❌ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="
            px-8 py-3 rounded-xl 
            bg-gray-900 text-white 
            hover:bg-black transition shadow-lg
          "
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}
