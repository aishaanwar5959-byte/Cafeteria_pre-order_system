import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, GraduationCap, Utensils, Award } from 'lucide-react';

export const RoleQuickSwitch: React.FC = () => {
  const { currentUser, quickLoginAs, currentRoute } = useApp();

  const roles: { role: UserRole; label: string; email: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      label: 'Student (Bilal)',
      email: 'student@bahria.edu.pk',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      color: 'bg-blue-900 text-blue-100 hover:bg-blue-800',
    },
    {
      role: 'staff',
      label: 'Kitchen Staff (Tariq)',
      email: 'staff@bahria.edu.pk',
      icon: <Utensils className="w-3.5 h-3.5" />,
      color: 'bg-amber-900 text-amber-100 hover:bg-amber-800',
    },
    {
      role: 'manager',
      label: 'Cafeteria Manager (Rashid)',
      email: 'manager@bahria.edu.pk',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'bg-emerald-900 text-emerald-100 hover:bg-emerald-800',
    },
    {
      role: 'admin',
      label: 'Admin (Dr. Farooq)',
      email: 'admin@bahria.edu.pk',
      icon: <Award className="w-3.5 h-3.5" />,
      color: 'bg-purple-900 text-purple-100 hover:bg-purple-800',
    },
  ];

  return (
    <aside aria-label="Demo Testing Controls" className="bg-[#07172b] text-slate-300 text-xs border-b border-blue-950 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 z-40">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-200">Bahria University Karachi Campus</span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="hidden sm:inline text-slate-400">Demo Role Switcher:</span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        {roles.map((r) => {
          const isActive = currentUser?.role === r.role;
          return (
            <button
              key={r.role}
              id={`quick-switch-${r.role}`}
              onClick={() => quickLoginAs(r.role)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[11px] font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={`Quick switch to ${r.label} (${r.email})`}
            >
              {r.icon}
              <span>{r.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
