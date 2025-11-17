import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

type Sweet = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

export default function EditSweet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSweet = async () => {
      if (!id) {
        setError("Missing sweet id in URL.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/sweets/${id}`);
        const data: Sweet = res.data.sweet ?? res.data;
        setSweet(data);
        setName(data.name ?? "");
        setPrice(data.price ?? "");
        setQuantity(data.quantity ?? "");
        setCategory(data.category ?? "");
      } catch (err: any) {
        console.error("fetchSweet:", err);
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to fetch sweet. Check console."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSweet();
  }, [id]);

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (price === "" || Number(price) <= 0) return "Price must be > 0";
    if (quantity === "" || Number(quantity) < 0) return "Quantity must be ≥ 0";
    if (!category.trim()) return "Category is required";
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateForm();
    if (validation) {
      setError(validation);
      return;
    }

    if (!id) {
      setError("Missing sweet id.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
        category: category.trim(),
      };

      const res = await api.put(`/sweets/${id}`, payload);
      setSweet(res.data.sweet ?? res.data);
      setSuccess("Sweet updated successfully.");
      // optional: navigate back to admin list after a short delay
      setTimeout(() => navigate("/admin/sweets"), 900);
    } catch (err: any) {
      console.error("updateSweet:", err);
      setError(
        err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Failed to update sweet."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this sweet?")) return;

    setSaving(true);
    setError(null);

    try {
      await api.delete(`/sweets/${id}`);
      setSuccess("Sweet deleted.");
      setTimeout(() => navigate("/admin/sweets"), 700);
    } catch (err: any) {
      console.error("deleteSweet:", err);
      setError(
        err?.response?.data?.message ?? err?.message ?? "Failed to delete sweet."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="mt-3 text-gray-600">Loading sweet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Sweet</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">
          {success}
        </div>
      )}

      {!sweet && !error && (
        <p className="text-gray-600">No sweet data available.</p>
      )}

      {sweet && (
        <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              placeholder="e.g. Rasgulla"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="e.g. 120"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="e.g. 10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              placeholder="e.g. Bengali"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60"
            >
              {saving ? "Working..." : "Delete"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
