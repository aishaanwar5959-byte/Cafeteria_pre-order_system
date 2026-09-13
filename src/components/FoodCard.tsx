import React, { useState } from 'react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, Plus, Minus, Check, AlertCircle, Sparkles } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart, setSelectedFoodForModal } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = food.availability === 'SOLD OUT' || food.stock <= 0;
  const isLowStock = food.availability === 'LOW STOCK' || (food.stock > 0 && food.stock <= 5);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;

    const res = addToCart(food, quantity);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < food.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div
      id={`food-card-${food.id}`}
      onClick={() => setSelectedFoodForModal(food)}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Food Image Container */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
          {food.category}
        </span>

        {/* Availability Badge */}
        <div className="absolute top-2.5 right-2.5">
          {isSoldOut ? (
            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              SOLD OUT
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              LOW STOCK ({food.stock} left)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
              AVAILABLE
            </span>
          )}
        </div>

        {/* Popular Ribbon */}
        {food.isPopular && (
          <div className="absolute bottom-2 left-2.5 bg-blue-700/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Cafeteria Favorite</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
              {food.name}
            </h3>
            <span className="text-base font-extrabold text-blue-900 shrink-0">
              Rs. {food.price}
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Meta info & Action row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Prep: {food.prepTime}</span>
            </span>
            {!isSoldOut && (
              <span className="text-[11px] text-slate-400">
                Stock: <strong className="text-slate-700">{food.stock}</strong>
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {!isSoldOut && (
              <div
                className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Decrease quantity"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  disabled={quantity >= food.stock}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Increase quantity"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              id={`add-to-cart-${food.id}`}
              onClick={handleAdd}
              disabled={isSoldOut}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isSoldOut
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : justAdded
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              {isSoldOut ? (
                <span>Sold Out</span>
              ) : justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Tray</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
