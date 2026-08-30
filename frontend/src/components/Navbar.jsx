import React from 'react';
import { ShieldCheck, Bell, Activity, Sparkles } from 'lucide-react';

export default function Navbar({ unreadAlertsCount = 0, onNavigateToAlerts }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Brand Treatment */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-slate-900 font-sans">PAIMANA</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                SIH 2026 Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Project Assessment, Intelligence, Monitoring & Analytics
            </p>
          </div>
        </div>

        {/* Right Action Icons & Status Pill */}
        <div className="flex items-center gap-4">
          {/* Live ML Engine Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RandomForest Inference Active</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onNavigateToAlerts}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Active Alerts"
          >
            <Bell size={20} />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              GOI
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Infrastructure Cell</p>
              <p className="text-[10px] text-slate-400 font-medium">Monitoring Authority</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
