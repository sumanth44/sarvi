import React from 'react';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

interface CartPageProps {
  onPageChange: (page: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ onPageChange }) => {
  const { cart, updateCartQuantity, removeFromCart, loading } = useApp();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.13; // 13% HST for Canada
  const total = subtotal + tax;

  if (loading && cart.length === 0) {
    return <LoadingSpinner />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🛒</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Your Cart</h1>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">Your cart is empty</p>
            <button
              onClick={() => onPageChange('menu')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors font-semibold text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onPageChange('menu')}
            className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>Back to Menu</span>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-stone-800 rounded-xl p-4 shadow-lg border border-orange-500/20">
                  <div className="relative mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 sm:h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-orange-300 mb-2 line-clamp-1">{item.name}</h3>
                  <p className="text-lg sm:text-xl font-bold text-orange-400 mb-3">CAD ${item.price}.00</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 bg-stone-700 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        disabled={loading}
                        className="bg-stone-600 hover:bg-stone-500 text-white p-1.5 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white text-base mx-2 min-w-[1.5rem] text-center">
                        {loading ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="bg-stone-600 hover:bg-stone-500 text-white p-1.5 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-md flex items-center space-x-1 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-orange-400 font-bold text-base sm:text-lg">CAD ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-800 rounded-xl p-4 sm:p-6 shadow-lg sticky top-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Order Summary</h3>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>CAD ${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>HST (13%):</span>
                  <span>CAD ${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base sm:text-lg border-t border-gray-600 pt-2 sm:pt-3">
                  <span>Total:</span>
                  <span>CAD ${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => onPageChange('checkout')}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;