import React, { useState, useEffect } from 'react';
import { fetchStats, fetchHotspots } from './services/api';
import DashboardStats from './components/DashboardStats';
import HotspotMap from './components/HotspotMap';
import CrimePredictor from './components/CrimePredictor';
import ModelComparison from './components/ModelComparison';
import AnalyticsCharts from './components/AnalyticsCharts';
import PatrolPlanner from './components/PatrolPlanner';
import CrimeLogTable from './components/CrimeLogTable';
import AiAssistant from './components/AiAssistant';
import { ShieldAlert, Map, Cpu, BarChart3, Radio, Database, Activity, ChevronRight, AlertTriangle, MapPin, Bot, MessageSquare } from 'lucide-react';

const PAGES = [
  { id: 'map', label: 'Hotspot Map', icon: Map },
  { id: 'predict', label: 'Risk Predictor', icon: Cpu },
  { id: 'models', label: 'Model Performance', icon: Activity },
  { id: 'analytics', label: 'Crime Analytics', icon: BarChart3 },
  { id: 'dispatch', label: 'Patrol Dispatch', icon: Radio },
  { id: 'data', label: 'Crime Records', icon: Database },
  { id: 'assistant', label: 'AI Chat Copilot', icon: Bot, highlight: true },
];

const PAGE_TITLES = {
  map: { title: 'Hotspot Analysis Map', desc: 'Geospatial crime distribution across Kharar, Punjab' },
  predict: { title: 'AI Crime Risk Predictor', desc: 'ML inference — enter parameters to compute risk level' },
  models: { title: 'ML Model Benchmarking', desc: 'Random Forest vs XGBoost vs Decision Tree performance' },
  analytics: { title: 'Crime Analytics & Trends', desc: 'Statistical breakdown of crime patterns in Kharar region' },
  dispatch: { title: 'Patrol Dispatch Planner', desc: 'AI-driven resource allocation for Punjab Police PCR units' },
  data: { title: 'Crime Records Database', desc: 'Historical crime log — search, filter and export records' },
  assistant: { title: 'CrimeVision AI Copilot', desc: 'Intelligent decision support and tactical query assistant for Kharar jurisdiction' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats);
    fetchHotspots().then(setHotspots);
  }, []);

  const current = PAGE_TITLES[activeTab] || PAGE_TITLES.map;

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <ShieldAlert size={18} color="#FFFFFF" />
          </div>
          <div className="sidebar-brand-text">
            <h1>CrimeVision</h1>
            <p>AI Crime Analytics</p>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.25)', borderRadius: '6px', padding: '7px 10px' }}>
            <MapPin size={12} color="#93C5FD" />
            <span style={{ fontSize: '11px', color: '#93C5FD', fontWeight: '600' }}>Kharar, Punjab, India</span>
          </div>
        </div>

        <div style={{ padding: '16px 0 0', flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-section-label" style={{ padding: '0 16px', marginBottom: '4px' }}>Main Modules</div>
          <nav className="sidebar-nav">
            {PAGES.map(p => {
              const Icon = p.icon;
              const isActive = activeTab === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={p.highlight ? {
                    color: isActive ? '#FFFFFF' : '#93C5FD',
                    fontWeight: '600'
                  } : {}}
                >
                  <Icon size={15} />
                  <span>{p.label}</span>
                  {p.highlight && (
                    <span style={{
                      background: 'var(--blue)',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      marginLeft: 'auto',
                      fontWeight: '700'
                    }}>
                      AI
                    </span>
                  )}
                  {isActive && !p.highlight && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot"></span>
            <span>ML Engine Active</span>
          </div>
          <div style={{ marginTop: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            Random Forest (Primary)<br/>
            XGBoost · Decision Tree
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="main-content">
        {/* Top Header */}
        <header className="topbar">
          <div className="topbar-left">
            <h2>{current.title}</h2>
            <p>{current.desc}</p>
          </div>
          <div className="topbar-right">
            <span className="topbar-region">
              <MapPin size={11} />
              Kharar, SAS Nagar, Punjab
            </span>
            <button
              onClick={() => setActiveTab('assistant')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeTab === 'assistant' ? 'var(--blue)' : 'var(--white)',
                color: activeTab === 'assistant' ? '#FFFFFF' : 'var(--blue)',
                border: '1px solid var(--blue)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Bot size={13} />
              <span>Ask Copilot</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <div className="page-content">
          {/* Always display key summary indicators */}
          <DashboardStats stats={stats} />

          {activeTab === 'map' && <HotspotMap hotspots={hotspots} />}
          {activeTab === 'predict' && <CrimePredictor />}
          {activeTab === 'models' && <ModelComparison />}
          {activeTab === 'analytics' && <AnalyticsCharts stats={stats} />}
          {activeTab === 'dispatch' && <PatrolPlanner />}
          {activeTab === 'data' && <CrimeLogTable />}
          {activeTab === 'assistant' && <AiAssistant />}

          {/* Footer */}
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
              CrimeVision — AI-Based Crime Prediction & Analysis System · Kharar, Punjab, India
            </span>
            <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
              Punjab Police Tactical Decision Support · Random Forest & XGBoost
            </span>
          </div>
        </div>
      </div>

      {/* Floating Copilot Button (Visible when on other tabs) */}
      {activeTab !== 'assistant' && (
        <button
          onClick={() => setActiveTab('assistant')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            background: 'var(--navy)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '24px',
            padding: '10px 18px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'transform 0.15s ease, background 0.15s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'var(--blue)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--navy)'; }}
        >
          <Bot size={17} color="#60A5FA" />
          <span>Ask AI Copilot</span>
          <span style={{ background: '#22C55E', width: '8px', height: '8px', borderRadius: '50%' }} />
        </button>
      )}
    </div>
  );
}
