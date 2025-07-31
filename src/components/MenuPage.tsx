import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MenuCard from './MenuCard';
import LoadingSpinner from './LoadingSpinner';

const MenuPage: React.FC = () => {
  const { menuItems, loading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('None');

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Category filtering
  let filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  // Sorting logic
  if (sortOption === 'LowToHigh') {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'HighToLow') {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  }

  if (loading && menuItems.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Our Menu</h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl">Explore our delicious selection of dishes</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-full transition-colors text-sm sm:text-base ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-700 text-gray-300 hover:bg-stone-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-block text-left mb-6">
            <select
               value={sortOption}
               onChange={(e) => setSortOption(e.target.value as 'lowToHigh' | 'highToLow')}
              className="bg-stone-700 text-white px-4 py-2 rounded-full border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="None">Sort By</option>
              <option value="LowToHigh">Price: Low to High</option>
              <option value="HighToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
            
        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="w-full">
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-white mb-2">No items found</h3>
            <p className="text-gray-300">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
