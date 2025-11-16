import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  PencilIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Input from "../../components/Input";

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

      const sweet = res.data.sweet;

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
          quantity: Number(quantity),
          category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("✅ Sweet updated successfully!");
      setTimeout(() => navigate("/sweets"), 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to update sweet");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-bounce mb-4">
          <div className="h-16 w-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full" />
        </div>
        <p className="text-2xl font-bold text-gray-900">Loading sweet details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-10 pt-24 flex justify-center items-center">
      <div className="w-full max-w-2xl glass rounded-3xl p-8 shadow-xl">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg">
            <PencilIcon className="h-8 w-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Edit Sweet
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Update sweet details
        </p>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 text-green-700 rounded-xl flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEditSweet} className="space-y-6">
          <Input
            label="Sweet Name"
            type="text"
            value={name}
            onChange={setName}
            required
            disabled={loading}
          />

          <Input
            label="Price (₹)"
            type="number"
            value={price}
            onChange={setPrice}
            required
            disabled={loading}
          />

          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={setQuantity}
            required
            disabled={loading}
          />

          <Input
            label="Category"
            type="text"
            value={category}
            onChange={setCategory}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-400/50 transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Sweet"}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate("/sweets")}
          className="w-full mt-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Sweet List
        </button>
      </div>
    </div>
  );
}
