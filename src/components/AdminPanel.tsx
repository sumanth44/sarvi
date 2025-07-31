import React, { useState, useRef, useEffect } from 'react';
import { Plus, List, ShoppingBag, Upload, Edit2, Save, X, LogOut, Trash2, Star, Heart, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MenuItem, Subscriber } from '../types';
import { subscriberAPI } from '../services/api'; 
import toast from 'react-hot-toast';




const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'add' | 'subscribers'>('orders');
  const { orders, menuItems, addMenuItem, updateOrderStatus, updateMenuItem, deleteMenuItem, subscribers, fetchContacts } = useApp();
  const { logout } = useAuth();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MenuItem>>({});
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');
 
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    rating: 5,
    likes: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchContacts(); // ✅ Add this useEffect
    }
  }, [activeTab]);

  

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this contact?');
    if (!confirm) return;
  
    try {
      await subscriberAPI.delete(id);
      toast.success('Contact deleted'); // 
      fetchContacts(); // ✅ Refresh list
    } catch (err) {
      console.error('Failed to delete contact', err);
      toast.error('Failed to delete contact'); // 
    }
  };
  

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewItem({ ...newItem, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditImagePreview(result);
        setEditFormData({ ...editFormData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      alert('Please fill all required fields');
      return;
    }

    if (!newItem.image) {
      alert('Please upload an image');
      return;
    }

    addMenuItem({
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image,
      rating: newItem.rating,
      likes: newItem.likes,
    });

    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      rating: 5,
      likes: 0,
    });
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    alert('Menu item added successfully!');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item.id || item._id);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      rating: item.rating,
      likes: item.likes,
    });
    setEditImagePreview(item.image);
    setEditImageFile(null);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editFormData.name || !editFormData.description || !editFormData.price || !editFormData.category) {
      alert('Please fill all required fields');
      return;
    }

    updateMenuItem(editingItem, {
      name: editFormData.name,
      description: editFormData.description,
      price: editFormData.price,
      category: editFormData.category,
      image: editFormData.image || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: editFormData.rating || 0,
      likes: editFormData.likes || 0,
    });

    setEditingItem(null);
    setEditFormData({});
    setEditImagePreview('');
    setEditImageFile(null);
    alert('Menu item updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
    setEditImagePreview('');
    setEditImageFile(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(itemId);
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-stone-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-orange-400 text-3xl">👑</div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-stone-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-stone-700'
            }`}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'menu'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-stone-700'
            }`}
          >
            <List size={18} />
            <span>List Items</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'add'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-stone-700'
            }`}
          >
            <Plus size={18} />
            <span>Add Items</span>
          </button>
          <button
    onClick={() => setActiveTab('subscribers')}
    className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
      activeTab === 'subscribers'
        ? 'bg-orange-500 text-white'
        : 'text-gray-300 hover:bg-stone-700'
    }`}
  >
    <Users size={18} />
    <span>Subscribers</span>
  </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">Order Management</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-300 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-orange-300 pb-3 font-semibold">Order ID</th>
                      <th className="text-orange-300 pb-3 font-semibold">Customer</th>
                      <th className="text-orange-300 pb-3 font-semibold">Address</th>
                      <th className="text-orange-300 pb-3 font-semibold">Items</th>
                      <th className="text-orange-300 pb-3 font-semibold">Total Items</th>
                      <th className="text-orange-300 pb-3 font-semibold">Price</th>
                      <th className="text-orange-300 pb-3 font-semibold">Payment</th>
                      <th className="text-orange-300 pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700">
                        <td className="py-4 text-white font-mono">#{(order.id || '------').toString().slice(-6)}</td>
                        <td className="py-4">
                          <div className="text-orange-300">
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-400">👤</span>
                              <span className="font-medium">{order.customerName}</span>
                            </div>
                            <div className="text-gray-400 text-sm">
                              {order.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300 text-sm max-w-xs">
                          {order.customerAddress}
                        </td>
                        <td className="py-4">
                          <div className="space-y-2 max-w-xs">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div className="text-sm">
                                  <div className="text-orange-300 font-medium">{item.name}</div>
                                  <div className="text-gray-400">CAD ${item.price} × {item.quantity}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">🎯</span>
                            <span className="text-white font-bold">{order.items.reduce((total, item) => total + item.quantity, 0)}</span>
                          </div>
                        </td>
                        <td className="py-4 text-white font-bold text-lg">CAD ${order.total.toFixed(2)}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-green-400 text-sm font-medium">Completed</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id ?? order._id ?? '', e.target.value)}

                              className="bg-stone-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Menu Items Tab */}
        {activeTab === 'menu' && (
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">Manage Menu Items</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-orange-300 pb-3 font-semibold">Image</th>
                    <th className="text-orange-300 pb-3 font-semibold">Name</th>
                    <th className="text-orange-300 pb-3 font-semibold">Category</th>
                    <th className="text-orange-300 pb-3 font-semibold">Price (CAD $)</th>
                    <th className="text-orange-300 pb-3 font-semibold">Rating</th>
                    <th className="text-orange-300 pb-3 font-semibold">Hearts</th>
                    <th className="text-orange-300 pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="py-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4">
                        <div className="text-orange-300 font-medium">{item.name}</div>
                        <div className="text-gray-400 text-sm max-w-xs">{item.description}</div>
                      </td>
                      <td className="py-4 text-white">{item.category}</td>
                      <td className="py-4 text-orange-400 font-bold">CAD ${item.price}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          <Heart size={16} className="text-red-400 fill-current" />
                          <span className="text-white">{item.likes}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Item Tab */}
        {activeTab === 'add' && (
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">Add New Menu Item</h2>
            
            <form onSubmit={handleAddItem} className="max-w-2xl mx-auto">
              {/* Image Upload */}
              <div className="mb-6">
                <div 
                  className="bg-stone-700 rounded-lg p-8 border-2 border-dashed border-orange-500 cursor-pointer hover:bg-stone-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
                        />
                        <p className="text-orange-300 text-sm">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto text-orange-400 mb-4" size={48} />
                        <p className="text-orange-300 mb-2 font-medium">Click to upload product image</p>
                        <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-orange-300 font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-orange-300 font-medium mb-2">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Category</label>
                    <select
  value={newItem.category}
  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
  className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
  required
>
  <option value="">Select Category</option>
  <option value="Appetizers">Appetizers</option>
  <option value="Main Course">Main Course</option>
  <option value="Snacks">Snacks</option>
  <option value="Soups">Soups</option>
  <option value="Beverages">Beverages</option>
  <option value="Dosa & Uthappa’s">Dosa & Uthappa’s</option>
  <option value="Indo-Chinese">Indo-Chinese</option>
  <option value="Breads">Breads</option>
  <option value="Veg curries">Veg curries</option>
  <option value="Non veg curries">Non veg curries</option>
  <option value="Veg biriyani">Veg biriyani</option>
  <option value="Non veg biriyani">Non veg biriyani</option>
  <option value="Puloos">Puloos</option>
  <option value="Weekend special">Weekend special</option>
  <option value="Sides">Sides</option>
</select>

                  </div>
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Price (CAD $)</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      placeholder="0"
                      className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Rating (1-5)</label>
                    <select
                      value={newItem.rating}
                      onChange={(e) => setNewItem({ ...newItem, rating: parseInt(e.target.value) })}
                      className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Initial Likes</label>
                    <input
                      type="number"
                      value={newItem.likes}
                      onChange={(e) => setNewItem({ ...newItem, likes: parseInt(e.target.value) })}
                      placeholder="0"
                      min="0"
                      className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-stone-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Menu Item</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-stone-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-orange-300 mb-4">Edit Menu Item</h3>
              
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-orange-300 font-medium mb-2">Product Image</label>
                  <div 
                    className="bg-stone-700 rounded-lg p-4 border-2 border-dashed border-orange-500 cursor-pointer hover:bg-stone-600 transition-colors"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      {editImagePreview ? (
                        <div className="relative">
                          <img
                            src={editImagePreview}
                            alt="Preview"
                            className="w-24 h-24 mx-auto rounded-lg object-cover mb-2"
                          />
                          <p className="text-orange-300 text-sm">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-orange-400 mb-2" size={32} />
                          <p className="text-orange-300 text-sm">Click to upload image</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-orange-300 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-orange-300 font-medium mb-2">Description</label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Price (CAD $)</label>
                    <input
                      type="number"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                      className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Category</label>
                    <select
                      value={editFormData.category || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Category</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Soups">Soups</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Dosa & Uthappa’s">Dosa & Uthappa’s</option>
                      <option value="Indo-Chinese">Indo-Chinese</option>
                      <option value="Breads">Breads</option>
                      <option value="Veg curries">Veg curries</option>
                      <option value="Non veg curries">Non veg curries</option>
                      <option value="Veg biriyani">Veg biriyani</option>
                      <option value="Non veg biriyani">Non veg biriyani</option>
                      <option value="Puloos">Puloos</option>
                      <option value="Weekend special">Weekend special</option>
                      <option value="Sides">Sides</option> 
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Rating</label>
                    <select
                      value={editFormData.rating || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, rating: parseInt(e.target.value) })}
                      className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-orange-300 font-medium mb-2">Likes</label>
                    <input
                      type="number"
                      value={editFormData.likes || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, likes: parseInt(e.target.value) })}
                      className="w-full bg-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center justify-center space-x-1"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded flex items-center justify-center space-x-1"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        
{activeTab === 'subscribers' && (
  <div className="bg-stone-800 rounded-xl p-6">
    <h2 className="text-2xl font-bold text-orange-300 mb-6">Contacts</h2>
    {subscribers.length === 0 ? (
      <p className="text-white">No contacts found.</p>
    ) : (
      <table className="w-full text-left border border-stone-600">
        <thead>
          <tr className="bg-stone-700 text-orange-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => {
            const id = sub.id || sub._id;
            if (!id) return null;

            return (
              <tr key={id} className="text-white">
                <td className="border p-2">{sub.name}</td>
                <td className="border p-2">{sub.email}</td>
                <td className="border p-2">{sub.phone}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-white rounded"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}

 
      </div>
    </div>
  );
  
};

export default AdminPanel;