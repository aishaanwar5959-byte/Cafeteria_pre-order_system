import React from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, MapPin, Clock, ShieldCheck, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#061526] text-slate-400 text-xs border-t border-blue-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: University Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Bahria University</span>
                <span className="text-[10px] text-blue-300 block">Cafeteria Pre-Order System</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Skip lunch queues with designated 15-minute pickup slots. Made exclusively for students, faculty, and campus staff.
            </p>
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>13, National Stadium Road, Karachi, Pakistan</span>
            </div>
          </div>

          {/* Col 2: Service Hours */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Operating Hours
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center justify-between text-slate-300">
                <span>Breakfast:</span>
                <span className="text-white font-medium">8:00 AM – 11:30 AM</span>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Lunch Rush:</span>
                <span className="text-amber-400 font-bold">12:00 PM – 2:30 PM</span>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Evening Snacks:</span>
                <span className="text-white font-medium">2:30 PM – 5:30 PM</span>
              </li>
              <li className="pt-1 text-[11px] text-blue-300">
                * Pre-orders open daily from 7:30 AM
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => navigateTo('/')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('/menu')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                Cafeteria Menu
              </button>
              <button
                onClick={() => navigateTo('/how-it-works')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => navigateTo('/cart')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                Your Tray
              </button>
              <button
                onClick={() => navigateTo('/my-orders')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                Order History
              </button>
              <button
                onClick={() => navigateTo('/track-order')}
                className="text-left text-slate-400 hover:text-white transition-colors"
              >
                Track Pickup
              </button>
            </div>
          </div>

          {/* Col 4: Campus Notice & Support */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Pickup Counter Notice
            </h4>
            <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/40 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pickup Counter #1 & #2</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Please present your digital token number on your phone when collecting hot meals.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <Mail className="w-3 h-3 text-blue-400" />
              <span>cafeteria@bahria.edu.pk</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Bahria University, Karachi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Campus Food Services Division</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Official Student Pickup Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
