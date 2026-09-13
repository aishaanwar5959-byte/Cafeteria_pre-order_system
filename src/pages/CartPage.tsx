import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Utensils,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, navigateTo, currentUser } = useApp();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5 text-blue-600 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Your Cafeteria Tray is Empty
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            You haven't added any cafeteria meals yet. Explore our campus menu to pre-order lunch before the rush begins.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              id="empty-cart-browse-menu-btn"
              onClick={() => navigateTo('/menu')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Browse Cafeteria Menu</span>
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Bahria University Cafeteria
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              Your Pre-Order Tray
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Tray</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {cart.map(({ foodItem, quantity }) => {
                const itemTotal = foodItem.price * quantity;
                return (
                  <div
                    key={foodItem.id}
                    id={`cart-item-${foodItem.id}`}
                    className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <img
                      src={foodItem.image}
                      alt={foodItem.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {foodItem.name}
                          </h3>
                          <span className="text-xs text-slate-500 block">
                            Rs. {foodItem.price} each
                          </span>
                        </div>
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 shrink-0">
                          Rs. {itemTotal}
                        </span>
                      </div>

                      {/* Quantity and Delete Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5">
                          <button
                            onClick={() => updateCartQuantity(foodItem.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(foodItem.id, 1)}
                            disabled={quantity >= foodItem.stock}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(foodItem.id)}
                          className="text-xs text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigateTo('/menu')}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Add more cafeteria items</span>
            </button>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4 sticky top-24">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                  <span className="font-semibold text-slate-900">Rs. {cartTotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Cafeteria Pickup Fee:</span>
                  <span className="font-semibold text-emerald-700">FREE (Campus Pickup)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Service Tax:</span>
                  <span className="font-semibold text-slate-900">Rs. 0</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Total:</span>
                <span className="text-2xl font-black text-blue-900">
                  Rs. {cartTotal}
                </span>
              </div>

              {currentUser?.role === 'student' && (
                <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-100 text-xs text-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-900 font-semibold">Your Student Wallet:</span>
                    <strong className="text-emerald-700">
                      Rs. {currentUser.walletBalance.toLocaleString()}
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {currentUser.walletBalance >= cartTotal
                      ? '✓ Sufficient balance for instant checkout.'
                      : 'You can pay with Cash at Cafeteria or top up your wallet.'}
                  </p>
                </div>
              )}

              <button
                id="cart-proceed-to-checkout-btn"
                onClick={() => {
                  if (!currentUser) {
                    navigateTo('/login');
                  } else {
                    navigateTo('/checkout');
                  }
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bahria University Verified Student Pickup System</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
