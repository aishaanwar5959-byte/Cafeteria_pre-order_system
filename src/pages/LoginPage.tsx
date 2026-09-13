import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  KeyRound,
  CheckCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo, quickLoginAs } = useApp();

  const [emailOrId, setEmailOrId] = useState('student@bahria.edu.pk');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(emailOrId, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
      // Note: upon success, login() inside AppContext already redirects to the respective role dashboard!
    }, 300);
  };

  const handleFillDemo = (email: string, pw: string) => {
    setEmailOrId(email);
    setPassword(pw);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-md">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Bahria University Cafeteria
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Karachi Campus Student & Staff Pre-Order Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-slate-200">
          
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / ID Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                University Email / Student ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="text"
                  required
                  placeholder="student@bahria.edu.pk or 02-134211-045"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Demo Password Reset: Use student123 for Student, staff123 for Staff, manager123 for Manager, admin123 for Administrator.'
                    )
                  }
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Signing In...' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              New Bahria student?{' '}
              <button
                id="login-create-account-btn"
                onClick={() => navigateTo('/register')}
                className="font-bold text-blue-700 hover:text-blue-900"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Demo Accounts Quick-Click Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Demo Credentials (Click to autofill)</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo('student@bahria.edu.pk', 'student123')}
                className="w-full text-left p-2 rounded-md hover:bg-blue-50 border border-slate-200 bg-white flex items-center justify-between text-slate-700 transition-colors"
              >
                <div>
                  <strong className="text-blue-900 block">Student:</strong>
                  <span className="text-[11px] text-slate-500">student@bahria.edu.pk / student123</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-100 px-1.5 py-0.5 rounded">
                  Fill
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('staff@bahria.edu.pk', 'staff123')}
                className="w-full text-left p-2 rounded-md hover:bg-amber-50 border border-slate-200 bg-white flex items-center justify-between text-slate-700 transition-colors"
              >
                <div>
                  <strong className="text-amber-900 block">Kitchen Staff:</strong>
                  <span className="text-[11px] text-slate-500">staff@bahria.edu.pk / staff123</span>
                </div>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                  Fill
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('manager@bahria.edu.pk', 'manager123')}
                className="w-full text-left p-2 rounded-md hover:bg-emerald-50 border border-slate-200 bg-white flex items-center justify-between text-slate-700 transition-colors"
              >
                <div>
                  <strong className="text-emerald-900 block">Manager:</strong>
                  <span className="text-[11px] text-slate-500">manager@bahria.edu.pk / manager123</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                  Fill
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@bahria.edu.pk', 'admin123')}
                className="w-full text-left p-2 rounded-md hover:bg-purple-50 border border-slate-200 bg-white flex items-center justify-between text-slate-700 transition-colors"
              >
                <div>
                  <strong className="text-purple-900 block">Administrator:</strong>
                  <span className="text-[11px] text-slate-500">admin@bahria.edu.pk / admin123</span>
                </div>
                <span className="text-[10px] text-purple-800 font-bold bg-purple-100 px-1.5 py-0.5 rounded">
                  Fill
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
