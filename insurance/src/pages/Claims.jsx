import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const STATUS_META = {
  Pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  icon: '⏳', label: 'Under Review'   },
  Approved: { color: '#10b981', bg: 'rgba(16,185,129,0.10)',  icon: '✅', label: 'Claim Approved'  },
  Rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   icon: '❌', label: 'Claim Rejected'  },
};

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const Claims = () => {
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/claims')
      .then(({ data }) => setClaims(data.claims))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const count = (s) => s === 'All' ? claims.length : claims.filter(c => c.status === s).length;
  const totalAmount   = claims.reduce((s, c) => s + (c.claimAmount || 0), 0);
  const approvedAmt   = claims.filter(c => c.status === 'Approved').reduce((s, c) => s + (c.claimAmount || 0), 0);

  const visible = claims.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.claimNumber?.toLowerCase().includes(q) ||
      c.policy?.policyNumber?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="clm-root">

      {/* Hero */}
      <div className="clm-hero">
        <div className="clm-hero-overlay" />
        <div className="clm-hero-content">
          <div className="clm-hero-left">
            <span className="clm-hero-eyebrow">📁 Claims Management</span>
            <h1 className="clm-hero-title">My Claims</h1>
            <p className="clm-hero-sub">Track the status of your submitted claims and stay updated on every decision.</p>
            <Link to="/submit-claim" className="clm-hero-btn">+ Submit New Claim</Link>
          </div>
          <div className="clm-hero-stats">
            <div className="clm-hstat">
              <span className="clm-hstat-val">{claims.length}</span>
              <span className="clm-hstat-lbl">Total Claims</span>
            </div>
            <div className="clm-hstat-divider" />
            <div className="clm-hstat">
              <span className="clm-hstat-val" style={{ color: '#f59e0b' }}>{count('Pending')}</span>
              <span className="clm-hstat-lbl">Pending</span>
            </div>
            <div className="clm-hstat-divider" />
            <div className="clm-hstat">
              <span className="clm-hstat-val" style={{ color: '#10b981' }}>{count('Approved')}</span>
              <span className="clm-hstat-lbl">Approved</span>
            </div>
            <div className="clm-hstat-divider" />
            <div className="clm-hstat">
              <span className="clm-hstat-val" style={{ color: '#ef4444' }}>{count('Rejected')}</span>
              <span className="clm-hstat-lbl">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amount summary bar */}
      <div className="clm-summary">
        <div className="clm-summary-item">
          <span className="clm-summary-lbl">Total Claimed</span>
          <span className="clm-summary-val">${totalAmount.toLocaleString()}</span>
        </div>
        <div className="clm-summary-sep" />
        <div className="clm-summary-item">
          <span className="clm-summary-lbl">Total Approved</span>
          <span className="clm-summary-val" style={{ color: '#10b981' }}>${approvedAmt.toLocaleString()}</span>
        </div>
        <div className="clm-summary-sep" />
        <div className="clm-summary-item">
          <span className="clm-summary-lbl">Approval Rate</span>
          <span className="clm-summary-val" style={{ color: '#667eea' }}>
            {claims.length ? Math.round((count('Approved') / claims.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="clm-body">

        {/* Toolbar */}
        <div className="clm-toolbar">
          <div className="clm-search-wrap">
            <span className="clm-search-icon">🔍</span>
            <input className="clm-search" placeholder="Search by claim number, policy or description…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="clm-filters">
            {FILTERS.map(f => (
              <button key={f}
                className={`clm-filter-btn ${filter === f ? 'clm-filter-active' : ''}`}
                style={filter === f && f !== 'All' ? { background: STATUS_META[f]?.color, borderColor: 'transparent', color: 'white' } : {}}
                onClick={() => setFilter(f)}>
                {f} <span className="clm-filter-count">{count(f)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="clm-loading"><div className="clm-spinner" /><p>Loading your claims…</p></div>
        ) : visible.length === 0 ? (
          <div className="clm-empty">
            <span>📭</span>
            <p>No {filter !== 'All' ? filter.toLowerCase() : ''} claims found.</p>
            <Link to="/submit-claim" className="clm-hero-btn" style={{ marginTop: '1rem' }}>Submit your first claim</Link>
          </div>
        ) : (
          <div className="clm-grid">
            {visible.map((claim, idx) => {
              const meta = STATUS_META[claim.status] || STATUS_META.Pending;
              return (
                <div key={claim._id} className="clm-card" style={{ animationDelay: `${idx * 0.05}s` }}>

                  {/* Card header */}
                  <div className="clm-card-header" style={{ background: meta.bg }}>
                    <div className="clm-card-icon" style={{ background: meta.color }}>{meta.icon}</div>
                    <div className="clm-card-header-info">
                      <p className="clm-card-num">{claim.claimNumber}</p>
                      <p className="clm-card-policy">Policy: {claim.policy?.policyNumber || '—'}</p>
                    </div>
                    <div className="clm-card-status-pill" style={{ background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="clm-card-body">
                    <p className="clm-card-desc">{claim.description}</p>

                    <div className="clm-card-divider" />

                    <div className="clm-card-row">
                      <span className="clm-card-lbl">Claim Amount</span>
                      <span className="clm-card-amount" style={{ color: meta.color }}>
                        ${claim.claimAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="clm-card-row">
                      <span className="clm-card-lbl">Submitted</span>
                      <span className="clm-card-val">
                        {new Date(claim.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Status-specific info */}
                    {claim.status === 'Approved' && claim.approvedAt && (
                      <div className="clm-card-row">
                        <span className="clm-card-lbl">Approved On</span>
                        <span className="clm-card-val" style={{ color: '#10b981' }}>
                          {new Date(claim.approvedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {claim.status === 'Rejected' && claim.rejectionReason && (
                      <div className="clm-card-note clm-note-rejected">
                        <span className="clm-note-icon">⚠️</span>
                        <span>{claim.rejectionReason}</span>
                      </div>
                    )}

                    {claim.notes && (
                      <div className="clm-card-note clm-note-info">
                        <span className="clm-note-icon">💬</span>
                        <span>{claim.notes}</span>
                      </div>
                    )}

                    {/* Timeline indicator */}
                    <div className="clm-timeline">
                      {['Submitted', 'Under Review', 'Decision'].map((step, i) => {
                        const done = claim.status === 'Approved' ? i <= 2
                          : claim.status === 'Rejected' ? i <= 2
                          : i <= 1;
                        return (
                          <div key={step} className="clm-timeline-step">
                            <div className={`clm-tl-dot ${done ? 'clm-tl-done' : ''}`}
                              style={done ? { background: meta.color, boxShadow: `0 0 0 3px ${meta.bg}` } : {}} />
                            {i < 2 && <div className={`clm-tl-line ${done && i < 1 ? 'clm-tl-line-done' : ''}`}
                              style={done && i < 1 ? { background: meta.color } : {}} />}
                            <span className="clm-tl-label">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;
