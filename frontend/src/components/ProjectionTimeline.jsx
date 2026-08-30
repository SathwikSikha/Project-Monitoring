import React from 'react';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function ProjectionTimeline({ projections = [] }) {
  if (!projections || projections.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span>Future Risk Trajectory Projection (Timeline Forecast)</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Model-projected risk evolution if current operational pace continues without corrective intervention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {projections.map((step, idx) => {
          const isCurrent = step.period === 'CURRENT';
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all ${
                isCurrent 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-400/30' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {step.period}
                  </span>
                  <RiskBadge level={step.risk_level} size="sm" />
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Delay Exposure:</span>
                  <span className="font-bold text-slate-900">+{step.predicted_delay_months} mo</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Cost Overrun:</span>
                  <span className="font-bold text-slate-900">+{step.predicted_cost_overrun_percentage}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Health Index:</span>
                  <span className="font-bold text-blue-700">{step.health_score}/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 italic pt-1">
        * Note: Future trajectory projections are simulated deterministic extrapolations computed by the ML risk layer to guide proactive decision making.
      </p>
    </div>
  );
}
