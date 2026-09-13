import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  Users,
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  Clock,
  Megaphone,
  CheckCircle2,
  Trash2,
  Plus,
  KeyRound,
  Sparkles,
  Save,
  AlertCircle,
  Building,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    orders,
    systemSettings,
    updateSystemSettings,
    updateUserRole,
    currentUser,
  } = useApp();

  // Settings form states
  const [announcement, setAnnouncement] = useState(systemSettings?.announcement || '');
  const [isBannerActive, setIsBannerActive] = useState(
    systemSettings?.isAnnouncementActive ?? true
  );
  const [openTime, setOpenTime] = useState(systemSettings?.cafeteriaOpenTime || '08:00 AM');
  const [closeTime, setCloseTime] = useState(systemSettings?.cafeteriaCloseTime || '05:00 PM');
  const [lunchRushStart, setLunchRushStart] = useState(
    systemSettings?.lunchRushStart || '12:00 PM'
  );
  const [lunchRushEnd, setLunchRushEnd] = useState(
    systemSettings?.lunchRushEnd || '02:30 PM'
  );

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Stats
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalStaff = users.filter((u) => u.role === 'staff').length;
  const totalManagers = users.filter((u) => u.role === 'manager').length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      announcement,
      isAnnouncementActive: isBannerActive,
      cafeteriaOpenTime: openTime,
      cafeteriaCloseTime: closeTime,
      lunchRushStart,
      lunchRushEnd,
    });
    setSavedNotice('Cafeteria System Settings & Hours successfully updated!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-[#0a2540] text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  University System Administration
                </h1>
                <span className="px-2.5 py-0.5 rounded bg-purple-400/20 text-purple-300 font-bold text-xs uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Bahria University Karachi • IT Directorate & Cafeteria Governance
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-blue-200">
            <span>Admin logged in: <strong>{currentUser?.name}</strong></span>
            <span className="block text-[11px] text-blue-300">Role-Based Access Control (RBAC) Active</span>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Registered Students
              </span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">
                {totalStudents}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Active Bahria enrollments</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Cafeteria Orders
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {totalOrders}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Pre-orders processed</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                System Revenue
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                Rs. {totalRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Lifetime campus volume</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Kitchen & Staff Users
              </span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                {totalStaff + totalManagers}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{totalStaff} Staff • {totalManagers} Managers</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* System Settings & Announcements Form */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Cafeteria Operating Hours & Campus Announcement</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure live notifications shown across all student and staff portals.
              </p>
            </div>
          </div>

          {savedNotice && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="mt-5 space-y-4 text-xs">
            {/* Announcement text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  Campus Announcement Banner Text:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="banner-toggle"
                    checked={isBannerActive}
                    onChange={(e) => setIsBannerActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="banner-toggle" className="font-semibold text-slate-600">
                    Display Banner on Top of App
                  </label>
                </div>
              </div>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Lunch rush pre-orders are open! Avoid cafeteria queues..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cafeteria Opens
                </label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cafeteria Closes
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Peak Lunch Rush Start
                </label>
                <input
                  type="text"
                  value={lunchRushStart}
                  onChange={(e) => setLunchRushStart(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Peak Lunch Rush End
                </label>
                <input
                  type="text"
                  value={lunchRushEnd}
                  onChange={(e) => setLunchRushEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>User Management & RBAC Permissions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage accounts across Student, Staff, Manager, and Administrator tiers.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
              {users.length} Total Registered Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Student ID / Enrollment</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {u.studentId || 'N/A (Staff/Admin)'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      Rs. {u.walletBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900'
                            : u.role === 'manager'
                            ? 'bg-emerald-100 text-emerald-900'
                            : u.role === 'staff'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateUserRole(u.id, e.target.value as UserRole)
                        }
                        className="py-1 px-2 text-xs border border-slate-300 rounded font-semibold bg-white text-slate-800"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Kitchen Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
