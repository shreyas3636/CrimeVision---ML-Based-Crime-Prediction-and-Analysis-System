import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingUp, Award } from 'lucide-react';

export default function DashboardStats({ stats }) {
  if (!stats) return (
    <div className="stats-grid" style={{ marginBottom: '24px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="stat-card" style={{ minHeight: '90px', background: 'var(--gray-100)', border: 'none', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );

  const cards = [
    {
      label: 'Total Records Analyzed',
      value: stats.total_crimes_analyzed?.toLocaleString() || '5,000',
      desc: 'Kharar crime database',
      icon: ShieldAlert,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE',
    },
    {
      label: 'High-Risk Incidents',
      value: stats.high_risk_zones?.toLocaleString() || '—',
      desc: `${stats.high_risk_zones && stats.total_crimes_analyzed ? Math.round((stats.high_risk_zones / stats.total_crimes_analyzed) * 100) : '—'}% of total records`,
      icon: AlertTriangle,
      iconBg: '#FEF2F2',
      iconColor: '#DC2626',
      borderColor: '#FECACA',
    },
    {
      label: 'Primary Model Accuracy',
      value: `${stats.model_accuracy || 84.1}%`,
      desc: 'Random Forest Classifier',
      icon: Award,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      borderColor: '#BBF7D0',
    },
    {
      label: 'Top Crime Category',
      value: stats.top_crime_category ? stats.top_crime_category.split(' ')[0] + ' ' + (stats.top_crime_category.split(' ')[1] || '') : '—',
      desc: stats.top_crime_category || 'Most frequent offense type',
      icon: TrendingUp,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      borderColor: '#FDE68A',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${c.borderColor}` }}>
            <div className="stat-card-left">
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-desc">{c.desc}</div>
            </div>
            <div className="stat-icon" style={{ background: c.iconBg }}>
              <Icon size={18} color={c.iconColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
