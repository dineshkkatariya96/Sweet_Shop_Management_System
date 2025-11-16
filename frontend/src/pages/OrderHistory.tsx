import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-bounce mb-4">
          <div className="h-16 w-16 bg-linear-to-r from-purple-600 to-pink-600 rounded-full" />
        </div>
        <p className="text-2xl font-bold text-gray-900">Loading your orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-10 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
              <ClipboardDocumentListIcon className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Track and review all your purchases
          </p>
        </div>

        {/* NO ORDERS STATE */}
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4">🍬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring our sweet collection and place your first order!
            </p>
            <button
              onClick={() => navigate("/sweets")}
              className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o: any, idx: number) => (
              <div
                key={o.id}
                className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all animate-fade-in-up card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {o.sweet.name}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          Quantity
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {o.quantity} {o.quantity === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                          Date
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          <ReceiptPercentIcon className="h-4 w-4 inline mr-1" />
                          Order ID
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          #{o.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="w-full sm:w-auto">
                    <span className="inline-block px-6 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
                      ✅ Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-linear-to-r from-gray-800 to-black text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
