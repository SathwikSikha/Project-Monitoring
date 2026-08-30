import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import RiskAnalysis from './pages/RiskAnalysis';
import Alerts from './pages/Alerts';
import About from './pages/About';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  // Periodically fetch unread alert counts
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const alerts = await api.getAlerts({ is_read: false });
        setUnreadAlertsCount(alerts.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('details');
  };

  const handleRunAnalysis = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('analysis');
  };

  const handleBackToProjects = () => {
    setActiveTab('projects');
  };

  const handleBackToDetails = () => {
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar 
        unreadAlertsCount={unreadAlertsCount}
        onNavigateToAlerts={() => setActiveTab('alerts')}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          unreadAlertsCount={unreadAlertsCount}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 min-h-[calc(100vh-65px)]">
          {activeTab === 'dashboard' && (
            <Dashboard
              onSelectProject={handleSelectProject}
              onNavigateToProjects={() => setActiveTab('projects')}
              onNavigateToAnalysis={handleRunAnalysis}
            />
          )}

          {activeTab === 'projects' && (
            <Projects
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'details' && (
            <ProjectDetails
              projectId={selectedProjectId}
              onBack={handleBackToProjects}
              onRunAnalysis={handleRunAnalysis}
            />
          )}

          {activeTab === 'analysis' && (
            <RiskAnalysis
              projectId={selectedProjectId}
              onBack={handleBackToDetails}
              onSelectProject={setSelectedProjectId}
            />
          )}

          {activeTab === 'alerts' && (
            <Alerts
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'about' && (
            <About />
          )}
        </main>
      </div>
    </div>
  );
}
