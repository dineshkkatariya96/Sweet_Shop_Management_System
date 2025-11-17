import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  PlusCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Input from "../../components/Input";

export default function AddSweet() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSweet = async (e: any) => {
    e.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (!name || !price || !quantity || !category) {
      setErrorMsg("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/sweets", {
        name,
        price: Number(price),
        quantity: Number(quantity),
        category,
      });

      setSuccessMsg("Sweet added successfully!");
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");
    } catch (err: any) {
      console.log(err);

      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Failed to add sweet");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-yellow-50 p-4 sm:p-10 pt-24 flex justify-center items-center">
      <div className="w-full max-w-2xl glass rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
            <PlusCircleIcon className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Add New Sweet
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Add a delicious sweet to your inventory
        </p>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 text-green-700 rounded-xl flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddSweet} className="space-y-6">
          <Input
            label="Sweet Name"
            type="text"
            placeholder="e.g., Kaju Katli"
            value={name}
            onChange={setName}
            required
            disabled={loading}
          />

          <Input
            label="Price (₹)"
            type="number"
            placeholder="e.g., 350"
            value={price}
            onChange={setPrice}
            required
            disabled={loading}
          />

          <Input
            label="Quantity"
            type="number"
            placeholder="e.g., 50"
            value={quantity}
            onChange={setQuantity}
            required
            disabled={loading}
          />

          <Input
            label="Category"
            type="text"
            placeholder="e.g., Milk, Dryfruit, Sugar-free"
            value={category}
            onChange={setCategory}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60"
          >
            {loading ? "Adding Sweet..." : "Add Sweet"}
          </button>
        </form>

        <button
          onClick={() => navigate("/sweets")}
          className="w-full mt-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Sweet List
        </button>
      </div>
    </div>
  );
}
