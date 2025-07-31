import React, { useState } from 'react';
import { Star, Heart, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, cart, updateCartQuantity, removeFromCart } = useApp();

  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [adding, setAdding] = useState(false); // ✅ local UI state

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;

    setAdding(true);
    await addToCart(item);
    setAdding(false);
  };

  const handleIncrement = async () => {
    if (!isAuthenticated) return;

    setAdding(true);
    if (cartItem) {
      await updateCartQuantity(item.id, cartItem.quantity + 1);
    } else {
      await addToCart(item);
    }
    setAdding(false);
  };

  const handleDecrement = async () => {
    if (!isAuthenticated || !cartItem) return;

    setAdding(true);
    if (cartItem.quantity > 1) {
      await updateCartQuantity(item.id, cartItem.quantity - 1);
    } else {
      await removeFromCart(item.id);
    }
    setAdding(false);
  };

  return (
    <div className="bg-stone-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden border border-stone-700 w-full max-w-sm mx-auto">
      {item.likes > 500 && (
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 z-10">
          <span className="text-yellow-400">⭐</span>
          <span>Bestseller</span>
        </div>
      )}

      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 z-10">
        <Star className="w-3 h-3 text-white fill-current" />
        <span>{item.rating.toFixed(1)}</span>
      </div>

      <div className="relative h-40 sm:h-44 md:h-48">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-1">{item.name}</h3>
          <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-orange-400">CAD ${item.price}</span>
            {item.likes > 0 && (
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400 fill-current" />
                <span className="text-gray-300 text-xs">{item.likes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="mt-auto">
          {isAuthenticated ? (
            quantity > 0 ? (
              <div className="flex items-center justify-between bg-orange-500 rounded-lg p-2">
                <button
                  onClick={handleDecrement}
                  disabled={adding}
                  className="bg-white text-orange-500 rounded-full p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>
                <span className="text-white font-bold text-base mx-3 min-w-[1.5rem] text-center">
                  {adding ? '...' : quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={adding}
                  className="bg-white text-orange-500 rounded-full p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Plus size={16} />
                <span>{adding ? 'Adding...' : 'ADD'}</span>
              </button>
            )
          ) : (
            <div className="w-full bg-gray-600 text-gray-400 py-2.5 rounded-lg text-center font-semibold cursor-not-allowed text-sm sm:text-base">
              Login to order
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
