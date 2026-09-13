import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  Clock,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { orders, currentUser, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Please Log In</h2>
          <p className="text-xs text-slate-500 mt-2">
            Log in to your student account to see your current and previous cafeteria orders.
          </p>
          <button
            onClick={() => navigateTo('/login')}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
          >
            Login to Account
          </button>
        </div>
      </div>
    );
  }

  // Filter orders for the logged-in student
  const studentOrders = orders.filter(
    (o) =>
      o.studentEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.studentId === currentUser.studentId ||
      o.studentName === currentUser.name
  );

  const currentOrders = studentOrders.filter(
    (o) => o.status === 'ORDER RECEIVED' || o.status === 'PREPARING' || o.status === 'READY FOR PICKUP'
  );

  const historyOrders = studentOrders.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'CANCELLED'
  );

  const displayedOrders = activeTab === 'current' ? currentOrders : historyOrders;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Bahria University Cafeteria
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              My Orders & History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track active pickup slots and review past university meals.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/menu')}
            className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pre-Order New Meal</span>
          </button>
        </div>

        {/* Tabs: CURRENT ORDERS vs ORDER HISTORY */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            id="tab-current-orders"
            onClick={() => setActiveTab('current')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'current'
                ? 'text-blue-900 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>CURRENT ORDERS</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'current' ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-600'
            }`}>
              {currentOrders.length}
            </span>
          </button>

          <button
            id="tab-order-history"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'history'
                ? 'text-blue-900 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>ORDER HISTORY</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'history' ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-600'
            }`}>
              {historyOrders.length}
            </span>
          </button>
        </div>

        {/* Order Cards List */}
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No {activeTab === 'current' ? 'Active' : 'Past'} Orders
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'current'
                ? "You don't have any meals currently being prepared in the cafeteria."
                : "No past completed orders found on this account."}
            </p>
            <button
              onClick={() => navigateTo('/menu')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Order Lunch Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 font-mono font-black text-sm flex items-center justify-center border border-blue-200">
                        #{order.tokenNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {order.id}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'READY FOR PICKUP'
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : order.status === 'PREPARING'
                              ? 'bg-amber-100 text-amber-900'
                              : order.status === 'ORDER RECEIVED'
                              ? 'bg-blue-100 text-blue-900'
                              : order.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Placed: {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Pickup Slot:</span>
                        <span className="font-bold text-xs text-blue-900 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {order.pickupSlotTime}
                        </span>
                      </div>
                      <button
                        onClick={() => navigateTo('/track-order', { orderId: order.id })}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>VIEW DETAILS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[11px]">Items:</span>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-medium text-[11px]"
                          >
                            {it.name} × <strong>{it.quantity}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 pt-2 sm:pt-0">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Payment:</span>
                        <span className="font-semibold text-slate-800">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">Total Paid:</span>
                        <span className="font-extrabold text-base text-blue-900">
                          Rs. {order.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
