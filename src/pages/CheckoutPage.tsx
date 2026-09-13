import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, PickupSlot } from '../types';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  Wallet,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  User,
  ShoppingBag,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    currentUser,
    cart,
    cartTotal,
    pickupSlots,
    getNearestAvailableSlot,
    placeOrder,
    navigateTo,
  } = useApp();

  // Multi-step state: 1 -> 2 -> 3 -> 4
  const [step, setStep] = useState<number>(1);

  // Selected Pickup slot (default to first available slot)
  const [selectedSlotId, setSelectedSlotId] = useState<string>(() => {
    const available = pickupSlots.find((s) => !s.isClosed && s.currentOrders < s.maxCapacity);
    return available ? available.id : pickupSlots[0]?.id || '';
  });

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UNIVERSITY WALLET');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Processing & Error states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Please Log In to Checkout</h2>
          <p className="text-xs text-slate-500 mt-2">
            You must be logged in as a Bahria student to confirm your cafeteria pickup reservation.
          </p>
          <button
            onClick={() => navigateTo('/login')}
            className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
          >
            Go to Student Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Your Tray is Empty</h2>
          <p className="text-xs text-slate-500 mt-2">
            Please add cafeteria dishes to your tray before proceeding to checkout.
          </p>
          <button
            onClick={() => navigateTo('/menu')}
            className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const selectedSlot = pickupSlots.find((s) => s.id === selectedSlotId);
  const isSelectedSlotFull = selectedSlot
    ? selectedSlot.isClosed || selectedSlot.currentOrders >= selectedSlot.maxCapacity
    : false;

  const nearestSlot = getNearestAvailableSlot(selectedSlotId);

  // Wallet calculation
  const walletBalance = currentUser.walletBalance || 0;
  const isWalletSufficient = walletBalance >= cartTotal;
  const remainingWalletBalance = walletBalance - cartTotal;

  // Handle final order submission with DUPLICATE ORDER PROTECTION
  const handleConfirmOrder = async () => {
    if (isSubmitting) return; // Prevent multiple clicks

    // Validation checks
    if (!selectedSlotId || isSelectedSlotFull) {
      setErrorMessage(
        'This pickup slot is full. Please select another available time.'
      );
      setStep(2);
      return;
    }

    if (paymentMethod === 'UNIVERSITY WALLET' && !isWalletSufficient) {
      setErrorMessage('Insufficient wallet balance. Please choose Cash or top up your wallet.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await placeOrder({
        pickupSlotId: selectedSlotId,
        paymentMethod,
        notes: orderNotes,
      });

      if (result.success && result.orderId) {
        navigateTo('/order-confirmation', { orderId: result.orderId });
      } else {
        setErrorMessage(
          result.error ||
            'Something went wrong while placing your order. Please try again.'
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage('Something went wrong while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Review Order' },
    { num: 2, title: 'Select Pickup Time' },
    { num: 3, title: 'Payment Method' },
    { num: 4, title: 'Confirm Order' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Bahria University Cafeteria
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Pickup Reservation
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stepsList.map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div
                  key={s.num}
                  onClick={() => {
                    if (isPast) setStep(s.num);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-blue-50 text-blue-900 cursor-pointer hover:bg-blue-100'
                      : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-white text-blue-900'
                        : isPast
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </span>
                  <span className="truncate">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">Action Needed</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ================= STEP 1: REVIEW ORDER ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Student Information</span>
                <span className="text-xs text-blue-700 font-semibold">Verified Student</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Student Name:</span>
                  <span className="text-slate-900 font-bold text-sm">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Student ID / Enrollment:</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {currentUser.studentId || '02-134211-045'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Bahria Email:</span>
                  <span className="text-slate-900 font-semibold">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="text-slate-900 font-semibold">{currentUser.phone || '+92 300 1234567'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Ordered Items ({cart.reduce((s, i) => s + i.quantity, 0)} total servings)
              </h2>

              <div className="divide-y divide-slate-100">
                {cart.map(({ foodItem, quantity }) => (
                  <div key={foodItem.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={foodItem.image}
                        alt={foodItem.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{foodItem.name}</h4>
                        <span className="text-xs text-slate-500">
                          Rs. {foodItem.price} × {quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">
                      Rs. {foodItem.price * quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-800">Order Subtotal:</span>
                <span className="font-extrabold text-blue-900 text-lg">Rs. {cartTotal}</span>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateTo('/cart')}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Tray</span>
              </button>
              <button
                id="checkout-step1-next-btn"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Select Pickup Time (Step 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SELECT PICKUP TIME ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Select 15-Minute Lunch Pickup Slot
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lunch Rush: <strong>12:00 PM – 2:30 PM</strong>. Max capacity is strictly 10 orders per slot to prevent cafeteria queues.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                  Capacity: Max 10 Orders / Window
                </span>
              </div>

              {/* Slot Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {pickupSlots.map((slot) => {
                  const isFull = slot.isClosed || slot.currentOrders >= slot.maxCapacity;
                  const isSelected = selectedSlotId === slot.id;
                  const spotsLeft = slot.maxCapacity - slot.currentOrders;

                  return (
                    <div
                      key={slot.id}
                      id={`pickup-slot-${slot.id}`}
                      onClick={() => {
                        if (!isFull) {
                          setSelectedSlotId(slot.id);
                          setErrorMessage(null);
                        } else {
                          const nearest = getNearestAvailableSlot(slot.id);
                          setErrorMessage(
                            `This pickup slot is full. Please select another available time.${
                              nearest ? ` (Recommended: ${nearest.timeWindow})` : ''
                            }`
                          );
                        }
                      }}
                      className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between relative cursor-pointer ${
                        isFull
                          ? 'bg-slate-100 border-slate-200 opacity-65 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50/90 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                          <span className={`text-sm font-bold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                            {slot.timeWindow}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-500">
                          {isFull ? (
                            <span className="text-rose-600 font-bold">10 / 10 orders (At Max Capacity)</span>
                          ) : (
                            <span>{slot.currentOrders} / {slot.maxCapacity} orders filled ({spotsLeft} spots left)</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {isFull ? (
                          <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-extrabold text-[10px] shadow-xs uppercase">
                            FULL
                          </span>
                        ) : isSelected ? (
                          <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-extrabold text-[10px] shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            SELECTED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            AVAILABLE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Slot banner if current selection is invalid or full */}
              {nearestSlot && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Suggested Fast Pickup Slot: <strong>{nearestSlot.timeWindow}</strong> (
                      {nearestSlot.maxCapacity - nearestSlot.currentOrders} slots available)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSlotId(nearestSlot.id)}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold"
                  >
                    Select This Slot
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Review</span>
              </button>
              <button
                id="checkout-step2-next-btn"
                onClick={() => {
                  if (isSelectedSlotFull) {
                    setErrorMessage('This pickup slot is full. Please select another available time.');
                    return;
                  }
                  setStep(3);
                }}
                disabled={isSelectedSlotFull}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Select Payment Method (Step 3)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PAYMENT METHOD ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">
                  Select Payment Method
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order Total: <strong className="text-blue-900 text-sm">Rs. {cartTotal}</strong>
                </p>
              </div>

              {/* Option 1: UNIVERSITY WALLET */}
              <div
                id="payment-option-wallet"
                onClick={() => {
                  setPaymentMethod('UNIVERSITY WALLET');
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'UNIVERSITY WALLET'
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          University Student Wallet
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                          Instant Clearance
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Deducted directly from your Bahria University campus card balance.
                      </p>

                      {/* Detailed Wallet Balance Breakdown */}
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Current Wallet Balance:</span>
                          <span className="font-bold text-slate-900">
                            Rs. {walletBalance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Order Total:</span>
                          <span className="font-bold text-blue-900">
                            Rs. {cartTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between font-bold">
                          <span>Remaining Balance:</span>
                          <span className={isWalletSufficient ? 'text-emerald-700' : 'text-rose-600'}>
                            Rs. {remainingWalletBalance.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Insufficient warning */}
                      {!isWalletSufficient && (
                        <div className="mt-2 text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>
                            Insufficient wallet balance. Please switch to "Cash at Cafeteria" or top up your wallet.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === 'UNIVERSITY WALLET'}
                    onChange={() => setPaymentMethod('UNIVERSITY WALLET')}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                </div>
              </div>

              {/* Option 2: CASH AT CAFETERIA */}
              <div
                id="payment-option-cash"
                onClick={() => {
                  setPaymentMethod('CASH AT CAFETERIA');
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'CASH AT CAFETERIA'
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          Cash at Cafeteria
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          Pay at Counter
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pay in cash at Counter #1 or Counter #2 when picking up your food.
                      </p>
                      <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        Payment status will be marked <strong>UNPAID / PAY AT CAFETERIA</strong>. No wallet funds will be deducted.
                      </div>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === 'CASH AT CAFETERIA'}
                    onChange={() => setPaymentMethod('CASH AT CAFETERIA')}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                </div>
              </div>

              {/* Optional Kitchen Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Preparation Notes / Allergies
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra raita, less spicy, pack disposable fork..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Pickup Time</span>
              </button>
              <button
                id="checkout-step3-next-btn"
                onClick={() => {
                  if (paymentMethod === 'UNIVERSITY WALLET' && !isWalletSufficient) {
                    setErrorMessage('Insufficient wallet balance. Please choose Cash or top up your wallet.');
                    return;
                  }
                  setStep(4);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Review & Confirm (Step 4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CONFIRM ORDER ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Final Pre-Order Review
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please verify pickup details before placing your order.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Amount:</span>
                  <span className="text-2xl font-black text-blue-900">Rs. {cartTotal}</span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Slot Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Pickup Window</span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">
                    {selectedSlot?.timeWindow}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cafeteria Counter #1 or #2
                  </p>
                </div>

                {/* Payment Method Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Method</span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">
                    {paymentMethod}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {paymentMethod === 'UNIVERSITY WALLET'
                      ? 'Deducted immediately • Status: PAID'
                      : 'Pay upon pickup • Status: UNPAID'}
                  </p>
                </div>

                {/* Student info Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-purple-800 font-bold mb-1">
                    <User className="w-4 h-4" />
                    <span>Student Details</span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ID: {currentUser.studentId || 'BU-STUDENT'}
                  </p>
                </div>

              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-bold text-xs text-slate-700 mb-2 uppercase tracking-wide">
                  Order Items ({cart.length} unique items)
                </h3>
                <div className="bg-slate-50 rounded-lg p-3 divide-y divide-slate-200/60 text-xs">
                  {cart.map(({ foodItem, quantity }) => (
                    <div key={foodItem.id} className="py-2 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">
                        {foodItem.name} <strong className="text-slate-900">× {quantity}</strong>
                      </span>
                      <span className="font-bold text-slate-900">
                        Rs. {foodItem.price * quantity}
                      </span>
                    </div>
                  ))}
                  {orderNotes && (
                    <div className="pt-2 text-slate-600 text-[11px]">
                      <strong>Note:</strong> {orderNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Duplicate Order Protection Info */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Anti-Duplicate System:</strong> Clicking confirm safely locks the order and prevents duplicate submissions. Please wait while your digital cafeteria token is generated.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Payment</span>
              </button>

              <button
                id="place-order-confirm-btn"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className={`px-8 py-3.5 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-950/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing your order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRM & PLACE ORDER (Rs. {cartTotal})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
