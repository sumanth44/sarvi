import React, { useState } from 'react';
import { Home, Menu, Star, Phone, ShoppingCart, LogIn, LogOut, User, MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    onPageChange('home');
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Menu },
    { id: 'about', label: 'About', icon: Star },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  if (isAuthenticated && !user?.isAdmin) {
    navItems.push({ id: 'orders', label: 'My Orders', icon: User });
  }

  return (
    <nav className="bg-amber-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png" // <-- Make sure your logo is placed in `public/logo.png`
              alt="Sarvi Logo"
               className="h-20 w-20 rounded-full object-cover"
            />
           <span className="text-white text-xl font-bold">Sarvi Indian Cuisine</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-white hover:bg-orange-500'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button - Desktop */}
            {isAuthenticated && !user?.isAdmin && (
              <button
                onClick={() => handlePageChange('cart')}
                className="relative text-white hover:text-orange-400 transition-colors hidden sm:block"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-white text-sm">
                    Welcome, {user?.firstName || 'Admin'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handlePageChange('login')}
                  className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-orange-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-amber-800 mt-4">
            <div className="flex flex-col space-y-2 pt-4">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-orange-500 text-white'
                        : 'text-white hover:bg-orange-500'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Cart Button - Mobile */}
              {isAuthenticated && !user?.isAdmin && (
                <button
                  onClick={() => handlePageChange('cart')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-white hover:bg-orange-500 transition-colors"
                >
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Section - Mobile */}
              <div className="border-t border-amber-800 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="text-white text-sm mb-2 px-3">
                      Welcome, {user?.firstName || 'Admin'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md transition-colors w-full"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handlePageChange('login')}
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md transition-colors w-full"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;