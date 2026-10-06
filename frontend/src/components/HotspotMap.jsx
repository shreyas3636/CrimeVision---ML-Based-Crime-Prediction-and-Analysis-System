import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Filter } from 'lucide-react';

const RISK_COLORS = { High: '#DC2626', Medium: '#D97706', Low: '#16A34A' };
const RISK_RADII = { High: 10, Medium: 7, Low: 5 };

export default function HotspotMap({ hotspots }) {
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const crimeTypes = [
    'ALL',
    'Snatching & Mobile Theft',
    'Vehicle Theft (Auto-Lifting)',
    'House Trespass & Burglary',
    'Brawl & Group Assault',
    'Cyber & Online Fraud',
    'Highway Robbery & Extortion',
  ];

  const filtered = (hotspots || []).filter(h => {
    const riskOk = filterRisk === 'ALL' || h.risk_level === filterRisk;
    const typeOk = filterType === 'ALL' || h.crime_type === filterType;
    return riskOk && typeOk;
  });

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Filter size={16} color="var(--blue)" />
            Interactive Crime Hotspot Map
          </div>
          <div className="card-subtitle">
            Showing {filtered.length} incidents across Kharar, Punjab — click any marker for details
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Risk Toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: '6px', padding: '3px', gap: '2px' }}>
            {['ALL', 'High', 'Medium', 'Low'].map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: filterRisk === r ? (r === 'High' ? '#DC2626' : r === 'Medium' ? '#D97706' : r === 'Low' ? '#16A34A' : 'var(--white)') : 'transparent',
                  color: filterRisk === r ? (r === 'ALL' ? 'var(--gray-800)' : '#FFFFFF') : 'var(--gray-500)',
                  boxShadow: filterRisk === r ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-control" style={{ width: 'auto', fontSize: '12px' }}>
            {crimeTypes.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Crime Types' : t}</option>)}
          </select>
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '460px', position: 'relative' }}>
        <MapContainer center={[30.745, 76.645]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0 0 12px 12px' }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filtered.map((h, i) => (
            <CircleMarker
              key={h.id || i}
              center={[h.latitude, h.longitude]}
              radius={RISK_RADII[h.risk_level] || 6}
              pathOptions={{
                color: RISK_COLORS[h.risk_level],
                fillColor: RISK_COLORS[h.risk_level],
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ padding: '12px', minWidth: '200px', fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A', flex: 1, paddingRight: '8px' }}>{h.location}</div>
                    <span className={`badge ${h.risk_level.toLowerCase()}`}>{h.risk_level}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.8' }}>
                    <div><strong style={{ color: '#334155' }}>Offense:</strong> {h.crime_type}</div>
                    <div><strong style={{ color: '#334155' }}>Area:</strong> {h.area_type}</div>
                    <div><strong style={{ color: '#334155' }}>Time:</strong> {String(h.hour).padStart(2, '0')}:00 · {h.day_of_week}</div>
                    <div><strong style={{ color: '#334155' }}>Risk Index:</strong> {h.risk_score}%</div>
                  </div>
                  <div style={{ marginTop: '8px', background: '#F1F5F9', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${h.risk_score}%`, height: '100%', background: RISK_COLORS[h.risk_level] }} />
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          background: 'var(--white)',
          border: '1px solid var(--gray-200)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-md)',
          fontSize: '12px',
        }}>
          <div style={{ fontWeight: '700', color: 'var(--gray-600)', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Index</div>
          {[['High', '#DC2626'], ['Medium', '#D97706'], ['Low', '#16A34A']].map(([lvl, color]) => (
            <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block' }} />
              <span style={{ color: 'var(--gray-600)' }}>{lvl} Risk</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
