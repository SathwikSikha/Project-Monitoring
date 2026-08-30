import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function WhatIfSimulator({ project, onSimulate }) {
  const [params, setParams] = useState({
    contractor_performance: project?.contractor_performance || 70,
    resource_availability: project?.resource_availability || 70,
    material_availability: project?.material_availability || 70,
    workforce_availability: project?.workforce_availability || 70,
    planned_progress: project?.planned_progress || 60,
    actual_progress: project?.actual_progress || 45,
    delay_days: project?.delay_days || 30,
    change_requests: project?.change_requests || 2,
    weather_impact: project?.weather_impact || 2,
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleReset = () => {
    setParams({
      contractor_performance: project?.contractor_performance || 70,
      resource_availability: project?.resource_availability || 70,
      material_availability: project?.material_availability || 70,
      workforce_availability: project?.workforce_availability || 70,
      planned_progress: project?.planned_progress || 60,
      actual_progress: project?.actual_progress || 45,
      delay_days: project?.delay_days || 30,
      change_requests: project?.change_requests || 2,
      weather_impact: project?.weather_impact || 2,
    });
    setSimulationResult(null);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        category: project?.category || 'Highway',
        project_cost: project?.project_cost || 1000,
        planned_duration_months: project?.planned_duration_months || 36,
        expenditure_percentage: project?.expenditure_percentage || 50,
        milestone_completion_rate: project?.milestone_completion_rate || 70,
        previous_delay_count: project?.previous_delay_count || 1,
        risk_history: project?.risk_history || 3,
        ...params
      };
      
      const res = await onSimulate(payload);
      setSimulationResult(res);
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sliders size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>What-If Scenario Sandbox</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                Live Simulation
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Adjust project intervention levers to simulate ML mitigation impacts in real time.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {/* Contractor Performance */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Contractor Score</span>
            <span className="font-bold text-blue-400">{params.contractor_performance} / 100</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={params.contractor_performance}
            onChange={(e) => handleChange('contractor_performance', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Resource Availability */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Resource Availability</span>
            <span className="font-bold text-emerald-400">{params.resource_availability}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={params.resource_availability}
            onChange={(e) => handleChange('resource_availability', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Material Availability */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Material Supply</span>
            <span className="font-bold text-amber-400">{params.material_availability}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={params.material_availability}
            onChange={(e) => handleChange('material_availability', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Workforce Availability */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Workforce Staffing</span>
            <span className="font-bold text-indigo-400">{params.workforce_availability}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={params.workforce_availability}
            onChange={(e) => handleChange('workforce_availability', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Delay Days */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Accumulated Delay Days</span>
            <span className="font-bold text-red-400">{params.delay_days} Days</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={params.delay_days}
            onChange={(e) => handleChange('delay_days', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>

        {/* Actual Progress */}
        <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Actual Physical Progress</span>
            <span className="font-bold text-cyan-400">{params.actual_progress}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="95"
            value={params.actual_progress}
            onChange={(e) => handleChange('actual_progress', e.target.value)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      {/* Action Button & Live Output */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {isSimulating ? (
            <span>Computing ML Pipeline...</span>
          ) : (
            <>
              <Play size={14} className="fill-current" />
              <span>Simulate Mitigation Impact</span>
            </>
          )}
        </button>

        {simulationResult && (
          <div className="w-full sm:w-auto flex items-center gap-4 bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Simulated Risk</span>
              <RiskBadge level={simulationResult.risk_level} size="sm" />
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Health Score</span>
              <span className="text-sm font-bold text-emerald-400">{simulationResult.health_score}/100</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Predicted Delay</span>
              <span className="text-sm font-bold text-blue-400">{simulationResult.predicted_delay_months} Mo</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cost Overrun</span>
              <span className="text-sm font-bold text-amber-400">{simulationResult.predicted_cost_overrun_percentage}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
