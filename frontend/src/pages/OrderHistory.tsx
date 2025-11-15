import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Order {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  createdAt: string;
  sweet: {
    name: string;
    category: string;
  };
  user?: {
    email: string;
  };
}

export default function OrderHistory() {
  const { isAdmin } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const route = isAdmin ? "/admin/orders" : "/orders";
      const res = await api.get(route);
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error("Order fetch error:", err);
      alert("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [isAdmin]);

  if (loading) return <p className="p-8 text-lg">Loading orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? "All Orders (Admin)" : "My Orders"}
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow p-5 rounded-lg border"
            >
              <h2 className="text-xl font-semibold">{order.sweet.name}</h2>

              <div className="mt-2 text-gray-700">
                <p>Category: {order.sweet.category}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Price Paid: ₹{order.priceAtPurchase}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

                {isAdmin && (
                  <p className="mt-2 text-blue-600 text-sm">
                    Ordered by: {order.user?.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
