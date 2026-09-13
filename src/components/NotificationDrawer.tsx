import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check, CheckCheck, Clock, ArrowRight, ExternalLink } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-[#0a2540] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Campus Notifications</h3>
            <span className="text-xs bg-blue-800 px-2 py-0.5 rounded-full text-blue-200 font-semibold">
              {notifications.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-blue-200 hover:text-white flex items-center gap-1 font-medium bg-blue-900/60 px-2 py-1 rounded"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-blue-200 hover:text-white hover:bg-blue-900/60 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <Bell className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-bold text-sm text-slate-600">No Notifications</p>
              <p className="text-xs mt-1">Updates on your cafeteria orders will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const dateStr = new Date(n.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.orderId) {
                      navigateTo('/track-order', { orderId: n.orderId });
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer mb-1 ${
                    n.read
                      ? 'bg-white hover:bg-slate-50 text-slate-700'
                      : 'bg-blue-50/80 hover:bg-blue-100/60 border-l-4 border-blue-600 text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 leading-snug">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {n.orderId && (
                    <div className="mt-2 flex items-center justify-between pt-1 text-[11px] text-blue-700 font-semibold">
                      <span>Order #{n.orderId}</span>
                      <span className="flex items-center gap-1 hover:underline">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          Bahria University Automated Cafeteria Dispatcher
        </div>
      </div>
    </div>
  );
};
