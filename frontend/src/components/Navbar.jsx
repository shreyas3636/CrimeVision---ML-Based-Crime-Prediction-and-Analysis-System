import React from 'react';
import { ShieldAlert, Map, Cpu, BarChart3, Radio, Database, Activity, ChevronRight, AlertTriangle, MapPin } from 'lucide-react';

const PAGES = [
  { id: 'map', label: 'Hotspot Map', icon: Map },
  { id: 'predict', label: 'Risk Predictor', icon: Cpu },
  { id: 'models', label: 'Model Performance', icon: Activity },
  { id: 'analytics', label: 'Crime Analytics', icon: BarChart3 },
  { id: 'dispatch', label: 'Patrol Dispatch', icon: Radio },
  { id: 'data', label: 'Crime Records', icon: Database },
];

const PAGE_TITLES = {
  map: { title: 'Hotspot Analysis Map', desc: 'Geospatial crime distribution across Kharar, Punjab' },
  predict: { title: 'AI Crime Risk Predictor', desc: 'Machine learning inference — enter parameters to compute risk level' },
  models: { title: 'ML Model Benchmarking', desc: 'Performance comparison: Random Forest vs XGBoost vs Decision Tree' },
  analytics: { title: 'Crime Analytics & Trends', desc: 'Statistical breakdown of crime patterns in Kharar region' },
  dispatch: { title: 'Patrol Dispatch Planner', desc: 'AI-driven resource allocation for Punjab Police PCR units' },
  data: { title: 'Crime Records Database', desc: 'Historical crime log — search, filter and export records' },
};

export default function Navbar({ activeTab, setActiveTab }) {
  const current = PAGE_TITLES[activeTab];

  return (
    <>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <ShieldAlert size={18} color="#FFFFFF" />
          </div>
          <div className="sidebar-brand-text">
            <h1>CrimeVision</h1>
            <p>Punjab Police Sector</p>
          </div>
        </div>

        {/* Region Tag */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', borderRadius: '6px', padding: '6px 10px' }}>
            <MapPin size={12} color="#93C5FD" />
            <span style={{ fontSize: '11px', color: '#93C5FD', fontWeight: '600' }}>Kharar, Punjab, India</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 0 0', flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-section-label" style={{ padding: '0 18px', marginBottom: '6px' }}>Navigation</div>
          <nav className="sidebar-nav">
            {PAGES.map(p => {
              const Icon = p.icon;
              const isActive = activeTab === p.id;
              return (
                <button key={p.id} onClick={() => setActiveTab(p.id)} className={`nav-item ${isActive ? 'active' : ''}`}>
                  <Icon size={15} />
                  <span>{p.label}</span>
                  {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot"></span>
            <span>ML Engine Online</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            RF · XGBoost · Decision Tree
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h2>{current.title}</h2>
            <p>{current.desc}</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-region">
              <MapPin size={11} />
              Kharar, Punjab
            </div>
            <div className="topbar-badge">
              <AlertTriangle size={11} />
              3 Active High-Risk Zones
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
