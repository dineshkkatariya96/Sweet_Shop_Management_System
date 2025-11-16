import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardDocumentListIcon, UserIcon, CakeIcon } from "@heroicons/react/24/outline";

export default function AdminOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/orders", {
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
        Loading admin orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-10 flex justify-center">
      <div
        className="
          w-full max-w-4xl 
          bg-white/70 backdrop-blur-xl 
          shadow-2xl rounded-3xl 
          border border-white/40 
          p-10
        "
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <ClipboardDocumentListIcon className="h-10 w-10 text-orange-600" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
            Admin — All Orders
          </h1>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-white/60 p-8 rounded-xl shadow-inner">
            No orders placed yet 📭
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o: any) => (
              <div
                key={o.id}
                className="
                  bg-white p-6 rounded-xl 
                  shadow-md hover:shadow-xl transition-all 
                  border border-gray-200
                "
              >
                <div className="flex justify-between items-center">
                  {/* Left side */}
                  <div>
                    <p className="text-gray-900 text-lg font-bold flex items-center gap-2">
                      <CakeIcon className="h-5 w-5 text-pink-600" />
                      {o.sweet.name}
                    </p>

                    <p className="mt-1 text-gray-700">
                      <strong>Quantity:</strong>{" "}
                      <span className="font-semibold">{o.quantity}</span>
                    </p>

                    <p className="mt-1 text-gray-700">
                      <strong>Date:</strong>{" "}
                      <span className="font-semibold">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow">
                    <UserIcon className="h-5 w-5" />
                    User #{o.userId}
                  </div>
                </div>

                {/* Order Number */}
                <div className="mt-4 flex justify-end">
                  <span className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
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
