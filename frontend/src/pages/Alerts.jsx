import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Flame, 
  AlertTriangle, 
  Eye, 
  CheckCheck, 
  Filter, 
  RefreshCw, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function Alerts({ onSelectProject }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts({
        severity: severityFilter !== 'ALL' ? severityFilter : undefined
      });
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter]);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.markAlertRead(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllAlertsRead();
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const severityConfigs = {
    CRITICAL: {
      border: 'border-l-red-500 bg-red-50/40 hover:bg-red-50/70',
      badge: 'bg-red-100 text-red-800 border-red-200',
      icon: Flame,
      iconColor: 'text-red-500'
    },
    WARNING: {
      border: 'border-l-orange-500 bg-orange-50/40 hover:bg-orange-50/70',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-500'
    },
    WATCH: {
      border: 'border-l-amber-500 bg-amber-50/40 hover:bg-amber-50/70',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Eye,
      iconColor: 'text-amber-500'
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Early-Warning Alert Management Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 uppercase">
              Proactive Triaging
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Automated notifications flagging schedule slippage, contractor deficits, and budget overruns before escalation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <CheckCheck size={14} className="text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              severityFilter === sev
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sev === 'ALL' ? 'All Alerts' : `${sev} Priority`}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 card-shadow space-y-2">
          <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
          <p className="text-base font-bold text-slate-700">No active alerts in this category</p>
          <p className="text-xs text-slate-500">All monitored projects are operating within expected thresholds.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = severityConfigs[alert.severity] || severityConfigs.WATCH;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                onClick={() => alert.project_id && onSelectProject(alert.project_id)}
                className={`bg-white rounded-xl p-5 border border-slate-200 border-l-4 ${config.border} card-shadow card-hover cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
                  alert.is_read ? 'opacity-70 bg-slate-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-sm`}>
                    <Icon size={18} className={config.iconColor} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${config.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {alert.category}
                      </span>
                      {alert.project_name && (
                        <span className="text-xs font-bold text-blue-700">
                          • {alert.project_name}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-0.5">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <Clock size={12} />
                      <span>{new Date(alert.created_at).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={(e) => alert.project_id && onSelectProject(alert.project_id)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-bold transition border border-blue-200"
                  >
                    Inspect Project
                  </button>

                  {!alert.is_read && (
                    <button
                      onClick={(e) => handleMarkRead(alert.id, e)}
                      className="text-[11px] text-slate-500 hover:text-slate-900 underline font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
