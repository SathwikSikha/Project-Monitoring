import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 card-shadow hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${selectedColor}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || trendLabel) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5">
          <span>{subtitle}</span>
          {trendLabel && (
            <span className={`font-medium ${trend === 'down' ? 'text-emerald-600' : trend === 'up' ? 'text-red-600' : 'text-slate-500'}`}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
