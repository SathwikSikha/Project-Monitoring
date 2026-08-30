import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowLeft, 
  UserCheck, 
  Layers, 
  AlertTriangle,
  FileCheck2,
  HardHat,
  Cpu,
  RefreshCw,
  Gauge
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HealthGauge, { HealthBar } from '../components/HealthGauge';
import { api } from '../services/api';

export default function ProjectDetails({ projectId, onBack, onRunAnalysis }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await api.getProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId]);

  const handleRunAnalysisClick = async () => {
    setIsAnalyzing(true);
    try {
      await onRunAnalysis(projectId);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <RefreshCw size={28} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-slate-600">Project record not found.</p>
        <button onClick={onBack} className="text-blue-600 font-bold text-xs underline">
          Return to Projects List
        </button>
      </div>
    );
  }

  const progressDeviation = (project.planned_progress - project.actual_progress).toFixed(1);
  const costBurnRatio = (project.expenditure_percentage / Math.max(project.actual_progress, 1.0)).toFixed(2);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Back to Projects"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {project.code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {project.category}
              </span>
              <RiskBadge level={project.risk_level} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {project.name}
            </h1>
          </div>
        </div>

        {/* Action Button: RUN AI ANALYSIS */}
        <button
          onClick={handleRunAnalysisClick}
          disabled={isAnalyzing}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-60"
        >
          {isAnalyzing ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Cpu size={16} />
          )}
          <span>RUN AI ANALYSIS</span>
        </button>
      </div>

      {/* Main Grid: Health Score Card & Key Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weighted Project Health Score */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Gauge size={16} className="text-blue-600" />
                <span>Project Health Score</span>
              </h3>
              <p className="text-xs text-slate-500">Multivariate composite diagnostic</p>
            </div>
          </div>

          <div className="py-2">
            <HealthGauge score={project.health_score} size={140} strokeWidth={12} />
          </div>

          {/* Component Scores Breakdown */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <HealthBar 
              label="Schedule Health" 
              value={Math.max(0, 100 - (project.planned_progress - project.actual_progress) * 2.5 - (project.delay_days / 6))} 
              weight="30%" 
            />
            <HealthBar 
              label="Cost Health" 
              value={Math.max(0, 100 - Math.max(0, (project.expenditure_percentage / Math.max(project.actual_progress, 1.0)) - 1.0) * 140)} 
              weight="20%" 
            />
            <HealthBar 
              label="Resource Health" 
              value={project.resource_availability * 0.4 + project.material_availability * 0.3 + project.workforce_availability * 0.3} 
              weight="20%" 
            />
            <HealthBar 
              label="Contractor Health" 
              value={project.contractor_performance} 
              weight="15%" 
            />
            <HealthBar 
              label="Milestones Health" 
              value={project.milestone_completion_rate} 
              weight="15%" 
            />
          </div>
        </div>

        {/* Right 2-Columns: Comprehensive Telemetry & Financials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Bar */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Location / State</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin size={14} className="text-slate-500" />
                {project.location}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Total Budget</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                ₹{project.project_cost.toLocaleString('en-IN')} Cr
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Planned Duration</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {project.planned_duration_months} Months
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Target Completion</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {project.target_completion_date}
              </span>
            </div>
          </div>

          {/* Schedule & Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Schedule Tracking Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-600" />
                  <span>Physical Progress Tracking</span>
                </h4>
                <span className={`text-xs font-bold ${progressDeviation > 10 ? 'text-red-600' : 'text-slate-600'}`}>
                  Lag: {progressDeviation}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Actual Physical Progress:</span>
                  <span className="font-bold text-blue-600">{project.actual_progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.actual_progress}%` }} />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Planned Baseline Target:</span>
                  <span className="font-semibold text-slate-500">{project.planned_progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: `${project.planned_progress}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Accumulated Delay</span>
                  <span className="font-bold text-red-600">{project.delay_days} Calendar Days</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Milestone Completion</span>
                  <span className="font-bold text-slate-800">{project.milestone_completion_rate}%</span>
                </div>
              </div>
            </div>

            {/* Financial & Expenditure Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-emerald-600" />
                  <span>Expenditure & Budget Utilization</span>
                </h4>
                <span className="text-xs font-bold text-slate-600">
                  Ratio: {costBurnRatio}x
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Budget Spent to Date:</span>
                  <span className="font-bold text-emerald-600">{project.expenditure_percentage}% (₹{((project.project_cost * project.expenditure_percentage)/100).toFixed(1)} Cr)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${project.expenditure_percentage}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Change Orders</span>
                  <span className="font-bold text-slate-800">{project.change_requests} Scope Revisions</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Historical Delays</span>
                  <span className="font-bold text-slate-800">{project.previous_delay_count} Incidents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Indicators: Contractor, Resources, Weather */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <HardHat size={14} className="text-indigo-600" />
              <span>Operational & Supply Chain Telemetry</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Contractor Score</span>
                <p className="text-base font-extrabold text-slate-900">{project.contractor_performance}/100</p>
                <span className="text-[10px] text-slate-500 truncate block">{project.contractor_name}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Material Supply</span>
                <p className="text-base font-extrabold text-slate-900">{project.material_availability}%</p>
                <span className="text-[10px] text-slate-500 block">Choke-point index</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Workforce Staffing</span>
                <p className="text-base font-extrabold text-slate-900">{project.workforce_availability}%</p>
                <span className="text-[10px] text-slate-500 block">Active site shifts</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Weather Severity</span>
                <p className="text-base font-extrabold text-slate-900">{project.weather_impact} / 10</p>
                <span className="text-[10px] text-slate-500 block">Terrain & climate factor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
