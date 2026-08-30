import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Building2, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  RefreshCw,
  Eye
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { api } from '../services/api';

export default function Projects({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('risk');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const categories = [
    'All', 'Highway', 'Railway', 'Metro', 'Bridge', 'Airport', 
    'Irrigation', 'Water Supply', 'Power Infrastructure', 'Urban Development'
  ];

  const riskLevels = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects({
        category: selectedCategory,
        risk_level: selectedRisk,
        search: search,
        sort_by: sortBy,
        order: sortOrder
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedRisk, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Infrastructure Projects Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, filter, and inspect detailed parameters of all {projects.length} monitored national projects.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid size={16} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, code, state, or contractor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal size={14} className="text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="risk">Sort: Risk Severity</option>
              <option value="health">Sort: Health Score</option>
              <option value="progress">Sort: Progress %</option>
              <option value="cost">Sort: Project Cost</option>
              <option value="delay">Sort: Delay Months</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Toggle Sort Order"
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>

        {/* Risk Level Pills & Category Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1">Risk:</span>
            {riskLevels.map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedRisk === risk
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Sector:</span>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content View: Table or Grid */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 card-shadow space-y-2">
          <Building2 size={32} className="mx-auto text-slate-400" />
          <p className="text-base font-bold text-slate-700">No matching projects found</p>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or risk filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Project Name & Code</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Location</th>
                  <th className="py-3.5 px-3">Budget (₹ Cr)</th>
                  <th className="py-3.5 px-3">Progress</th>
                  <th className="py-3.5 px-3">Health Score</th>
                  <th className="py-3.5 px-3">Risk Tier</th>
                  <th className="py-3.5 px-3">Forecast Delay</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-left transition block max-w-xs truncate"
                      >
                        {proj.name}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono font-medium block">
                        {proj.code} • {proj.contractor_name}
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
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      ₹{proj.project_cost.toLocaleString('en-IN')} Cr
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                          <span className="text-blue-600">{proj.actual_progress}%</span>
                          <span className="text-slate-400">/ {proj.planned_progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${proj.actual_progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      <span className={`${proj.health_score < 50 ? 'text-red-600' : proj.health_score < 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {proj.health_score}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <RiskBadge level={proj.risk_level} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {proj.predicted_delay_months > 0 ? (
                        <span className="text-red-600 font-bold">+{proj.predicted_delay_months} Mo</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">On Schedule</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition border border-blue-200 flex items-center gap-1 ml-auto"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="bg-white rounded-xl p-5 border border-slate-200 card-shadow card-hover cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {proj.category}
                  </span>
                  <RiskBadge level={proj.risk_level} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition leading-snug line-clamp-2">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {proj.location} • {proj.executing_agency}
                </p>
              </div>

              {/* Progress & Financials */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Physical Progress:</span>
                  <span className="font-bold text-slate-900">{proj.actual_progress}% <span className="text-slate-400 font-normal">/ {proj.planned_progress}%</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${proj.actual_progress}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget</span>
                    <span className="font-bold text-slate-900">₹{proj.project_cost} Cr</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Health Score</span>
                    <span className="font-bold text-emerald-600">{proj.health_score}/100</span>
                  </div>
                </div>
              </div>

              {/* Footer Forecast & CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Forecast Delay</span>
                  <span className="font-bold text-red-600">+{proj.predicted_delay_months} Months</span>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition">
                  Run AI Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
