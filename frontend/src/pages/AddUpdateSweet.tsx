import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  PencilSquareIcon,
  PlusCircleIcon,
  CurrencyRupeeIcon,
  Squares2X2Icon,
  CubeIcon
} from "@heroicons/react/24/solid";

type Payload = {
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export default function AddUpdateSweet() {
  const { id } = useParams<{ id?: string }>();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [payload, setPayload] = useState<Payload>({
    name: "",
    category: "",
    price: 1,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sweet details when editing
  useEffect(() => {
    if (!editing) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/sweets/${id}`);
        const s = res.data.sweet || res.data;

        setPayload({
          name: s.name,
          category: s.category,
          price: s.price,
          quantity: s.quantity,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load sweet");
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  if (!isAdmin)
    return (
      <div className="p-10 text-center text-xl text-red-600 font-semibold">
        ❌ Not authorized
      </div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (payload.price <= 0) return setError("Price must be greater than 0");
    if (payload.quantity < 0) return setError("Quantity cannot be negative");

    try {
      setLoading(true);
      if (editing && id) {
        await api.put(`/sweets/${id}`, payload);
        alert("Sweet updated successfully!");
      } else {
        await api.post("/sweets", payload);
        alert("Sweet added successfully!");
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 
      flex justify-center items-center p-8
    ">
      <div
        className="
          w-full max-w-2xl 
          bg-white/70 backdrop-blur-xl 
          border border-white/40 
          shadow-2xl rounded-3xl 
          p-10
        "
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 flex justify-center items-center gap-3">
            {editing ? (
              <>
                <PencilSquareIcon className="h-9 w-9 text-blue-700" /> Edit Sweet
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-9 w-9 text-green-700" /> Add New Sweet
              </>
            )}
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            {editing ? "Modify sweet details" : "Create a new sweet item"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-medium shadow">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Sweet Name</label>
            <div className="relative">
              <input
                value={payload.name}
                onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                required
                className="
                  w-full px-4 py-3 pr-10
                  border rounded-xl shadow-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none
                "
              />
              <Squares2X2Icon className="h-6 w-6 text-gray-500 absolute right-3 top-3" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <div className="relative">
              <input
                value={payload.category}
                onChange={(e) => setPayload({ ...payload, category: e.target.value })}
                required
                className="
                  w-full px-4 py-3 pr-10
                  border rounded-xl shadow-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none
                "
              />
              <CubeIcon className="h-6 w-6 text-gray-500 absolute right-3 top-3" />
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block font-semibold mb-1">Price (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={payload.price}
                  onChange={(e) =>
                    setPayload({ ...payload, price: Number(e.target.value) })
                  }
                  required
                  className="
                    w-full px-4 py-3 pr-10
                    border rounded-xl shadow-sm 
                    focus:ring-2 focus:ring-purple-500 outline-none
                  "
                />
                <CurrencyRupeeIcon className="h-6 w-6 text-gray-500 absolute right-3 top-3" />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold mb-1">Quantity</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={payload.quantity}
                  onChange={(e) =>
                    setPayload({ ...payload, quantity: Number(e.target.value) })
                  }
                  required
                  className="
                    w-full px-4 py-3 
                    border rounded-xl shadow-sm 
                    focus:ring-2 focus:ring-purple-500 outline-none
                  "
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="
                px-6 py-3 rounded-xl 
                bg-gray-300 hover:bg-gray-400 
                text-gray-900 font-semibold 
                shadow
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-3 rounded-xl 
                bg-purple-600 hover:bg-purple-700 
                text-white font-semibold shadow 
                transition-all
              "
            >
              {loading ? "Saving..." : editing ? "Save Changes" : "Create Sweet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
