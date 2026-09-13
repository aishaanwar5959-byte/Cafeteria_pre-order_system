import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, FoodCategory, AvailabilityStatus, PickupSlot } from '../../types';
import { FOOD_PHOTO_PRESETS } from '../../data/initialData';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Lock,
  Unlock,
  Sliders,
  Utensils,
  Search,
  X,
  Sparkles,
  Camera,
  Image,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const {
    foodItems,
    orders,
    pickupSlots,
    updateFoodItem,
    addFoodItem,
    deleteFoodItem,
    togglePickupSlotClosed,
    updateFoodItemImage,
    resetMenuImagesToDefault,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'slots'>('overview');

  // Menu item modal state (Add / Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<FoodItem> | null>(null);
  const [resetImagesNotice, setResetImagesNotice] = useState(false);

  // Search in menu manager
  const [menuSearch, setMenuSearch] = useState('');

  // Calculations for Manager
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const inProgressCount = orders.filter(
    (o) => o.status === 'ORDER RECEIVED' || o.status === 'PREPARING'
  ).length;

  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  // Handle open modal for adding
  const handleOpenAddModal = () => {
    setEditingItem({
      name: '',
      category: 'Pakistani Food',
      price: 150,
      stock: 25,
      availability: 'AVAILABLE',
      prepTime: '10-15 mins',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      calories: '350 kcal',
      isPopular: false,
    });
    setIsEditModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;

    if (editingItem.id) {
      // Update
      updateFoodItem(editingItem.id, editingItem);
    } else {
      // Add
      addFoodItem(editingItem as any);
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const filteredMenuItems = foodItems.filter(
    (f) =>
      f.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-[#0a2540] text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Cafeteria Operations & Inventory
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase">
                Manager View
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Bahria University Karachi Cafeteria Administration & Supply Center
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food Item</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Orders Today
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {totalOrdersCount}
              </span>
              <span className="text-[11px] text-blue-600 font-medium">All student orders</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Revenue Today
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                Rs. {totalRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Wallet + Cash counter</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Orders In Progress
              </span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {inProgressCount}
              </span>
              <span className="text-[11px] text-amber-600 font-medium">Under active preparation</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Completed Orders
              </span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">
                {completedCount}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Successfully collected</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Manager Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-900 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            LIVE ORDERS LOG
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'menu'
                ? 'text-blue-900 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            MANAGE FOOD MENU ({foodItems.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`pb-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'slots'
                ? 'text-blue-900 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PICKUP SLOTS & CAPACITY ({pickupSlots.length})
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ORDERS LOG ================= */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Campus Pre-Order Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time transaction tracking across all university departments.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Pickup Slot</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {o.id}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Token #{o.tokenNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{o.studentName}</span>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          {o.studentId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-900">
                        {o.pickupSlotTime}
                      </td>
                      <td className="py-3 px-4">
                        {o.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Rs. {o.total}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{o.paymentMethod}</span>
                        <span className={`text-[10px] font-bold ${
                          o.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'READY FOR PICKUP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'PREPARING'
                            ? 'bg-amber-100 text-amber-900'
                            : o.status === 'ORDER RECEIVED'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MANAGE FOOD MENU ================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter menu items by name or category..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetMenuImagesToDefault();
                    setResetImagesNotice(true);
                    setTimeout(() => setResetImagesNotice(false), 2500);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-300"
                  title="Restore all default food photos to the updated HD campus presets"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  <span>{resetImagesNotice ? 'Photos Reset to HD!' : 'Reset All Photos to HD'}</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item to Menu</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Quick Availability Switch</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {item.prepTime} • {item.calories || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{item.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          Rs. {item.price}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {item.stock} left
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.availability === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.availability === 'LOW STOCK'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.availability}
                          </span>
                        </td>
                        {/* Quick Availability Switcher */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateFoodItem(item.id, { availability: 'AVAILABLE' })}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                item.availability === 'AVAILABLE'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                              }`}
                            >
                              AVAILABLE
                            </button>
                            <button
                              onClick={() => updateFoodItem(item.id, { availability: 'LOW STOCK' })}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                item.availability === 'LOW STOCK'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                              }`}
                            >
                              LOW STOCK
                            </button>
                            <button
                              onClick={() => updateFoodItem(item.id, { availability: 'SOLD OUT' })}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                item.availability === 'SOLD OUT'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                              }`}
                            >
                              SOLD OUT
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${item.name} from cafeteria menu?`)) {
                                  deleteFoodItem(item.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PICKUP SLOTS & CAPACITY ================= */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Kitchen Overload Protection</h4>
                <p className="mt-0.5 text-slate-600">
                  If the central kitchen is experiencing heavy queues or equipment delays, toggle any slot to <strong>CLOSED</strong>. Students will be prevented from selecting that time window.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pickupSlots.map((slot) => {
                const isFull = slot.currentOrders >= slot.maxCapacity;
                return (
                  <div
                    key={slot.id}
                    className={`bg-white p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      slot.isClosed
                        ? 'border-rose-300 bg-rose-50/40'
                        : isFull
                        ? 'border-amber-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-700" />
                          <h3 className="font-extrabold text-sm text-slate-900">
                            {slot.timeWindow}
                          </h3>
                        </div>
                        {slot.isClosed ? (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                            CLOSED BY MANAGER
                          </span>
                        ) : isFull ? (
                          <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">
                            AT CAPACITY (10/10)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 mt-3">
                        <div className="flex justify-between">
                          <span>Orders Booked:</span>
                          <span className="font-bold text-slate-900">
                            {slot.currentOrders} / {slot.maxCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              isFull ? 'bg-rose-500' : 'bg-blue-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (slot.currentOrders / slot.maxCapacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Slot #{slot.id}
                      </span>
                      <button
                        onClick={() => togglePickupSlotClosed(slot.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          slot.isClosed
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {slot.isClosed ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Re-Open Slot</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Close Slot</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Food Item */}
        {isEditModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingItem.id ? 'Edit Cafeteria Item' : 'Add New Item to Menu'}
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chicken Shami Burger"
                    value={editingItem.name || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editingItem.category || 'Pakistani Food'}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value as FoodCategory,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="Pakistani Food">Pakistani Food</option>
                      <option value="Fast Food">Fast Food</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Price (PKR)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={editingItem.price || 0}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingItem.stock || 0}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={editingItem.availability || 'AVAILABLE'}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          availability: e.target.value as AvailabilityStatus,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="LOW STOCK">LOW STOCK</option>
                      <option value="SOLD OUT">SOLD OUT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Prep Time
                    </label>
                    <input
                      type="text"
                      placeholder="5-10 mins"
                      value={editingItem.prepTime || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, prepTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Calories / Portion
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 420 kcal"
                      value={editingItem.calories || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, calories: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Food Picture Section */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Food Picture & Thumbnail
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Pick preset, upload photo or paste URL
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    {/* Image Preview */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200 relative">
                      {editingItem.image ? (
                        <img
                          src={editingItem.image}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Image className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Upload and URL input */}
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>Upload from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setEditingItem({ ...editingItem, image: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        required
                        placeholder="Or paste image URL (https://...)"
                        value={editingItem.image || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, image: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset Photos Selector */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      Select from Cafeteria Photo Presets:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 bg-white rounded-lg border border-slate-200">
                      {FOOD_PHOTO_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, image: preset.url })}
                          className={`flex flex-col items-center p-1 rounded-md text-center border transition-all ${
                            editingItem.image === preset.url
                              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-sm"
                          />
                          <span className="text-[10px] text-slate-700 font-medium mt-1 truncate w-full">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Item Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Details about ingredients and taste..."
                    value={editingItem.description || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_popular_check"
                    checked={editingItem.isPopular || false}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isPopular: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor="is_popular_check"
                    className="font-bold text-slate-700"
                  >
                    Feature on Homepage as Campus Favorite
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
