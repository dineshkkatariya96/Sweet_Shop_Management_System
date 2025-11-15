import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddSweet() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.post(
        "http://localhost:3000/api/sweets",
        {
          name,
          price: Number(price),
          quantity: Number(quantity),   // ✅ FIXED (Backend expects quantity)
          category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("🎉 Sweet added successfully!");
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");

    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to add sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🍬 Add New Sweet
        </h2>

        {successMsg && (
          <p className="text-green-600 font-semibold mb-4 text-center">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="text-red-600 font-semibold mb-4 text-center">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleAddSweet} className="space-y-5">

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Sweet Name</label>
            <input
              required
              type="text"
              placeholder="Kaju Katli"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Price (₹)</label>
            <input
              required
              type="number"
              placeholder="350"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
            <input
              required
              type="number"
              placeholder="20"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Category</label>
            <input
              required
              type="text"
              placeholder="Milk, Dryfruit, Sugar-free..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 transition-all ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Adding..." : "Add Sweet"}
          </button>

        </form>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="w-full mt-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all"
        >
          ⬅ Back to Dashboard
        </button>

      </div>
    </div>
  );
}
