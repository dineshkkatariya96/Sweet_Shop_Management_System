import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArchiveBoxIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function RestockSweet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${id}/restock`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Sweet restocked successfully!");
      setSuccess(true);
      setAmount("");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "❌ Restock failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-50 to-pink-50 p-4 sm:p-10 pt-24 flex justify-center items-center">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-xl">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg">
            <ArchiveBoxIcon className="h-8 w-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Restock Sweet
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Add quantity to your sweet inventory
        </p>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              success
                ? "bg-green-100 border-2 border-green-300 text-green-700"
                : "bg-red-100 border-2 border-red-300 text-red-700"
            }`}
          >
            {success ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
            )}
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRestock} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Quantity to Add
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all bg-white disabled:bg-gray-100 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/50 transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Restocking..." : "Restock Now"}
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
