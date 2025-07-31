import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface CheckoutPageProps {
  onPageChange: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPageChange }) => {
  const { cart, placeOrder, clearCart } = useApp();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    paymentMethod: '',
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      const orderData = {
        userId: user!.id,
        userEmail: user!.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        customerAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        items: cart,
        subtotal,
        tax,
        total,
        status: 'pending' as const,
        paymentMethod: formData.paymentMethod,
      };

      await placeOrder(orderData);
      await clearCart();

      toast.success('Order placed successfully!');
      onPageChange('orders');
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('Something went wrong while placing the order. Please try again.');
    }
  };

  if (cart.length === 0) {
    onPageChange('cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => onPageChange('cart')}
            className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-4xl font-bold text-white text-center">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="First Name" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="Last Name" />
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="Phone" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="Email" />
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="City" />
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg" required placeholder="Postal Code" />
              </div>
            </form>
          </div>

          {/* Payment Details */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">Payment Details</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Order Items</h3>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-300">
                    <span>{item.name} x{item.quantity}</span>
                    <span>CAD ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>CAD ${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>HST (13%):</span>
                <span>CAD ${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-gray-600 pt-2">
                <span>Total:</span>
                <span>CAD ${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full bg-stone-700 text-white px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Method</option>
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="interac">Interac e-Transfer</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>🔒</span>
              <span>Complete Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
