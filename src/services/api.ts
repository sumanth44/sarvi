import axios from 'axios';
import { User, MenuItem, Order, CartItem, OrderInput, Subscriber } from '../types';
import toast from 'react-hot-toast';



// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token middleware
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sarvi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('sarvi_token');
      localStorage.removeItem('sarvi_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ======================= USER =======================
export const userAPI = {
  async register(userData: Omit<User, 'id' | 'isAdmin'>) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('sarvi_token', response.data.token);
        localStorage.setItem('sarvi_user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.data.error };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('sarvi_token', response.data.token);
        localStorage.setItem('sarvi_user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.data.error };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  },

  async logout() {
    localStorage.removeItem('sarvi_token');
    localStorage.removeItem('sarvi_user');
  },

  async getUserById() {
    try {
      const response = await api.get('/auth/profile');
      return response.data.success ? response.data.user : null;
    } catch {
      return null;
    }
  }
};

// ======================= CART =======================
export const cartAPI = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await api.get('/cart');
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async addToCart(item: MenuItem): Promise<CartItem[]> {
    try {
      const menuItemId = (item as any)._id || item.id;
      if (!menuItemId) throw new Error('Menu item ID is missing');

      const response = await api.post('/cart/add', { menuItemId });
      if (response.data.success) {
        toast.success('Item added to cart!');
        return response.data.data;
      }
      throw new Error(response.data.error);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add item to cart');
      return [];
    }
  },

  async updateCartQuantity(itemId: string, quantity: number): Promise<CartItem[]> {
    try {
      const response = await api.put('/cart/update', { menuItemId: itemId, quantity });
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async removeFromCart(itemId: string): Promise<CartItem[]> {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        toast.success('Item removed from cart');
        return response.data.data;
      }
      throw new Error(response.data.error);
    } catch {
      toast.error('Failed to remove item from cart');
      return [];
    }
  },

  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart/clear');
    } catch {}
  }
};

// ======================= ORDER =======================
export const orderAPI = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders/all');
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders/user');
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async placeOrder(orderData: OrderInput): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Order failed');
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order[]> {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });

      if (response.data.success) {
        toast.success('Order status updated');
        const refreshed = await api.get('/orders/all');
        return refreshed.data.success ? refreshed.data.data : [];
      }

      throw new Error(response.data.error || 'Unknown error');
    } catch (err: any) {
      console.error('Order status update failed:', err?.response?.data || err.message || err);
      toast.error('Failed to update order status');
      return [];
    }
  }
};

// ======================= MENU =======================
export const menuAPI = {
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await api.get('/menu');
      return response.data.success ? response.data.data : [];
    } catch {
      return [];
    }
  },

  async initializeDefaultItems(): Promise<void> {
    try {
      await api.post('/menu/initialize');
    } catch {}
  },

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem[]> {
    try {
      const response = await api.post('/menu', item);
      toast.success('Item added to menu');
      const refreshed = await api.get('/menu');
      return refreshed.data.success ? refreshed.data.data : [];
    } catch {
      toast.error('Failed to add menu item');
      return [];
    }
  },

  async updateMenuItem(id: string, itemData: Omit<MenuItem, 'id'>): Promise<MenuItem[]> {
    try {
      const response = await api.put(`/menu/${id}`, itemData);
      toast.success('Item updated');
      const refreshed = await api.get('/menu');
      return refreshed.data.success ? refreshed.data.data : [];
    } catch {
      toast.error('Failed to update menu item');
      return [];
    }
  },

  async deleteMenuItem(id: string): Promise<MenuItem[]> {
    try {
      const response = await api.delete(`/menu/${id}`);
      toast.success('Item deleted');
      const refreshed = await api.get('/menu');
      return refreshed.data.success ? refreshed.data.data : [];
    } catch {
      toast.error('Failed to delete item');
      return [];
    }
  },

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject('Failed to convert image');
      reader.readAsDataURL(file);
    });
  }
};

// ======================= Subscriber =======================
export const subscriberAPI = {
  getAll: async (): Promise<Subscriber[]> => {
    try {
      const res = await api.get('/contacts');
      return Array.isArray(res.data) ? res.data : res.data.data;
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      throw new Error('Failed to fetch contacts');
    }
  },

  delete: async (id: string) => {
    try {
      const res = await api.delete(`/contacts/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  },
};

// Default export (axios instance if needed)
export default api;
