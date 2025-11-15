import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function RestockSweet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:3000/api/sweets/${id}/restock`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Sweet restocked successfully!");
      setAmount("");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Restock failed");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Restock Sweet</h1>

      {message && <p className="mb-4 text-center text-purple-700">{message}</p>}

      <form onSubmit={handleRestock}>
        <input
          type="number"
          placeholder="Add quantity"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <button className="w-full py-2 bg-purple-600 text-white rounded-lg">
          Restock
        </button>
      </form>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="w-full mt-6 py-2 bg-gray-700 text-white rounded-lg"
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
