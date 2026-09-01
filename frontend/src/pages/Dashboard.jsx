import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Clock, 
  IndianRupee,
  ArrowRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import HealthGauge from '../components/HealthGauge';
import { api } from '../services/api';

export default function Dashboard({ onSelectProject, onNavigateToProjects, onNavigateToAnalysis }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Unable to connect to Traxis Backend API. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw size={32} className="text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading infrastructure monitoring intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 m-6 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-3">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle size={20} />
          <span>Backend Connection Error</span>
        </div>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const riskPieData = [
    { name: 'Low Risk', value: stats.risk_distribution?.LOW || 0, color: '#10b981' },
    { name: 'Medium Risk', value: stats.risk_distribution?.MEDIUM || 0, color: '#eab308' },
    { name: 'High Risk', value: stats.risk_distribution?.HIGH || 0, color: '#f97316' },
    { name: 'Critical Risk', value: stats.risk_distribution?.CRITICAL || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Infrastructure Command Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
              Live Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-project risk assessment, delay forecasting, and cost overrun prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <RefreshCw size={14} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={onNavigateToProjects}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition"
          >
            <span>Explore All Projects</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Monitored Projects"
          value={stats.total_projects}
          subtitle={`₹${(stats.total_budget_cr / 1000).toFixed(1)}k Cr Total Portfolio`}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="On-Track (Low Risk)"
          value={stats.on_track_count}
          subtitle={`${Math.round((stats.on_track_count / stats.total_projects) * 100)}% of portfolio`}
          icon={CheckCircle}
          color="emerald"
          trend="up"
          trendLabel="Nominal"
        />
        <StatCard
          title="At-Risk Projects"
          value={stats.at_risk_count - stats.critical_count}
          subtitle="Requires close monitoring"
          icon={AlertTriangle}
          color="amber"
          trend="neutral"
          trendLabel="Watchlist"
        />
        <StatCard
          title="Critical Interventions"
          value={stats.critical_count}
          subtitle="Severe delay / cost overrun exposure"
          icon={Flame}
          color="red"
          trend="down"
          trendLabel="Immediate Action"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Portfolio Progress</span>
            <p className="text-xl font-bold text-slate-900">{stats.average_progress}%</p>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.average_progress}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Health Score</span>
            <p className="text-xl font-bold text-emerald-600">{stats.average_health_score} / 100</p>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
            Moderate-Good
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Projects with Delay Lag</span>
            <p className="text-xl font-bold text-orange-600">{stats.projects_with_delay} Projects</p>
          </div>
          <Clock className="text-orange-500 w-6 h-6" />
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Risk Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Risk Tier Distribution
              </h3>
              <p className="text-xs text-slate-500">Portfolio health segmentation</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} Projects`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Planned vs Actual Progress (Top Lagging Projects) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 card-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Schedule Variance: Planned vs. Actual Progress
              </h3>
              <p className="text-xs text-slate-500">Highlighting projects with significant baseline deviation</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Top Critical Assets
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.progress_overview}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(val) => [`${val}%`]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="planned" name="Planned Progress" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Progress" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects Requiring Immediate Attention Table */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame size={18} className="text-red-500" />
              <span>Projects Requiring Immediate Executive Attention</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by composite ML risk score, delay forecast, and contractor performance deficits.
            </p>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
          >
            <span>View All ({stats.total_projects}) Projects</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project Name & Code</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Health Score</th>
                <th className="py-3 px-3">Progress (Act / Pln)</th>
                <th className="py-3 px-3">Delay Exposure</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.projects_requiring_attention?.slice(0, 6).map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="font-bold text-slate-900 hover:text-blue-600 text-left transition block max-w-xs truncate"
                    >
                      {proj.name}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block">
                      {proj.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {proj.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {proj.location}
                  </td>
                  <td className="py-3.5 px-3">
                    <RiskBadge level={proj.risk_level} size="sm" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{proj.health_score}</span>
                      <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span className="text-blue-600">{proj.actual_progress}%</span>
                        <span className="text-slate-400">/ {proj.planned_progress}%</span>
                      </div>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${proj.actual_progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    <span className="text-red-600 font-bold">+{proj.predicted_delay_months} Mo</span>
                    <span className="block text-[10px] text-slate-400 font-normal">({proj.delay_days} days lag)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition border border-blue-200"
                    >
                      Run AI Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Intelligence Analyses Feed */}
      {stats.recent_analyses && stats.recent_analyses.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent AI Intelligence Audit Logs
            </h3>
            <span className="text-xs text-slate-400">Automated Inference History</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.recent_analyses.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectProject(item.project_id)}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</span>
                    <RiskBadge level={item.risk_level} size="sm" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.project_name}</h5>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Confidence: <strong className="text-slate-900">{Math.round(item.confidence * 100)}%</strong></span>
                  <span>Delay: <strong className="text-red-600">+{item.predicted_delay_months}m</strong></span>
                  <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
