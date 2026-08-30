import React from 'react';

export default function HealthGauge({ score = 85, size = 120, strokeWidth = 10, showLabel = true }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  
  // Color calculation based on health score
  let strokeColor = '#10b981'; // green
  let statusText = 'ON TRACK';
  let textColor = 'text-emerald-600';
  let bgColor = 'bg-emerald-50';

  if (safeScore < 45) {
    strokeColor = '#ef4444'; // red
    statusText = 'CRITICAL';
    textColor = 'text-red-600';
    bgColor = 'bg-red-50';
  } else if (safeScore < 65) {
    strokeColor = '#f97316'; // orange
    statusText = 'AT RISK';
    textColor = 'text-orange-600';
    bgColor = 'bg-orange-50';
  } else if (safeScore < 80) {
    strokeColor = '#eab308'; // yellow
    statusText = 'MODERATE';
    textColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Health progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{safeScore}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${textColor} ${bgColor}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
}

export function HealthBar({ label, value, weight, color = "blue" }) {
  const safeVal = Math.max(0, Math.min(100, Math.round(value)));
  
  let barColor = "bg-blue-600";
  if (safeVal < 50) barColor = "bg-red-500";
  else if (safeVal < 70) barColor = "bg-amber-500";
  else barColor = "bg-emerald-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium text-slate-700">
        <span className="flex items-center gap-1.5">
          {label}
          {weight && <span className="text-[10px] text-slate-400">({weight})</span>}
        </span>
        <span className="font-semibold text-slate-900">{safeVal}/100</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ${barColor}`} 
          style={{ width: `${safeVal}%` }}
        />
      </div>
    </div>
  );
}
