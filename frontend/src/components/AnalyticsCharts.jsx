import React from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { PieChart, TrendingUp, MapPin } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const CHART_COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

const TOOLTIP_STYLE = {
  backgroundColor: '#0F172A',
  borderColor: '#1E293B',
  borderWidth: 1,
  titleFont: { size: 12, family: 'Inter' },
  bodyFont: { size: 12, family: 'Inter' },
};

export default function AnalyticsCharts({ stats }) {
  if (!stats?.crime_distribution) return null;

  const crimeLabels = Object.keys(stats.crime_distribution);
  const crimeValues = Object.values(stats.crime_distribution);

  const pieData = {
    labels: crimeLabels,
    datasets: [{
      data: crimeValues,
      backgroundColor: CHART_COLORS,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      hoverOffset: 6,
    }],
  };

  const lineData = {
    labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
    datasets: [{
      label: 'Average Crime Risk Index (%)',
      data: [62, 55, 42, 30, 24, 19, 27, 33, 40, 46, 50, 52, 48, 46, 50, 56, 65, 72, 79, 85, 88, 82, 74, 68],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37,99,235,0.07)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#2563EB',
    }],
  };

  const locationBarData = {
    labels: ['Kharar Main Market', 'Greater Mohali Junction', 'Kharar Bus Stand', 'CU Campus Zone', 'Landran Road', 'Gillco Valley'],
    datasets: [{
      label: 'Historical Incident Count',
      data: [1420, 1180, 950, 680, 450, 320],
      backgroundColor: '#EFF6FF',
      borderColor: '#2563EB',
      borderWidth: 2,
      borderRadius: 5,
    }],
  };

  const scaleDefaults = {
    x: { ticks: { color: '#64748B', font: { size: 11 } }, grid: { display: false } },
    y: { ticks: { color: '#64748B', font: { size: 11 } }, grid: { color: '#F1F5F9' } },
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><PieChart size={16} color="var(--blue)" /> Crime Type Distribution</div>
          </div>
          <div className="card-body">
            <div style={{ height: '220px' }}>
              <Doughnut data={pieData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { size: 11, family: 'Inter' }, boxWidth: 10, padding: 10 } }, tooltip: TOOLTIP_STYLE },
                cutout: '62%',
              }} />
            </div>
          </div>
        </div>

        {/* 24-hour Risk Line */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={16} color="var(--blue)" /> 24-Hour Risk Pattern</div>
            <div className="card-subtitle">Kharar zone average crime risk index by hour</div>
          </div>
          <div className="card-body">
            <div style={{ height: '220px' }}>
              <Line data={lineData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: TOOLTIP_STYLE },
                scales: { ...scaleDefaults, y: { ...scaleDefaults.y, min: 0, max: 100, ticks: { ...scaleDefaults.y.ticks, callback: v => v + '%' } } },
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Location Bar */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><MapPin size={16} color="var(--blue)" /> High-Crime Zone Rankings — Kharar, Punjab</div>
          <div className="card-subtitle">Total historical incidents by location</div>
        </div>
        <div className="card-body">
          <div style={{ height: '220px' }}>
            <Bar data={locationBarData} options={{
              responsive: true, maintainAspectRatio: false, indexAxis: 'y',
              plugins: { legend: { display: false }, tooltip: TOOLTIP_STYLE },
              scales: { ...scaleDefaults, x: { ...scaleDefaults.x, grid: { color: '#F1F5F9' } } },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
