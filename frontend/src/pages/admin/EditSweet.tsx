import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSweet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Existing Sweet Details
  const fetchSweet = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/sweets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sweet = res.data;

      setName(sweet.name);
      setPrice(String(sweet.price));
      setQuantity(String(sweet.quantity));
      setCategory(sweet.category);

    } catch (err: any) {
      setErrorMsg("Failed to load sweet details.");
    } finally {
      setFetching(false);
    }
  };

  // Auto-run on load
  useEffect(() => {
    fetchSweet();
  }, []);

  const handleEditSweet = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.put(
        `http://localhost:3000/api/sweets/${id}`,
        {
          name,
          price: Number(price),
          quantity: Number(quantity), // ✔ important
          category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Sweet updated successfully!");

    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to update sweet");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading sweet details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ✏️ Edit Sweet
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

        <form onSubmit={handleEditSweet} className="space-y-5">

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Sweet Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Price (₹)
            </label>
            <input
              required
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Quantity
            </label>
            <input
              required
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <input
              required
              type="text"
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
            {loading ? "Updating..." : "Update Sweet"}
          </button>

        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all"
        >
          ⬅ Back to Dashboard
        </button>

      </div>
    </div>
  );
}
