import React from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, UserCheck, Zap } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const { category, priority, title, action, impact, owner } = recommendation;

  const priorityColors = {
    CRITICAL: {
      badge: 'bg-red-100 text-red-800 border-red-200',
      border: 'border-l-red-500',
    },
    HIGH: {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      border: 'border-l-orange-500',
    },
    MEDIUM: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      border: 'border-l-amber-500',
    },
    LOW: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      border: 'border-l-emerald-500',
    }
  };

  const style = priorityColors[priority] || priorityColors.MEDIUM;

  return (
    <div className={`bg-white rounded-xl p-4 border border-slate-200 border-l-4 ${style.border} card-shadow space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
              {priority} PRIORITY
            </span>
            <span className="text-xs font-semibold text-slate-500">{category}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
        {action}
      </p>

      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-blue-700 font-medium bg-blue-50/80 px-2 py-1 rounded">
          <Zap size={13} className="text-blue-600 shrink-0" />
          <span><strong>Target Impact:</strong> {impact}</span>
        </div>

        {owner && (
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <UserCheck size={13} />
            <span>{owner}</span>
          </div>
        )}
      </div>
    </div>
  );
}
