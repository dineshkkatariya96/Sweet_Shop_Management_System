import { useEffect, useState } from "react";
import axios from "axios";

export default function SweetsList() {
  const [sweets, setSweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSweets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/sweets?search=${search}`
      );
      setSweets(res.data.sweets);
    } catch (err) {
      console.error("Error fetching sweets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-center text-pink-700 mb-4">
          🍬 Sweets Collection
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search sweets..."
          className="w-full px-4 py-2 mb-4 rounded-lg border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-center text-gray-700">Loading sweets...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {sweet.name}
                </h3>
                <p className="text-gray-600 mt-1">Category: {sweet.category}</p>
                <p className="text-gray-900 font-bold mt-2">₹{sweet.price}</p>
                <p className="text-gray-600">Stock: {sweet.quantity}</p>

                <button className="mt-4 w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
