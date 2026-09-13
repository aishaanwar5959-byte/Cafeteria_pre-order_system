import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, AvailabilityStatus } from '../types';
import { FoodCard } from '../components/FoodCard';
import {
  Search,
  Filter,
  Utensils,
  Coffee,
  Flame,
  Pizza,
  Cake,
  Apple,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { foodItems } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');

  const categories: { label: string; icon?: React.ReactNode }[] = [
    { label: 'All' },
    { label: 'Pakistani Food' },
    { label: 'Fast Food' },
    { label: 'Snacks' },
    { label: 'Breakfast' },
    { label: 'Beverages' },
    { label: 'Desserts' },
  ];

  const availabilityOptions = [
    { label: 'All Items', value: 'All' },
    { label: 'Available Only', value: 'AVAILABLE' },
    { label: 'Low Stock', value: 'LOW STOCK' },
    { label: 'Sold Out', value: 'SOLD OUT' },
  ];

  const filteredFoods = useMemo(() => {
    return foodItems.filter((item) => {
      // Search query match
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      // Availability match
      const matchesAvailability =
        availabilityFilter === 'All'
          ? true
          : availabilityFilter === 'AVAILABLE'
          ? item.availability === 'AVAILABLE'
          : availabilityFilter === 'LOW STOCK'
          ? item.availability === 'LOW STOCK'
          : item.availability === 'SOLD OUT';

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [foodItems, searchQuery, selectedCategory, availabilityFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Bahria University Karachi Cafeteria
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Cafeteria Menu
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Order before lecture ends and pick up freshly prepared meals without waiting in line.
              </p>
            </div>

            {/* Total items badge */}
            <div className="self-start md:self-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
              Showing <strong className="text-blue-900">{filteredFoods.length}</strong> of{' '}
              {foodItems.length} items
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Card */}
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200/90 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search Biryani, Roll, Chai, Burger, Samosa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Availability Filter Selector */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
              <select
                id="menu-availability-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-medium text-slate-700"
              >
                {availabilityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  id={`category-filter-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0a2540] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items Grid */}
        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Food Items Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No menu items match your search or filter criteria. Try clearing the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setAvailabilityFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
