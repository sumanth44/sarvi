import React from 'react';
import { useApp } from '../context/AppContext';
import MenuCard from './MenuCard';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { menuItems } = useApp();

  const weekendItems = menuItems.filter(
    (item) => item.category === 'Weekend special'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        <img
          src="/bg3.png"
          alt="Delicious food background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h2 className="text-sm tracking-widest mb-2 uppercase">Wide Options of Choice</h2>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Delicious Recipes</h1>
          <p className="max-w-xl text-lg sm:text-xl mb-6">
            Enjoy dishes from around the world delivered hot to your door.
          </p>
          <button
            onClick={() => onPageChange('menu')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            Order Online
          </button>
        </div>
      </div>

      {/* Weekend Specials Section */}
      {weekendItems.length > 0 && (
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold mb-4 text-orange-600"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              🍽️ Weekend Specials
            </motion.h2>

            <motion.p
              className="text-gray-800 max-w-xl mx-auto mb-8"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              Only available this Saturday & Sunday. Preview available all week!
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {weekendItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-300 text-gray-700 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5" />
              sarvitoronto@gmail.com
            </p>
            <p className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5" />
              416-413-9813
            </p>
            <div>
              <h4 className="font-medium mb-2">Follow on</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/sarvicanada/" className="text-pink-500 hover:opacity-75">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-700 hover:opacity-75">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Sarvi Indian Cuisine</h3>
            <p>
              Sarvi Indian Cuisine takes pride in bringing you the authentic taste of South Indian delicacies.
              Our range of Biryanis and Dosas that are “Cooked to Perfection” by our chefs have made us Canada's
              favourite South Indian/Indian restaurant!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-400 pt-4 text-center text-sm text-gray-500">
          © Sarvi Indian Cuisine @ 2025 All Rights Reserved 
          
         
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
