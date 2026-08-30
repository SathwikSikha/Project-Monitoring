import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  ArrowLeft, 
  Sparkles, 
  Sliders, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HealthGauge from '../components/HealthGauge';
import RiskFactorsList from '../components/RiskFactorsList';
import RecommendationCard from '../components/RecommendationCard';
import ProjectionTimeline from '../components/ProjectionTimeline';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { api } from '../services/api';

export default function RiskAnalysis({ projectId, onBack, onSelectProject }) {
  const [projectsList, setProjectsList] = useState([]);
  const [selectedId, setSelectedId] = useState(projectId || null);
  const [analysis, setAnalysis] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all projects for quick selector dropdown
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const projs = await api.getProjects({ sort_by: 'risk' });
        setProjectsList(projs);
        if (!selectedId && projs.length > 0) {
          setSelectedId(projs[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // Fetch project analysis when selectedId changes
  useEffect(() => {
    if (!selectedId) return;

    const runAnalysis = async () => {
      try {
        setLoading(true);
        const [projRes, analysisRes] = await Promise.all([
          api.getProjectById(selectedId),
          api.runProjectAnalysis(selectedId)
        ]);
        setProjectData(projRes);
        setAnalysis(analysisRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [selectedId]);

  const handleManualReanalyze = async () => {
    if (!selectedId) return;
    try {
      setIsRefreshing(true);
      const res = await api.runProjectAnalysis(selectedId);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSimulateCustom = async (customPayload) => {
    return await api.predictCustomRisk(customPayload);
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw size={32} className="animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-700">Running ML Inference Pipeline & Diagnostic Synthesis...</p>
      </div>
    );
  }

  if (!analysis || !projectData) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-slate-600">Please select a valid project to analyze.</p>
        <button onClick={onBack} className="text-blue-600 font-bold text-xs underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { risk_component_breakdown } = analysis;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BrainCircuit className="text-blue-600" size={24} />
                <span>AI Risk Assessment & Intelligence Dossier</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                RandomForest ML
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live automated inference, multi-factor root cause diagnosis, and prescriptive mitigations.
            </p>
          </div>
        </div>

        {/* Project Switcher Dropdown */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            >
              {projectsList.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.risk_level}] {p.name.slice(0, 35)}...
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={handleManualReanalyze}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Re-Analyze</span>
          </button>
        </div>
      </div>

      {/* Hero Prediction Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Overall Risk */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Overall Risk Classification
          </span>
          <div className="pt-1">
            <RiskBadge level={analysis.risk_level} size="lg" />
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Evaluated by trained RandomForest Classifier
          </p>
        </div>

        {/* 2. Confidence */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Prediction Confidence
          </span>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {Math.round(analysis.confidence * 100)}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.confidence * 100}%` }} />
          </div>
        </div>

        {/* 3. Predicted Delay */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Predicted Project Delay
          </span>
          <p className="text-3xl font-black text-red-600 tracking-tight">
            +{analysis.predicted_delay_months} <span className="text-sm font-semibold text-slate-500">Months</span>
          </p>
          <p className="text-xs text-slate-500">
            Current delay lag: {projectData.delay_days} days
          </p>
        </div>

        {/* 4. Predicted Cost Overrun */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Estimated Cost Overrun
          </span>
          <p className="text-3xl font-black text-orange-600 tracking-tight">
            +{analysis.predicted_cost_overrun_percentage}%
          </p>
          <p className="text-xs text-slate-500">
            Overrun exposure: ₹{((projectData.project_cost * analysis.predicted_cost_overrun_percentage)/100).toFixed(1)} Cr
          </p>
        </div>
      </div>

      {/* Secondary Row: Risk Component Breakdown (Gauges) & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Component Exposure Gauges */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Risk Component Breakdown & Vulnerability Vectors
              </h3>
              <p className="text-xs text-slate-500">Isolated stress scores across 5 structural domains</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Schedule Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Schedule Risk</span>
              <p className="text-xl font-extrabold text-red-600">{risk_component_breakdown?.schedule_risk_pct}%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${risk_component_breakdown?.schedule_risk_pct}%` }} />
              </div>
            </div>

            {/* Cost Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Cost Risk</span>
              <p className="text-xl font-extrabold text-orange-600">{risk_component_breakdown?.cost_risk_pct}%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${risk_component_breakdown?.cost_risk_pct}%` }} />
              </div>
            </div>

            {/* Resource Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Resource Risk</span>
              <p className="text-xl font-extrabold text-amber-600">{risk_component_breakdown?.resource_risk_pct}%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${risk_component_breakdown?.resource_risk_pct}%` }} />
              </div>
            </div>

            {/* Contractor Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Contractor Risk</span>
              <p className="text-xl font-extrabold text-purple-600">{risk_component_breakdown?.contractor_risk_pct}%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${risk_component_breakdown?.contractor_risk_pct}%` }} />
              </div>
            </div>

            {/* Weather Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Weather Risk</span>
              <p className="text-xl font-extrabold text-cyan-600">{risk_component_breakdown?.weather_risk_pct}%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${risk_component_breakdown?.weather_risk_pct}%` }} />
              </div>
            </div>
          </div>

          {/* Root-Cause Explanation Section */}
          <div className="pt-2">
            <RiskFactorsList factors={analysis.risk_factors} />
          </div>
        </div>

        {/* Health Score Summary Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Diagnostic Health Score
            </h3>
            <p className="text-xs text-slate-500">{projectData.name}</p>
          </div>

          <div className="py-2">
            <HealthGauge score={analysis.health_score} size={130} strokeWidth={11} />
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Contractor:</span>
              <span className="font-bold text-slate-800">{projectData.contractor_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Executing Agency:</span>
              <span className="font-bold text-slate-800">{projectData.executing_agency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Telemetry:</span>
              <span className="font-mono text-slate-600">{analysis.analysis_timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Risk Trajectory Projection (1M, 3M, 6M) */}
      <ProjectionTimeline projections={analysis.timeline_projections} />

      {/* AI Prescriptive Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <span>AI RECOMMENDED ACTIONS & CORRECTIVE INTERVENTIONS</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized prescriptive measures mapped to diagnosed bottleneck vectors.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {analysis.recommendations?.length || 0} Action Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations?.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Interactive What-If Simulation Sandbox */}
      <WhatIfSimulator project={projectData} onSimulate={handleSimulateCustom} />
    </div>
  );
}
