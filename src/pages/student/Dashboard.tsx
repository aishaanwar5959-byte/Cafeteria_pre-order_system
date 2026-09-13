import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Bell,
  Utensils,
  QrCode,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    notifications,
    setIsWalletModalOpen,
    navigateTo,
    markNotificationAsRead,
  } = useApp();

  if (!currentUser) return null;

  // Filter student orders
  const studentOrders = orders.filter(
    (o) =>
      o.studentEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.studentId === currentUser.studentId ||
      o.studentName === currentUser.name
  );

  const activeOrders = studentOrders.filter(
    (o) =>
      o.status === 'ORDER RECEIVED' ||
      o.status === 'PREPARING' ||
      o.status === 'READY FOR PICKUP'
  );

  const recentOrders = studentOrders.slice(0, 3);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Student Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0a2540] via-[#0d3156] to-[#0a2540] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-semibold mb-2">
                <span>Bahria University, Karachi</span>
                <span>•</span>
                <span>Student Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, {currentUser.name}!
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200">
                <span className="bg-blue-900/80 px-2.5 py-1 rounded font-mono font-bold">
                  ID: {currentUser.studentId || '02-134211-045'}
                </span>
                <span>{currentUser.email}</span>
                <span>Department of Computer Science / Management Sciences</span>
              </div>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 sm:min-w-[280px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-blue-100">
                    Student Wallet
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>

              <div className="my-3">
                <span className="text-3xl font-black text-white font-mono">
                  Rs. {currentUser.walletBalance.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="student-topup-wallet-btn"
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Top-Up Wallet</span>
                </button>
                <button
                  onClick={() => navigateTo('/menu')}
                  className="py-2 px-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Order Alert Bar if any */}
        {activeOrders.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg font-mono shrink-0">
                #{activeOrders[0].tokenNumber}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-blue-200 tracking-wider">
                  Active Pickup in Progress ({activeOrders[0].status})
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Order {activeOrders[0].id} • Slot: {activeOrders[0].pickupSlotTime}
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Counter #1 or #2 • {activeOrders[0].items.length} items total
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('/track-order', { orderId: activeOrders[0].id })}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>TRACK LIVE STATUS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Column Section: Left (Quick Actions & Recent Orders), Right (Notifications & Quick Menu) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => navigateTo('/menu')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Pre-Order Food</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Browse fresh cafeteria items and reserve lunch pickup.
                </p>
              </div>

              <div
                onClick={() => navigateTo('/my-orders')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">My Orders</h3>
                <p className="text-xs text-slate-500 mt-1">
                  View past invoices, digital tokens, and completed meals.
                </p>
              </div>

              <div
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Campus Wallet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Instant balance: Rs. {currentUser.walletBalance.toLocaleString()}.
                </p>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">Recent Orders</h3>
                </div>
                <button
                  onClick={() => navigateTo('/my-orders')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs">No orders recorded yet.</p>
                  <button
                    onClick={() => navigateTo('/menu')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Start First Order
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {order.id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                            Token #{order.tokenNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'READY FOR PICKUP'
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : order.status === 'PREPARING'
                              ? 'bg-amber-100 text-amber-900'
                              : order.status === 'ORDER RECEIVED'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Slot: <strong>{order.pickupSlotTime}</strong> • Rs. {order.total} •{' '}
                          {order.paymentMethod}
                        </p>
                      </div>

                      <button
                        onClick={() => navigateTo('/track-order', { orderId: order.id })}
                        className="self-start sm:self-auto px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Track Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Campus Notifications & Lunch Hours */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Notifications Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">Order Updates</h3>
                </div>
                {unreadNotifications.length > 0 && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {unreadNotifications.length} New
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.orderId) navigateTo('/track-order', { orderId: n.orderId });
                    }}
                    className="py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cafeteria Hours & Counter Guideline */}
            <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 text-xs text-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>Cafeteria Pickup Information</span>
              </h4>
              <p className="leading-relaxed">
                Counter #1 & #2 are dedicated exclusively to online pre-orders. When arriving during your 15-minute slot, show your digital token number on screen.
              </p>
              <div className="pt-2 border-t border-blue-200/60 space-y-1 font-medium text-[11px]">
                <div className="flex justify-between">
                  <span>Regular Service:</span>
                  <strong>8:00 AM – 4:00 PM</strong>
                </div>
                <div className="flex justify-between text-blue-900">
                  <span>Peak Lunch Slots:</span>
                  <strong>12:00 PM – 2:30 PM</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
