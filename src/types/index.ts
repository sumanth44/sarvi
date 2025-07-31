export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  likes: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  password: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  userEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ NEW: Used for placing a new order
export interface OrderInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  userEmail: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
export interface Contact {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
}


