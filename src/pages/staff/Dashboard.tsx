import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  Search,
  Filter,
  User,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
  Utensils,
  RefreshCw,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { orders, updateOrderStatus, currentUser } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL_ACTIVE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'time' | 'id' | 'status'>('time');

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Status filter
        if (statusFilter === 'ALL_ACTIVE') {
          if (o.status === 'COMPLETED' || o.status === 'CANCELLED') return false;
        } else if (statusFilter !== 'ALL') {
          if (o.status !== statusFilter) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = o.id.toLowerCase().includes(q);
          const matchStudent =
            o.studentName.toLowerCase().includes(q) ||
            o.studentId.toLowerCase().includes(q);
          const matchItems = o.items.some((i) => i.name.toLowerCase().includes(q));
          if (!matchId && !matchStudent && !matchItems) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'time') {
          return a.pickupSlotTime.localeCompare(b.pickupSlotTime);
        } else if (sortBy === 'id') {
          return b.id.localeCompare(a.id);
        } else {
          return a.status.localeCompare(b.status);
        }
      });
  }, [orders, statusFilter, searchQuery, sortBy]);

  // Statistics counters
  const activeCount = orders.filter(
    (o) => o.status === 'ORDER RECEIVED' || o.status === 'PREPARING'
  ).length;
  const readyCount = orders.filter((o) => o.status === 'READY FOR PICKUP').length;
  const completedToday = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Staff Kitchen Header */}
        <div className="bg-[#0a2540] text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Kitchen Dispatch & Prep Board
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-xs uppercase">
                  Staff View
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Bahria University Karachi Central Kitchen • Live Kitchen Display System (KDS)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-900/70 border border-blue-700/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">
                In Preparation
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {activeCount}
              </span>
            </div>
            <div className="bg-blue-900/70 border border-blue-700/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">
                Ready at Counter
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {readyCount}
              </span>
            </div>
            <div className="bg-blue-900/70 border border-blue-700/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">
                Handed Over
              </span>
              <span className="text-xl font-black text-white font-mono">
                {completedToday}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="staff-search-input"
                type="text"
                placeholder="Search by Order ID (e.g. BU-1001), Student Name, or Food Item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
              <select
                id="staff-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:bg-white"
              >
                <option value="ALL_ACTIVE">Active Kitchen Orders</option>
                <option value="ALL">All Orders (Including Completed)</option>
                <option value="ORDER RECEIVED">Order Received (New)</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY FOR PICKUP">Ready For Pickup</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                id="staff-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:bg-white"
              >
                <option value="time">Sort by Pickup Time</option>
                <option value="id">Sort by Order ID</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid / KDS Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">All Clear in Kitchen</h3>
            <p className="text-xs text-slate-500 mt-1">
              No orders found matching the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isReady = order.status === 'READY FOR PICKUP';
              const isPrep = order.status === 'PREPARING';
              const isReceived = order.status === 'ORDER RECEIVED';
              const isCompleted = order.status === 'COMPLETED';

              return (
                <div
                  key={order.id}
                  id={`staff-order-card-${order.id}`}
                  className={`bg-white rounded-xl shadow-xs border-2 transition-all flex flex-col justify-between ${
                    isReady
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : isPrep
                      ? 'border-amber-400'
                      : isReceived
                      ? 'border-blue-400'
                      : 'border-slate-200 opacity-75'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-lg bg-[#0a2540] text-white font-mono font-black text-xs flex items-center justify-center">
                          #{order.tokenNumber}
                        </span>
                        <div>
                          <h3 className="font-black text-sm text-slate-900">
                            {order.id}
                          </h3>
                          <span className="text-[11px] text-slate-500 block">
                            {order.studentName} ({order.studentId})
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isReady
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : isPrep
                            ? 'bg-amber-500 text-white'
                            : isReceived
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Slot window pill */}
                    <div className="mt-3 flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pickup: {order.pickupSlotTime}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentMethod === 'UNIVERSITY WALLET' ? 'PAID (Wallet)' : 'UNPAID (Cash)'}
                      </span>
                    </div>
                  </div>

                  {/* Items to prepare */}
                  <div className="p-4 flex-1 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kitchen Items to Cook / Pack:
                    </span>
                    <div className="divide-y divide-slate-100 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {item.name}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-900 font-black text-xs">
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                        <strong>Kitchen Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Mark as PREPARING, READY, COMPLETED */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Change Order Status:
                    </span>
                    
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        id={`btn-prep-${order.id}`}
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          isPrep
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
                        }`}
                      >
                        PREPARING
                      </button>

                      <button
                        id={`btn-ready-${order.id}`}
                        onClick={() => updateOrderStatus(order.id, 'READY FOR PICKUP')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          isReady
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-400'
                        }`}
                      >
                        READY
                      </button>

                      <button
                        id={`btn-done-${order.id}`}
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          isCompleted
                            ? 'bg-slate-800 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        HANDED OVER
                      </button>
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
