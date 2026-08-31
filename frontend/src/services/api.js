/**
 * PAIMANA Frontend API Service
 * Centralized API client communicating with FastAPI backend
 *
 * In development: uses Vite's proxy (VITE_API_URL is undefined → '/api')
 * In production:  VITE_API_URL must be set to the Render backend root URL,
 *                 e.g. https://paimana-backend.onrender.com
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const api = {
  // Dashboard Analytics
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  // Projects API
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.risk_level && params.risk_level !== 'ALL') query.append('risk_level', params.risk_level);
    if (params.search) query.append('search', params.search);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);

    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects list');
    return res.json();
  },

  async getProjectById(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch project #${id}`);
    return res.json();
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error(`Failed to update project #${id}`);
    return res.json();
  },

  // Prediction & Risk Analysis
  async runProjectAnalysis(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/analysis`);
    if (!res.ok) throw new Error(`Failed to analyze project #${projectId}`);
    return res.json();
  },

  async predictCustomRisk(payload) {
    const res = await fetch(`${API_BASE}/predict-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate risk prediction');
    return res.json();
  },

  // Alerts API
  async getAlerts(params = {}) {
    const query = new URLSearchParams();
    if (params.severity && params.severity !== 'ALL') query.append('severity', params.severity);
    if (params.is_read !== undefined) query.append('is_read', params.is_read);

    const res = await fetch(`${API_BASE}/alerts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async markAlertRead(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/read`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error(`Failed to mark alert #${alertId} as read`);
    return res.json();
  },

  async markAllAlertsRead() {
    const res = await fetch(`${API_BASE}/alerts/mark-all-read`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to mark all alerts as read');
    return res.json();
  }
};
