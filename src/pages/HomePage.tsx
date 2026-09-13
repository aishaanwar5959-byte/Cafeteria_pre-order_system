import React from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import {
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  PackageCheck,
  ArrowRight,
  Flame,
  ShieldCheck,
  Users,
  Utensils,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, currentUser, foodItems, pickupSlots } = useApp();

  const popularFoods = foodItems.filter((f) => f.isPopular).slice(0, 6);

  // Calculate live rush-hour occupancy
  const totalCapacity = pickupSlots.reduce((sum, s) => sum + s.maxCapacity, 0);
  const totalBooked = pickupSlots.reduce((sum, s) => sum + s.currentOrders, 0);
  const occupancyPercent = Math.round((totalBooked / totalCapacity) * 100);

  const steps = [
    {
      num: '1',
      title: 'Browse Menu',
      desc: 'Explore fresh Pakistani dishes, rolls, burgers, snacks, hot chai, and cold drinks.',
      icon: <Utensils className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '2',
      title: 'Choose Your Meal',
      desc: 'Customize portions and customize items right from your phone or campus laptop.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '3',
      title: 'Select Pickup Time',
      desc: 'Reserve a 15-minute slot during lunch hours (12:00 PM – 2:30 PM) with guaranteed slots.',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '4',
      title: 'Pay Seamlessly',
      desc: 'Pay instantly with your University Student Wallet or choose Cash at Cafeteria Counter.',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '5',
      title: 'Pick Up & Enjoy',
      desc: 'Skip the long line, display your digital token at Counter #1 or #2, and enjoy hot food.',
      icon: <PackageCheck className="w-5 h-5 text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0a2540] via-[#0d3156] to-[#0a2540] text-white py-16 md:py-24 overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/80 border border-blue-700/50 text-xs font-semibold text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bahria University, Karachi Campus • Official Cafeteria</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Beat the Lunch Rush
              </h1>

              <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Pre-order your favorite cafeteria meal, skip the queue, and pick it up when it's ready.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-order-now-btn"
                  onClick={() => navigateTo('/menu')}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-950/40 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {currentUser ? (
                  <button
                    id="hero-dashboard-btn"
                    onClick={() => {
                      if (currentUser.role === 'student') navigateTo('/student/dashboard');
                      else if (currentUser.role === 'staff') navigateTo('/staff/dashboard');
                      else if (currentUser.role === 'manager') navigateTo('/manager/dashboard');
                      else navigateTo('/admin/dashboard');
                    }}
                    className="w-full sm:w-auto px-6 py-4 bg-blue-950/80 hover:bg-blue-900 text-white font-bold text-sm sm:text-base rounded-xl border border-blue-700/60 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>MY DASHBOARD</span>
                    <span className="text-xs text-blue-300 font-normal">({currentUser.name.split(' ')[0]})</span>
                  </button>
                ) : (
                  <button
                    id="hero-login-btn"
                    onClick={() => navigateTo('/login')}
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-blue-50 text-[#0a2540] font-bold text-sm sm:text-base rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>LOGIN</span>
                  </button>
                )}
              </div>

              {/* Live Rush Status Pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Rush Window: <strong>12:00 PM – 2:30 PM</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Slots Booked: <strong>{occupancyPercent}%</strong></span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-3 rounded-2xl shadow-2xl border border-blue-900/30">
                <div className="relative rounded-xl overflow-hidden h-72 sm:h-80 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                    alt="Authentic Chicken Biryani"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  
                  {/* Floating campus badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          Today's Chef Special
                        </span>
                        <h3 className="text-lg font-bold text-white">Chicken Biryani Special</h3>
                        <p className="text-xs text-slate-300">Ready in 5-10 mins • Only Rs. 220</p>
                      </div>
                      <button
                        onClick={() => navigateTo('/menu')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro floating live ticker */}
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      BU
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Pickup Counter #1</p>
                      <p className="text-[11px] text-slate-500">Average wait time: &lt; 90 seconds</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                    Fast Track
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Food Section */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Cafeteria Items
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Student favorites freshly made at the Bahria University Karachi kitchen.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/menu')}
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <span>View Full Menu ({foodItems.length} items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Step by Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How It Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Five straightforward steps to skip the queue and grab lunch right between your lectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between relative hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      0{s.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Special Section: "Lunch Without the Wait" */}
          <div className="mt-14 bg-gradient-to-r from-blue-900 to-[#0a2540] text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-blue-800 text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-md mb-3">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Bahria Queue Management</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Lunch Without the Wait
              </h3>
              <p className="text-base sm:text-lg text-blue-100 mt-2 leading-relaxed">
                Scheduled pickup times help reduce cafeteria queues and crowding during busy lunch hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-blue-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  15-minute scheduled windows
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Max 10 orders per window
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No standing in 20-minute queues
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
