import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, PlusCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface WalletTopupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const WalletTopupModal: React.FC<WalletTopupModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const { currentUser, addFundsToWallet, isWalletModalOpen, setIsWalletModalOpen } = useApp();
  const isOpen = propIsOpen !== undefined ? propIsOpen : isWalletModalOpen;
  const onClose = propOnClose || (() => setIsWalletModalOpen(false));
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const amounts = [300, 500, 1000, 2000];

  const handleTopup = () => {
    const amountToTopup = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (isNaN(amountToTopup) || amountToTopup <= 0) return;

    addFundsToWallet(amountToTopup);
    setSuccessMsg(`Rs. ${amountToTopup.toLocaleString()} credited successfully!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCustomAmount('');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">University Wallet</h3>
            <p className="text-xs text-slate-500">Bahria Student ID: {currentUser.studentId || 'BU-STUDENT'}</p>
          </div>
        </div>

        {/* Current Balance card */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#0a2540] to-[#1e3a8a] text-white shadow-sm">
          <span className="text-xs text-blue-200 block">Available Balance</span>
          <span className="text-3xl font-extrabold tracking-tight mt-1 block">
            Rs. {currentUser.walletBalance.toLocaleString()}
          </span>
          <span className="text-[11px] text-blue-200/80 block mt-2">
            Linked to Bahria University Student Card • Instant cafeteria checkout
          </span>
        </div>

        {successMsg ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center flex flex-col items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <span className="font-bold text-sm">{successMsg}</span>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Quick Top-Up Amount (PKR)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Enter Custom Amount (PKR)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                placeholder="e.g. 750"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Simulated University Bursar Gateway. In production, this links to Bahria HBL/Askari University fee portal.
              </span>
            </div>

            <button
              onClick={handleTopup}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Load Funds into Student Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
