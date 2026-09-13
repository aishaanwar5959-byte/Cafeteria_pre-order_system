import React, { useState } from 'react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { FOOD_PHOTO_PRESETS } from '../data/initialData';
import { X, Clock, Flame, ShieldAlert, Plus, Minus, ShoppingBag, Check, Camera, Image, Upload } from 'lucide-react';

interface FoodDetailModalProps {
  food?: FoodItem | null;
  onClose?: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food: propFood,
  onClose: propOnClose,
}) => {
  const { addToCart, selectedFoodForModal, setSelectedFoodForModal, currentUser, updateFoodItemImage } = useApp();
  const food = propFood !== undefined ? propFood : selectedFoodForModal;
  const onClose = propOnClose || (() => setSelectedFoodForModal(null));
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [photoSavedNotice, setPhotoSavedNotice] = useState(false);

  if (!food) return null;

  const isStaffOrAdmin =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'MANAGER' ||
    currentUser?.role === 'CAFETARIA_STAFF';

  const isSoldOut = food.availability === 'SOLD OUT' || food.stock <= 0;
  const isLowStock = food.availability === 'LOW STOCK' || (food.stock > 0 && food.stock <= 5);

  const handleApplyPhoto = (newUrl: string) => {
    if (!newUrl.trim()) return;
    updateFoodItemImage(food.id, newUrl.trim());
    setPhotoSavedNotice(true);
    setTimeout(() => {
      setPhotoSavedNotice(false);
      setIsChangingPhoto(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleApplyPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (isSoldOut) return;
    const res = addToCart(food, quantity);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Large Food Image */}
          <div className="relative h-64 w-full bg-slate-100 group">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                {food.category}
              </span>
              {food.isPopular && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md">
                  ★ Student Favorite
                </span>
              )}
            </div>

            {/* Quick Photo Change Trigger for Staff/Manager/Admin or Demo */}
            <button
              onClick={() => {
                setPhotoInputUrl(food.image);
                setIsChangingPhoto(!isChangingPhoto);
              }}
              className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-colors"
              title="Change food photo"
            >
              <Camera className="w-3.5 h-3.5 text-blue-300" />
              <span>{isChangingPhoto ? 'Close Photo Selector' : 'Change Picture'}</span>
            </button>
          </div>

          {/* Interactive Photo Changer Drawer */}
          {isChangingPhoto && (
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-blue-600" />
                  Select or Upload Picture for {food.name}
                </span>
                {photoSavedNotice && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Picture Updated!
                  </span>
                )}
              </div>

              {/* Upload or URL options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 border-dashed rounded-lg cursor-pointer text-xs font-medium text-slate-700">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-1">
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={photoInputUrl}
                    onChange={(e) => setPhotoInputUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => handleApplyPhoto(photoInputUrl)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                Quick HD Food Presets (Click any to apply):
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
                {FOOD_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleApplyPhoto(preset.url)}
                    className="group flex flex-col items-center text-center p-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-md border border-slate-200 group-hover:border-blue-500 transition-colors"
                    />
                    <span className="text-[10px] text-slate-700 mt-1 truncate w-full font-medium">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {food.name}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Prep time: <strong className="text-slate-700">{food.prepTime}</strong>
                </span>
                {food.calories && (
                  <span className="inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {food.calories} kcal
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-blue-900">
                Rs. {food.price}
              </span>
              <span className="block text-[11px] text-slate-500">PKR per serving</span>
            </div>
          </div>

          {/* Availability pill & stock status */}
          <div className="mt-4 flex items-center gap-2">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                Currently unavailable (Sold Out)
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                LOW STOCK — Only {food.stock} remaining in cafeteria kitchen
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                AVAILABLE — In stock ({food.stock} servings)
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            {food.description}
          </p>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 space-y-1">
            <p><strong>Campus Kitchen Standards:</strong> 100% Halal certified, prepared fresh daily at Bahria University central cafeteria kitchen.</p>
            <p><strong>Pickup Note:</strong> Ready at counter during your chosen 15-minute slot.</p>
          </div>

          {/* Footer Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            {!isSoldOut ? (
              <>
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(food.stock, q + 1))}
                    disabled={quantity >= food.stock}
                    className="w-8 h-8 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Tray */}
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Tray!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Tray • Rs. {(food.price * quantity).toLocaleString()}</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="w-full">
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-center"
                >
                  Currently unavailable
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  This item has run out for today. Please browse other cafeteria specialties!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
