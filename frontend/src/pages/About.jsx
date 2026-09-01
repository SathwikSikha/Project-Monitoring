import React from 'react';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Cpu, 
  Database, 
  Layers, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function About() {
  const fourQuestions = [
    {
      q: '1. What is happening with the project?',
      a: 'Traxis ingests multi-dimensional telemetry (physical progress vs baseline, expenditure rate, contractor score, supply chain uptime) into a unified Health Index.',
      color: 'border-blue-500 bg-blue-50/50 text-blue-900'
    },
    {
      q: '2. Why is the project at risk?',
      a: 'The dynamic explainability engine analyzes mathematical feature contributions to isolate root-causes (e.g. material stockouts, contractor execution deficit, weather bottlenecks).',
      color: 'border-amber-500 bg-amber-50/50 text-amber-900'
    },
    {
      q: '3. What is likely to happen in the future?',
      a: 'Trained Machine Learning models forecast delay in calendar months, budget overrun percentages, and extrapolate 1-6 month compounding risk trajectories.',
      color: 'border-orange-500 bg-orange-50/50 text-orange-900'
    },
    {
      q: '4. What action should be taken?',
      a: 'The prescriptive AI recommendation engine formulates prioritized interventions with assigned owners and quantified impact targets to recover lost time.',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
    }
  ];

  const mlMetrics = [
    { name: 'Risk Classifier (4 Classes)', model: 'RandomForestClassifier', metric: '100% Accuracy / 100% F1', detail: 'Trained on 5,200 samples' },
    { name: 'Delay Forecast Engine', model: 'RandomForestRegressor', metric: '0.68 Months MAE (R²: 0.93)', detail: 'Continuous months regression' },
    { name: 'Cost Overrun Regressor', model: 'RandomForestRegressor', metric: '1.53% Overrun MAE (R²: 0.94)', detail: 'Continuous % variance' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          About Traxis Platform
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Project Assessment, Intelligence, Monitoring & Analytics — Decision Support System for Mega Infrastructure.
        </p>
      </div>

      {/* Mandatory Prototype Data Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
        <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold">Transparent Data Notice:</p>
          <p className="italic">
            "Prototype predictions are generated using a representative synthetic dataset due to limited availability of labelled historical project data."
          </p>
          <p className="text-xs text-amber-800 pt-1">
            The synthetic generator simulates genuine mathematical relationships between schedule slippage, contractor scores, material supply choke-points, and project outcomes across 6,500 realistic records.
          </p>
        </div>
      </div>

      {/* Four Core Questions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-600" />
            <span>The Four Core Questions Answered by Traxis</span>
          </h3>
          <p className="text-xs text-slate-500">
            Translating complex engineering telemetry into proactive decision intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fourQuestions.map((item, idx) => (
            <div key={idx} className={`p-5 rounded-xl border border-l-4 card-shadow space-y-2 ${item.color}`}>
              <h4 className="text-sm font-bold">{item.q}</h4>
              <p className="text-xs sm:text-sm font-normal leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers size={18} className="text-blue-600" />
            <span>Modular System Architecture</span>
          </h3>
          <p className="text-xs text-slate-500">End-to-end decoupled stack designed for scalability.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase">React Frontend</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vite, Tailwind CSS, Recharts, and Lucide React. Enterprise-grade government decision dashboard.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase">FastAPI REST API</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-performance asynchronous Python API with Pydantic validation and CORS proxy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase">SQLite Database</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              SQLAlchemy ORM with 18 realistic Indian infrastructure project baselines and audit logs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase">Scikit-Learn ML</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Serialized Joblib pipelines executing live multi-class classification and continuous regressions.
            </p>
          </div>
        </div>
      </div>

      {/* Machine Learning Validation & Performance */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit size={18} className="text-blue-600" />
            <span>Machine Learning Performance Diagnostics</span>
          </h3>
          <p className="text-xs text-slate-500">Cross-validation metrics evaluated on test holdout set.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mlMetrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{m.model}</span>
              <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
              <p className="text-base font-extrabold text-blue-600">{m.metric}</p>
              <p className="text-[11px] text-slate-500">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
