import React, { useState } from 'react';
import { predictCrimeRisk } from '../services/api';
import { Cpu, Loader, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

const LOCATIONS = [
  'Kharar Bus Stand & Market', 'CU Campus & Student Zone', 'Landran Road Commercial Belt',
  'Greater Mohali Highway Junction', 'Kharar-Ropar Flyover Corridor', 'Model Town Kharar',
  'Gillco Valley & Sector 127', 'Swaraj Nagar & Old City', 'Kharar Industrial Focal Point',
  'Kharar Main Market & Night Hub',
];
const AREA_TYPES = ['Commercial', 'Transit Hub', 'Residential', 'Industrial', 'Nightlife'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RISK_CONFIG = {
  High:   { color: 'var(--risk-high)',   bg: 'var(--risk-high-bg)',   border: 'var(--risk-high-border)',   icon: AlertTriangle },
  Medium: { color: 'var(--risk-medium)', bg: 'var(--risk-medium-bg)', border: 'var(--risk-medium-border)', icon: Shield },
  Low:    { color: 'var(--risk-low)',    bg: 'var(--risk-low-bg)',    border: 'var(--risk-low-border)',    icon: CheckCircle },
};

export default function CrimePredictor() {
  const [form, setForm] = useState({
    location: 'Kharar Bus Stand & Market',
    area_type: 'Commercial',
    hour: 22,
    day_of_week: 'Saturday',
    population_density: 18500,
    previous_crime_records: 35,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = await predictCrimeRisk(form);
    setResult(data);
    setLoading(false);
  };

  const risk = result ? RISK_CONFIG[result.primary_risk_level] : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', marginBottom: '24px' }}>

      {/* Input Panel */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Cpu size={16} color="var(--blue)" /> Input Parameters</div>
            <div className="card-subtitle">Configure zone and temporal factors</div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div className="form-group">
              <label className="form-label">Target Location</label>
              <select name="location" value={form.location} onChange={handleChange} className="form-control">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Area Type</label>
                <select name="area_type" value={form.area_type} onChange={handleChange} className="form-control">
                  {AREA_TYPES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Day of Week</label>
                <select name="day_of_week" value={form.day_of_week} onChange={handleChange} className="form-control">
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Time of Day</label>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'monospace' }}>
                  {String(form.hour).padStart(2, '0')}:00 {form.hour >= 20 || form.hour <= 4 ? '· Night Peak' : ''}
                </span>
              </div>
              <input type="range" name="hour" min="0" max="23" value={form.hour} onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--gray-400)', marginTop: '2px' }}>
                <span>00:00</span><span>12:00</span><span>23:00</span>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Population Density</label>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-700)', fontFamily: 'monospace' }}>
                  {parseInt(form.population_density).toLocaleString()}/km²
                </span>
              </div>
              <input type="range" name="population_density" min="1000" max="25000" step="500" value={form.population_density} onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }} />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Past Crimes (30 Days)</label>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-700)', fontFamily: 'monospace' }}>
                  {form.previous_crime_records} incidents
                </span>
              </div>
              <input type="range" name="previous_crime_records" min="0" max="60" value={form.previous_crime_records} onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '10px 16px' }}>
              {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Computing Prediction...</> : <><Cpu size={15} /> Run AI Prediction</>}
            </button>
          </form>
        </div>
      </div>

      {/* Results Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {result && risk ? (
          <>
            {/* Primary Risk Result */}
            <div className="card">
              <div className="card-body" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      AI Predicted Risk Level
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${result.primary_risk_level.toLowerCase()}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                        {result.primary_risk_level} Risk
                      </span>
                      <span style={{ fontSize: '32px', fontWeight: '800', color: risk.color, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                        {result.risk_score}%
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px' }}>
                      Predicted Offense: <strong style={{ color: 'var(--gray-900)' }}>{result.primary_crime_type}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>Risk Score Gauge</div>
                    <div style={{ width: '160px', background: 'var(--gray-100)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.risk_score}%`, height: '100%', background: risk.color, borderRadius: '5px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Comparison */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Multi-Model Prediction Consensus</div>
              </div>
              <div className="card-body" style={{ padding: '0' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Predicted Risk</th>
                      <th>Predicted Offense</th>
                      <th>High %</th>
                      <th>Medium %</th>
                      <th>Low %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.model_predictions || {}).map(([name, m]) => (
                      <tr key={name}>
                        <td style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{name}</td>
                        <td><span className={`badge ${m.predicted_risk_level?.toLowerCase()}`}>{m.predicted_risk_level}</span></td>
                        <td style={{ color: 'var(--gray-600)' }}>{m.predicted_crime_type}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--risk-high)', fontWeight: '600' }}>{(m.risk_probabilities?.High || 0).toFixed(1)}%</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--risk-medium)', fontWeight: '600' }}>{(m.risk_probabilities?.Medium || 0).toFixed(1)}%</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--risk-low)', fontWeight: '600' }}>{(m.risk_probabilities?.Low || 0).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Punjab Police Tactical Recommendations</div>
              </div>
              <div className="card-body">
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(result.recommendations || []).map((r, i) => (
                    <li key={i} style={{ fontSize: '13px', color: 'var(--gray-700)', lineHeight: '1.6' }}>{r}</li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
            <div style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
              <Cpu size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Configure parameters and run the AI predictor</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Results will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
