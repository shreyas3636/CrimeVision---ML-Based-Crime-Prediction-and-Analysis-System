import React, { useState } from 'react';
import { Radio, Shield, AlertTriangle, CheckCircle, Navigation, Send, Check } from 'lucide-react';

export default function PatrolPlanner() {
  const [dispatched, setDispatched] = useState({});

  const sectors = [
    { id: 'PB-SEC-01', zone: 'Kharar Main Market & Night Hub', risk: 'High', score: '89.4%', officers: 12, cruisers: 4, drones: 2, priority: 'P1 - Immediate' },
    { id: 'PB-SEC-02', zone: 'Greater Mohali Highway Junction', risk: 'High', score: '82.1%', officers: 10, cruisers: 3, drones: 1, priority: 'P1 - Immediate' },
    { id: 'PB-SEC-03', zone: 'Kharar Bus Stand & Market', risk: 'Medium', score: '58.6%', officers: 6, cruisers: 2, drones: 1, priority: 'P2 - Scheduled' },
    { id: 'PB-SEC-04', zone: 'CU Campus & University Zone', risk: 'Medium', score: '54.2%', officers: 5, cruisers: 2, drones: 0, priority: 'P2 - Scheduled' },
    { id: 'PB-SEC-05', zone: 'Gillco Valley & Sector 127', risk: 'Low', score: '24.8%', officers: 2, cruisers: 1, drones: 0, priority: 'P3 - Routine' }
  ];

  const handleDispatch = (id) => {
    setDispatched(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Radio size={16} color="var(--blue)" />
            AI Tactical Patrol Resource Dispatch Planner
          </div>
          <div className="card-subtitle">
            Automated law enforcement unit dispatch recommendations based on ML risk scores (SAS Nagar Police District)
          </div>
        </div>
      </div>

      <div className="card-body" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Sector ID</th>
                <th>Target Zone</th>
                <th>AI Risk Level</th>
                <th>Risk Index</th>
                <th>Recommended Units</th>
                <th>Priority Level</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sec) => (
                <tr key={sec.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--blue)' }}>
                    {sec.id}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                    {sec.zone}
                  </td>
                  <td>
                    <span className={`badge ${sec.risk.toLowerCase()}`}>
                      {sec.risk}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: sec.risk === 'High' ? 'var(--risk-high)' : sec.risk === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                    {sec.score}
                  </td>
                  <td style={{ color: 'var(--gray-700)' }}>
                    <strong>{sec.officers}</strong> Officers · <strong>{sec.cruisers}</strong> PCR Cruisers{sec.drones > 0 ? ` · ${sec.drones} Surveillance Drone` : ''}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: sec.priority.startsWith('P1') ? 'var(--risk-high-bg)' : sec.priority.startsWith('P2') ? 'var(--risk-medium-bg)' : 'var(--gray-100)',
                      color: sec.priority.startsWith('P1') ? 'var(--risk-high)' : sec.priority.startsWith('P2') ? 'var(--risk-medium)' : 'var(--gray-600)',
                      border: `1px solid ${sec.priority.startsWith('P1') ? 'var(--risk-high-border)' : sec.priority.startsWith('P2') ? 'var(--risk-medium-border)' : 'var(--gray-200)'}`
                    }}>
                      {sec.priority}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDispatch(sec.id)}
                      disabled={dispatched[sec.id]}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: dispatched[sec.id] ? 'var(--risk-low-bg)' : 'var(--blue)',
                        color: dispatched[sec.id] ? 'var(--risk-low)' : '#FFFFFF',
                        borderColor: dispatched[sec.id] ? 'var(--risk-low-border)' : 'var(--blue)',
                      }}
                    >
                      {dispatched[sec.id] ? (
                        <>
                          <Check size={13} />
                          Dispatched
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          Dispatch Units
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
