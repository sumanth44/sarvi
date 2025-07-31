import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderInput,
  Subscriber,
} from '../types';
import { cartAPI, orderAPI, menuAPI, subscriberAPI } from '../services/api';

import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface AppContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  subscribers: Subscriber[];
  addToCart: (item: MenuItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  placeOrder: (orderData: OrderInput) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getUserOrders: () => Order[];
  refreshData: () => Promise<void>;
  fetchContacts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = React.memo(({ children }: AppProviderProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const refreshData = async () => {
    try {
      setLoading(true);
      const menuData = await menuAPI.getMenuItems();
      if (menuData.length === 0) {
        await menuAPI.initializeDefaultItems();
        const initializedData = await menuAPI.getMenuItems();
        setMenuItems(initializedData);
      } else {
        setMenuItems(menuData);
      }

      if (isAuthenticated && user) {
        const cartData = await cartAPI.getCart();
        setCart(cartData);

        const orderData = user.isAdmin
          ? await orderAPI.getOrders()
          : await orderAPI.getUserOrders();
        setOrders(orderData);
      } else {
        setCart([]);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await subscriberAPI.getAll();
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchContacts();
    }
  }, [user]);

  const addToCart = async (item: MenuItem) => {
    if (!user) return;
    try {
      setLoading(true);
      const updatedCart = await cartAPI.addToCart(item);
      setCart(updatedCart);
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const updatedCart = await cartAPI.removeFromCart(id);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (id: string, quantity: number) => {
    if (!user) return;
    try {
      setLoading(true);
      const updatedCart = await cartAPI.updateCartQuantity(id, quantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      setLoading(true);
      const updatedMenuItems = await menuAPI.addMenuItem(item);
      setMenuItems(updatedMenuItems);
      toast.success('Menu item added');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = async (id: string, itemData: Omit<MenuItem, 'id'>) => {
    try {
      setLoading(true);
      const updatedMenuItems = await menuAPI.updateMenuItem(id, itemData);
      setMenuItems(updatedMenuItems);
      toast.success('Menu item updated');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setLoading(true);
      const updatedMenuItems = await menuAPI.deleteMenuItem(id);
      setMenuItems(updatedMenuItems);
      toast.success('Menu item deleted');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData: OrderInput): Promise<Order> => {
    try {
      setLoading(true);
      const newOrder = await orderAPI.placeOrder(orderData);
      setCart([]);
      toast.success('Order placed successfully');

      if (user?.isAdmin) {
        const allOrders = await orderAPI.getOrders();
        setOrders(allOrders);
      } else {
        setOrders((prev) => [newOrder, ...prev]);
      }

      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
  ) => {
    try {
      setLoading(true);
      await orderAPI.updateOrderStatus(orderId, status);
      if (user?.isAdmin) {
        const updated = await orderAPI.getOrders();
        setOrders(updated);
        toast.success('Order status updated');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = () => {
    return orders.filter((order) => order.user?.id === user?.id);
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        loading,
        subscribers,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        placeOrder,
        updateOrderStatus,
        getUserOrders,
        refreshData,
        fetchContacts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
});
