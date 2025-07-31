import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import LoginPage from './components/LoginPage';
import OrdersPage from './components/OrdersPage';
import AdminPanel from './components/AdminPanel';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.isAdmin && currentPage !== 'admin') {
    return <AdminPanel />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'menu':
        return <MenuPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return isAuthenticated ? <CartPage onPageChange={setCurrentPage} /> : <LoginPage onPageChange={setCurrentPage} />;
      case 'checkout':
        return isAuthenticated ? <CheckoutPage onPageChange={setCurrentPage} /> : <LoginPage onPageChange={setCurrentPage} />;
      case 'orders':
        return isAuthenticated ? <OrdersPage /> : <LoginPage onPageChange={setCurrentPage} />;
      case 'login':
        return <LoginPage onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}

      {/* ✅ Toast without close button & only short duration */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000, // Default: 2s auto close
          style: {
            background: '#1c1917',
            color: '#fff',
            border: '1px solid #f97316',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
