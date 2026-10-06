import React, { useState, useEffect } from 'react';
import { fetchCrimeLog } from '../services/api';
import { Search, Download, Database, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function CrimeLogTable() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    const data = await fetchCrimeLog({
      search,
      risk_level: riskFilter,
      page,
      limit: 15
    });
    setRecords(data.records || []);
    setTotalPages(data.total_pages || 1);
    setTotal(data.total || 0);
  };

  useEffect(() => {
    loadData();
  }, [search, riskFilter, page]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "CrimeVision_Kharar_Historical_Log.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      {/* Header & Controls */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="card-title">
            <Database size={16} color="var(--blue)" />
            Kharar Crime Records Database
          </div>
          <div className="card-subtitle">
            Searchable historical crime records used for ML model training & validation ({total.toLocaleString()} total entries)
          </div>
        </div>

        {/* Filter and Export Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="search-wrapper">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search location, offense..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-control"
              style={{ width: '220px', paddingLeft: '32px', fontSize: '12px' }}
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
            className="form-control"
            style={{ width: 'auto', fontSize: '12px' }}
          >
            <option value="">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <button onClick={exportJSON} className="btn btn-secondary" style={{ fontSize: '12px', padding: '7px 12px' }}>
            <Download size={13} />
            Export Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card-body" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Location (Kharar)</th>
                <th>Area Type</th>
                <th>Crime Classification</th>
                <th>Time & Day</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--blue)' }}>
                      {r.id}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {r.location}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--gray-600)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '4px' }}>
                        {r.area_type}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-800)' }}>
                      {r.crime_type}
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '12px' }}>
                      {String(r.hour).padStart(2, '0')}:00 · {r.day_of_week}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                      {r.risk_score}%
                    </td>
                    <td>
                      <span className={`badge ${r.risk_level?.toLowerCase()}`}>
                        {r.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--gray-500)' }}>
                    No crime records match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total.toLocaleString()} records)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              <ChevronLeft size={13} />
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="btn btn-secondary"
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
