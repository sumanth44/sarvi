import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await orderAPI.getUserOrders();
          setOrders(userOrders);
        } catch (err) {
          console.error('Failed to fetch user orders:', err);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'processing':
        return <Package className="text-blue-400" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'delivered':
        return <Truck className="text-green-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'delivered':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Orders</h1>
          <p className="text-gray-300 text-lg">Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-300 text-lg mb-8">You haven't placed any orders yet</p>
            <button
              onClick={() => window.location.href = '#menu'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-stone-800 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Order #{order.id ? order.id.slice(-8) : '???'}
                    </h3>
                    <p className="text-gray-300">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    {getStatusIcon(order.status)}
                    <span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-orange-300 font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-300">
                          <span>{item.name} x{item.quantity}</span>
                          <span>CAD ${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-orange-300 font-semibold mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span>CAD ${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>HST:</span>
                        <span>CAD ${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg border-t border-gray-600 pt-2">
                        <span>Total:</span>
                        <span>CAD ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <strong>Delivery Address:</strong>
                      <p>{order.customerAddress}</p>
                    </div>
                    <div>
                      <strong>Payment Method:</strong>
                      <p className="capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
