import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Bell,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  Clock,
  Wallet,
  Shield,
  LayoutDashboard,
  FileText,
  ListOrdered,
  Layers,
  BarChart3,
  CalendarCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenWalletModal }) => {
  const { currentUser, currentRoute, navigateTo, logout, cartCount, unreadNotificationCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const role = currentUser?.role;

  // Generate navigation links based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Home', route: '/' },
        { label: 'Menu', route: '/menu' },
        { label: 'How It Works', route: '/how-it-works' },
        { label: 'My Orders', route: '/login' },
      ];
    }

    if (role === 'student') {
      return [
        { label: 'Home', route: '/' },
        { label: 'Menu', route: '/menu' },
        { label: 'Dashboard', route: '/student/dashboard' },
        { label: 'My Orders', route: '/my-orders' },
        { label: 'Track Order', route: '/track-order' },
        { label: 'How It Works', route: '/how-it-works' },
      ];
    }

    if (role === 'staff') {
      return [
        { label: 'Dashboard', route: '/staff/dashboard' },
        { label: 'Incoming Orders', route: '/staff/dashboard?tab=incoming' },
        { label: 'Preparing', route: '/staff/dashboard?tab=preparing' },
        { label: 'Ready for Pickup', route: '/staff/dashboard?tab=ready' },
        { label: 'Completed', route: '/staff/dashboard?tab=completed' },
        { label: 'Rush Hour', route: '/staff/dashboard?tab=rush' },
      ];
    }

    if (role === 'manager') {
      return [
        { label: 'Dashboard', route: '/manager/dashboard' },
        { label: 'Menu Management', route: '/manager/dashboard?tab=menu' },
        { label: 'Inventory', route: '/manager/dashboard?tab=inventory' },
        { label: 'Pickup Slots', route: '/manager/dashboard?tab=slots' },
        { label: 'Orders', route: '/manager/dashboard?tab=orders' },
        { label: 'Sales', route: '/manager/dashboard?tab=sales' },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Dashboard', route: '/admin/dashboard' },
        { label: 'System Overview', route: '/admin/dashboard?tab=overview' },
        { label: 'Orders', route: '/admin/dashboard?tab=orders' },
        { label: 'Users', route: '/admin/dashboard?tab=users' },
        { label: 'Revenue', route: '/admin/dashboard?tab=revenue' },
        { label: 'Rush Hour', route: '/admin/dashboard?tab=rush' },
        { label: 'Reports', route: '/admin/dashboard?tab=reports' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-30 bg-[#0a2540] text-white shadow-md border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Branding */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-400/30 group-hover:bg-blue-500 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-blue-200 leading-tight">
                Bahria University
              </div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1.5">
                <span>Cafeteria Pre-Order</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-800/80 text-blue-200 border border-blue-700/50">
                  Karachi
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || currentRoute.startsWith(link.route + '?');
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.route)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold'
                      : 'text-blue-100 hover:text-white hover:bg-blue-900/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Wallet Display */}
            {currentUser && currentUser.role === 'student' && (
              <button
                id="header-wallet-btn"
                onClick={onOpenWalletModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-950/80 hover:bg-blue-900/80 border border-blue-700/40 text-xs font-semibold text-blue-100 transition-colors"
                title="View & Top Up University Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>Rs. {currentUser.walletBalance.toLocaleString()}</span>
                <span className="text-[10px] bg-blue-800 px-1 py-0.2 rounded text-blue-200 hover:text-white">
                  + Add
                </span>
              </button>
            )}

            {/* Notification Bell */}
            {currentUser && (
              <button
                id="header-notifications-btn"
                onClick={onOpenNotifications}
                className="relative p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-md transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-[#0a2540]">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Always visible for students or guests) */}
            {(!currentUser || currentUser.role === 'student') && (
              <button
                id="header-cart-btn"
                onClick={() => handleNav('/cart')}
                className="relative flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-semibold shadow-sm transition-colors"
                title="View Tray / Cart"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Tray</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-white text-blue-900 font-bold text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Login State */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="header-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md hover:bg-blue-900/60 border border-blue-800/40 text-sm transition-colors"
                  aria-expanded={userDropdownOpen}
                  aria-label="User menu"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-blue-400/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center font-bold text-xs text-blue-100">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline font-medium text-xs text-blue-100 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 text-slate-800 ring-1 ring-black/10 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium capitalize">
                        {currentUser.role} Account
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser.studentId || currentUser.employeeId || currentUser.email}
                      </p>
                      {currentUser.role === 'student' && (
                        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-slate-600">Wallet:</span>
                          <span className="font-bold text-emerald-700">
                            Rs. {currentUser.walletBalance.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {currentUser.role === 'student' && (
                      <>
                        <button
                          onClick={() => handleNav('/student/dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          Student Dashboard
                        </button>
                        <button
                          onClick={() => handleNav('/my-orders')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <ListOrdered className="w-4 h-4 text-blue-600" />
                          My Orders
                        </button>
                        <button
                          onClick={() => handleNav('/track-order')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-blue-600" />
                          Track Active Order
                        </button>
                      </>
                    )}

                    {currentUser.role === 'staff' && (
                      <button
                        onClick={() => handleNav('/staff/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-600" />
                        Staff Dashboard
                      </button>
                    )}

                    {currentUser.role === 'manager' && (
                      <button
                        onClick={() => handleNav('/manager/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        Manager Dashboard
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleNav('/admin/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />
                    <button
                      id="header-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => handleNav('/login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white hover:bg-blue-900/60 rounded-md transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => handleNav('/register')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-white text-[#0a2540] hover:bg-blue-50 rounded-md transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-900/80 bg-[#071d33] px-4 pt-2 pb-6 space-y-1">
          {currentUser && currentUser.role === 'student' && (
            <div className="p-3 mb-3 bg-blue-950/90 rounded-lg border border-blue-800/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-300">University Wallet Balance</p>
                <p className="text-base font-bold text-white">
                  Rs. {currentUser.walletBalance.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWalletModal();
                }}
                className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
              >
                + Top Up
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.route)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold'
                      : 'text-blue-100 hover:bg-blue-900/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {currentUser ? (
            <div className="pt-3 border-t border-blue-900/60 mt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-800/40"
              >
                <LogOut className="w-4 h-4" />
                Logout ({currentUser.name})
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-blue-900/60 mt-3 flex gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="flex-1 py-2 text-center text-sm font-semibold text-white bg-blue-900 rounded-md"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="flex-1 py-2 text-center text-sm font-semibold text-slate-900 bg-white rounded-md"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
