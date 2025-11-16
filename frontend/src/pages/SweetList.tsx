import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import SweetCard from "../components/SweetCard";
import PurchaseModal from "../components/PurchaseModal";

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

  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [purchaseModal, setPurchaseModal] = useState(false);

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

  // BUY SWEET - OPENS MODAL
  const handleBuy = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setPurchaseModal(true);
  };

  // CONFIRM PURCHASE
  const handleConfirmPurchase = async (quantity: number) => {
    if (!selectedSweet) return;

    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${selectedSweet.id}/purchase`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Purchase Successful!");
      fetchSweets();
      setPurchaseModal(false);
    } catch (err: any) {
      alert(err.response?.data?.error || "Purchase failed.");
    }
  };

  // DELETE SWEET
  const handleDelete = async (sweetId: number) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/sweets/${sweetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Sweet Deleted!");
      fetchSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-bounce mb-4">
          <div className="h-16 w-16 bg-linear-to-r from-purple-600 to-pink-600 rounded-full" />
        </div>
        <p className="text-2xl font-bold text-gray-900">Loading sweets...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-10 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
              🍬 Sweet Collection
            </span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl font-medium">
            Discover our delicious and premium sweets
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="mb-12 glass rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-0 sm:flex gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sweets by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/80"
              />
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-none">
              <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-full sm:w-48 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/80 appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Milk">Milk</option>
                <option value="Dryfruit">Dryfruit</option>
                <option value="Sugar-free">Sugar-free</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-400/50 text-white rounded-xl font-semibold transition-all transform active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* NO SWEETS MESSAGE */}
        {sweets.length === 0 && !error && (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-2xl font-bold text-gray-700">😕 No sweets found</p>
            <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CUSTOMER SWEET CARDS */}
        {!isAdmin && sweets.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}

        {/* ADMIN SWEET MANAGEMENT */}
        {isAdmin && sweets.length > 0 && (
          <div className="space-y-4">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all animate-fade-in-up"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {sweet.name}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Category</p>
                        <p className="text-gray-900 font-semibold">{sweet.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Price</p>
                        <p className="text-lg font-bold text-green-600">₹{sweet.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Stock</p>
                        <p
                          className={`text-lg font-bold ${
                            sweet.stock > 10
                              ? "text-green-600"
                              : sweet.stock > 0
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {sweet.stock}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">ID</p>
                        <p className="text-gray-900 font-semibold">{sweet.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN ACTION BUTTONS */}
                  <div className="w-full sm:w-auto flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-sweet/${sweet.id}`)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                      <PencilIcon className="h-5 w-5" />
                      Edit
                    </button>

                    <button
                      onClick={() => navigate(`/admin/restock/${sweet.id}`)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                      <ArchiveBoxIcon className="h-5 w-5" />
                      Restock
                    </button>

                    <button
                      onClick={() => handleDelete(sweet.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-linear-to-r from-gray-800 to-black text-white rounded-xl font-semibold hover:shadow-lg transition-all transform active:scale-95"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {purchaseModal && selectedSweet && (
        <PurchaseModal
          sweetName={selectedSweet.name}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setPurchaseModal(false)}
        />
      )}
    </div>
  );
}
