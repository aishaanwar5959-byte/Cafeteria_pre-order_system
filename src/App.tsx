import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleQuickSwitch } from './components/RoleQuickSwitch';
import { FoodDetailModal } from './components/FoodDetailModal';
import { WalletTopupModal } from './components/WalletTopupModal';
import { NotificationDrawer } from './components/NotificationDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/student/Dashboard';
import { StaffDashboard } from './pages/staff/Dashboard';
import { ManagerDashboard } from './pages/manager/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

import { Megaphone, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentRoute,
    systemSettings,
    isWalletModalOpen,
    setIsWalletModalOpen,
  } = useApp();
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Router view selector
  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage />;
      case '/menu':
        return <MenuPage />;
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/order-confirmation':
        return <OrderConfirmationPage />;
      case '/track-order':
        return <OrderTrackingPage />;
      case '/my-orders':
        return <MyOrdersPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/student/dashboard':
        return <StudentDashboard />;
      case '/staff/dashboard':
        return <StaffDashboard />;
      case '/manager/dashboard':
        return <ManagerDashboard />;
      case '/admin/dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Role Quick Switch Developer Bar */}
      <RoleQuickSwitch />

      {/* System Announcements Banner */}
      {systemSettings?.isAnnouncementActive && !isBannerDismissed && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2 mx-auto">
            <Megaphone className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{systemSettings.announcement}</span>
          </div>
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="p-1 text-slate-800 hover:text-black rounded"
            title="Dismiss Announcement"
            aria-label="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Modals & Drawers */}
      <FoodDetailModal />
      <WalletTopupModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Campus Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
