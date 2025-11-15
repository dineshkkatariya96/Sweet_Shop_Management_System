import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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

  if (!isAdmin) return <div className="p-6">Not authorized</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (payload.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (payload.quantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    try {
      setLoading(true);
      if (editing && id) {
        await api.put(`/sweets/${id}`, payload);
        alert("Sweet updated");
      } else {
        await api.post("/sweets", payload);
        alert("Sweet created");
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{editing ? "Edit Sweet" : "Add Sweet"}</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={payload.name}
            onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            value={payload.category}
            onChange={(e) => setPayload({ ...payload, category: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              value={payload.price}
              min={1}
              onChange={(e) => setPayload({ ...payload, price: Number(e.target.value) })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={payload.quantity}
              min={0}
              onChange={(e) => setPayload({ ...payload, quantity: Number(e.target.value) })}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            {editing ? (loading ? "Saving..." : "Save") : (loading ? "Creating..." : "Create")}
          </button>
        </div>
      </form>
    </div>
  );
}
