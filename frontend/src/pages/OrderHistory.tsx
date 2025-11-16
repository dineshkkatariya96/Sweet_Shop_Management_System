import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading your orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 flex justify-center">
      <div
        className="
          w-full max-w-3xl 
          bg-white/70 backdrop-blur-xl 
          shadow-2xl rounded-3xl 
          border border-white/40 
          p-10
        "
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <ClipboardDocumentListIcon className="h-10 w-10 text-purple-600" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
            My Orders
          </h1>
        </div>

        {/* No orders */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-white/60 p-8 rounded-xl shadow-inner">
            You haven't placed any orders yet 🍬
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o: any) => (
              <div
                key={o.id}
                className="
                  bg-white p-6 rounded-xl 
                  shadow-md hover:shadow-xl transition-all 
                  border border-gray-200
                "
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {o.sweet.name}
                </h2>

                <p className="text-gray-700">
                  <strong>Quantity:</strong>{" "}
                  <span className="font-semibold">{o.quantity}</span>
                </p>

                <p className="text-gray-700 mt-1">
                  <strong>Ordered On:</strong>{" "}
                  <span className="font-semibold">
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                </p>

                <div className="mt-4 flex justify-end">
                  <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Order #{o.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
