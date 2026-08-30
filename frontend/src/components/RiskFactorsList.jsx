import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function RiskFactorsList({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
        <span>No adverse risk drivers detected. Project is currently operating within nominal safety margins.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-500" />
          <span>Why is this project at risk? (Dynamic Root-Cause Analysis)</span>
        </h4>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          {factors.length} Critical Driver{factors.length > 1 ? 's' : ''} Identified
        </span>
      </div>

      <div className="space-y-2">
        {factors.map((factor, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-sm transition-colors hover:bg-amber-100/60"
          >
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="font-medium leading-relaxed">{factor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
