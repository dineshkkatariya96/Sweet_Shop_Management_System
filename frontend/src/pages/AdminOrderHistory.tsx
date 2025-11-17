import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  UserIcon,
  CakeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function AdminOrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-bounce mb-4">
          <div className="h-16 w-16 bg-linear-to-r from-orange-600 to-yellow-600 rounded-full" />
        </div>
        <p className="text-2xl font-bold text-gray-900">Loading admin orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-pink-50 p-4 sm:p-10 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-linear-to-r from-orange-600 to-yellow-600 text-white rounded-full shadow-lg">
              <ClipboardDocumentListIcon className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-transparent bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text">
            All Customer Orders
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Monitor and manage all orders from your shop
          </p>
        </div>

        {/* NO ORDERS STATE */}
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">Orders from customers will appear here</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o: any, idx: number) => (
              <div
                key={o._id}
                className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  
                  {/* Main Info */}
                  <div className="flex-1">

                    {/* Sweet Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-pink-100 rounded-full">
                        <CakeIcon className="h-6 w-6 text-pink-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {o.sweetId?.name ?? "Unknown Sweet"}
                      </h2>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">

                      <div>
                        <p className="text-gray-600 text-sm font-medium">Quantity</p>
                        <p className="text-lg font-bold text-purple-600">{o.quantity}</p>
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
                          <UserIcon className="h-4 w-4 inline mr-1" />
                          Customer
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {o.userId?.email ?? "Unknown User"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm font-medium">Order ID</p>
                        <p className="text-sm font-semibold text-gray-900">
                          #{o._id}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <p className="text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
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
