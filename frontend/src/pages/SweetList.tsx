import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api"; 

export default function SweetList() {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    const res = await axios.get("http://localhost:3000/api/sweets");
    setSweets(res.data.sweets);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

const handleBuy = async (id: number) => {
  try {
    const res = await api.post(`/sweets/${id}/purchase`, { quantity: 1 });
    alert("Purchase successful!");
    fetchSweets(); // reload list
  } catch (err) {
    console.error(err);
    alert("Purchase failed");
  }
};


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Sweets</h2>

      <div className="grid grid-cols-3 gap-4">
        {sweets.map((s: any) => (
          <div key={s.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold">{s.name}</h3>
            <p>Price: ₹{s.price}</p>
            <p>Stock: {s.quantity}</p>

            <button
              onClick={() => handleBuy(s.id)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
