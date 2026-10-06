import React, { useState, useEffect } from 'react';
import { fetchModelComparison } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Activity, Layers } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => { fetchModelComparison().then(setMetrics); }, []);
  if (!metrics) return null;

  const modelNames = Object.keys(metrics);

  const barData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
    datasets: modelNames.map((name, i) => {
      const colors = ['#2563EB', '#16A34A', '#D97706'];
      const m = metrics[name];
      return {
        label: name,
        data: [m.accuracy, m.precision, m.recall, m.f1_score],
        backgroundColor: colors[i % 3],
        borderRadius: 4,
        barThickness: 28,
      };
    }),
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#475569', font: { family: 'Inter', size: 12, weight: '500' }, boxWidth: 12, boxHeight: 12 } },
      tooltip: { backgroundColor: '#0F172A', borderColor: '#1E293B', borderWidth: 1, titleFont: { size: 12 }, bodyFont: { size: 12 } },
    },
    scales: {
      x: { ticks: { color: '#64748B', font: { size: 12 } }, grid: { display: false } },
      y: { min: 70, max: 100, ticks: { color: '#64748B', font: { size: 11 }, callback: v => v + '%' }, grid: { color: '#F1F5F9' } },
    },
  };

  const METRIC_COLORS = { accuracy: '#2563EB', precision: '#16A34A', recall: '#D97706', f1_score: '#7C3AED' };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Model Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {modelNames.map(name => {
          const m = metrics[name];
          const isPrimary = name === 'Random Forest';
          return (
            <div key={name} className="card" style={{ borderTop: isPrimary ? '3px solid var(--blue)' : '3px solid var(--gray-200)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gray-900)' }}>{name}</h3>
                  {isPrimary && (
                    <span style={{ background: 'var(--blue-muted)', color: 'var(--blue)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Primary
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[['Accuracy', m.accuracy, '#2563EB'], ['Precision', m.precision, '#16A34A'], ['Recall', m.recall, '#D97706'], ['F1-Score', m.f1_score, '#7C3AED']].map(([label, val, color]) => (
                    <div key={label} style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color, fontFamily: 'monospace', letterSpacing: '-0.01em' }}>{val}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Feature Importance row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '16px' }}>
        {/* Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Activity size={16} color="var(--blue)" /> Model Comparison Chart</div>
          </div>
          <div className="card-body">
            <div style={{ height: '280px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Layers size={16} color="var(--blue)" /> Feature Importance</div>
            <div className="card-subtitle">Random Forest (Primary)</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {metrics['Random Forest']?.feature_importances &&
              Object.entries(metrics['Random Forest'].feature_importances)
                .sort((a, b) => b[1] - a[1])
                .map(([feat, val]) => (
                  <div key={feat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--gray-700)', textTransform: 'capitalize' }}>
                        {feat.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'monospace' }}>{val}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(val * 2.5, 100)}%` }} />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
