import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  QrCode,
  ArrowRight,
  Utensils,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { activeOrder, navigateTo } = useApp();

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">No Recent Order</h2>
          <p className="text-xs text-slate-500 mt-2">
            No active order confirmation found. Explore the menu to place an order.
          </p>
          <button
            onClick={() => navigateTo('/menu')}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Green Confirmation Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xs rounded-full mb-3 ring-4 ring-white/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ✓ ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 font-medium">
              Your cafeteria pre-order has been transmitted to Bahria Central Kitchen!
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Order Identity & Token */}
            <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider block">
                  Digital Token #
                </span>
                <span className="text-3xl font-black text-blue-950 font-mono">
                  #{activeOrder.tokenNumber}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Order ID: <strong className="text-slate-800">{activeOrder.id}</strong>
                </span>
              </div>

              {/* Simulated QR Code for fast counter scan */}
              <div className="w-16 h-16 bg-white rounded-lg border border-blue-300 p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
            </div>

            {/* Structured Order Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Order:</span>
                <span className="font-extrabold text-sm text-slate-900 mt-0.5 block">
                  {activeOrder.id}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Pickup Time Window:</span>
                <span className="font-extrabold text-sm text-blue-900 mt-0.5 block flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {activeOrder.pickupSlotTime}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Total Amount:</span>
                <span className="font-extrabold text-sm text-slate-900 mt-0.5 block">
                  Rs. {activeOrder.total}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Payment Method & Status:</span>
                <span className="font-bold text-xs text-slate-900 mt-0.5 block">
                  {activeOrder.paymentMethod}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeOrder.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeOrder.paymentStatus}
                  </span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block font-medium">Current Status:</span>
                <span className="font-bold text-xs text-blue-900 mt-0.5 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  {activeOrder.status}
                </span>
              </div>
            </div>

            {/* Items Purchased */}
            <div>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wide mb-2">
                Items In This Order:
              </h3>
              <div className="bg-slate-50 rounded-lg p-3 divide-y divide-slate-200/70 text-xs">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <span className="text-slate-800">
                      {it.name} <strong className="text-slate-900">× {it.quantity}</strong>
                    </span>
                    <span className="font-bold text-slate-900">
                      Rs. {it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Instruction Message */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Pickup Instructions</p>
                <p className="mt-1 leading-relaxed text-slate-700 font-medium">
                  "Please arrive at the cafeteria pickup counter during your selected pickup time."
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Bahria University Central Cafeteria, Counter #1 & Counter #2 (Fast-Track Pickup Lane).
                </p>
              </div>
            </div>

            {/* Primary Action: TRACK ORDER */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="confirmation-track-order-btn"
                onClick={() => navigateTo('/track-order', { orderId: activeOrder.id })}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>TRACK ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('/my-orders')}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                View All My Orders
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
