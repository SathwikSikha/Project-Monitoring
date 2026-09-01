import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BrainCircuit, 
  BellRing, 
  Info,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, unreadAlertsCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Explorer', icon: FolderKanban },
    { id: 'analysis', label: 'AI Risk Analysis', icon: BrainCircuit, badge: 'ML' },
    { id: 'alerts', label: 'Critical Alerts', icon: BellRing, count: unreadAlertsCount },
    { id: 'about', label: 'About & Methodology', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.count > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                      {item.count}
                    </span>
                  )}
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Monitoring Highlights Box */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <ShieldAlert size={14} />
            <span>AI Decision Support</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Multi-model RandomForest pipeline monitoring delays, cost overruns, and multi-class risk vectors.
          </p>
          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Accuracy: <strong className="text-emerald-400">100%</strong></span>
            <span>Delay MAE: <strong className="text-blue-300">0.68m</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Version */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between px-2">
        <span>Traxis v1.0.0</span>
      </div>
    </aside>
  );
}
