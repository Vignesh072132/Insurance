import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const TYPE_ICONS = {
  Health: '🏥', Vehicle: '🚗', Home: '🏠', Travel: '✈️',
  Business: '💼', Life: '❤️', Property: '🏢', Pet: '🐾',
  Dental: '🦷', Vision: '👁️',
};

const TYPE_COLORS = {
  Health:   { color: '#667eea', bg: 'rgba(102,126,234,0.10)' },
  Vehicle:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
  Home:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
  Travel:   { color: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
  Business: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)'  },
  Life:     { color: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
  Property: { color: '#14b8a6', bg: 'rgba(20,184,166,0.10)'  },
  Pet:      { color: '#f97316', bg: 'rgba(249,115,22,0.10)'  },
  Dental:   { color: '#ec4899', bg: 'rgba(236,72,153,0.10)'  },
  Vision:   { color: '#6366f1', bg: 'rgba(99,102,241,0.10)'  },
};

const daysLeft = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');

  useEffect(() => {
    api.get('/policies')
      .then(({ data }) => setPolicies(data.policies))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types    = ['All', ...new Set(policies.map(p => p.policyType))];
  const active   = policies.filter(p => daysLeft(p.expiryDate) > 0).length;
  const expired  = policies.length - active;
  const expiring = policies.filter(p => { const d = daysLeft(p.expiryDate); return d > 0 && d <= 30; }).length;

  const visible = policies.filter(p => {
    const matchType   = filter === 'All' || p.policyType === filter;
    const matchSearch = p.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
                        p.policyType.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="pol-root">

      {/* Hero */}
      <div className="pol-hero">
        <div className="pol-hero-overlay" />
        <div className="pol-hero-content">
          <div className="pol-hero-left">
            <span className="pol-hero-eyebrow">📋 Insurance Portfolio</span>
            <h1 className="pol-hero-title">My Policies</h1>
            <p className="pol-hero-sub">Manage and track all your active insurance coverage in one place.</p>
            <Link to="/create-policy" className="pol-hero-btn">+ Add New Policy</Link>
          </div>
          <div className="pol-hero-stats">
            <div className="pol-hstat">
              <span className="pol-hstat-val">{policies.length}</span>
              <span className="pol-hstat-lbl">Total</span>
            </div>
            <div className="pol-hstat-divider" />
            <div className="pol-hstat">
              <span className="pol-hstat-val" style={{ color: '#10b981' }}>{active}</span>
              <span className="pol-hstat-lbl">Active</span>
            </div>
            <div className="pol-hstat-divider" />
            <div className="pol-hstat">
              <span className="pol-hstat-val" style={{ color: '#f59e0b' }}>{expiring}</span>
              <span className="pol-hstat-lbl">Expiring Soon</span>
            </div>
            <div className="pol-hstat-divider" />
            <div className="pol-hstat">
              <span className="pol-hstat-val" style={{ color: '#ef4444' }}>{expired}</span>
              <span className="pol-hstat-lbl">Expired</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="pol-body">
        <div className="pol-toolbar">
          <div className="pol-search-wrap">
            <span className="pol-search-icon">🔍</span>
            <input
              className="pol-search"
              placeholder="Search by policy number or type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="pol-filters">
            {types.map(t => (
              <button key={t}
                className={`pol-filter-btn ${filter === t ? 'pol-filter-active' : ''}`}
                onClick={() => setFilter(t)}>
                {t !== 'All' && TYPE_ICONS[t] ? `${TYPE_ICONS[t]} ` : ''}{t}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="pol-loading">
            <div className="pol-spinner" />
            <p>Loading your policies…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="pol-empty">
            <span>📭</span>
            <p>No policies found.</p>
            <Link to="/create-policy" className="pol-hero-btn" style={{ marginTop: '1rem' }}>Create your first policy</Link>
          </div>
        ) : (
          <div className="pol-grid">
            {visible.map(policy => {
              const days    = daysLeft(policy.expiryDate);
              const isActive = days > 0;
              const isSoon   = isActive && days <= 30;
              const meta     = TYPE_COLORS[policy.policyType] || { color: '#667eea', bg: 'rgba(102,126,234,0.10)' };
              const icon     = TYPE_ICONS[policy.policyType] || '📄';
              return (
                <div key={policy._id} className="pol-card">
                  <div className="pol-card-top" style={{ background: meta.bg }}>
                    <div className="pol-card-icon" style={{ background: meta.color }}>{icon}</div>
                    <div className={`pol-card-status ${
                      isSoon ? 'pol-status-warn' : isActive ? 'pol-status-active' : 'pol-status-expired'
                    }`}>
                      {isSoon ? '⚠️ Expiring Soon' : isActive ? '✅ Active' : '❌ Expired'}
                    </div>
                  </div>
                  <div className="pol-card-body">
                    <p className="pol-card-type" style={{ color: meta.color }}>{policy.policyType} Insurance</p>
                    <p className="pol-card-num">{policy.policyNumber}</p>
                    <div className="pol-card-divider" />
                    <div className="pol-card-row">
                      <span className="pol-card-lbl">Coverage</span>
                      <span className="pol-card-val">${policy.coverageAmount.toLocaleString()}</span>
                    </div>
                    <div className="pol-card-row">
                      <span className="pol-card-lbl">Premium</span>
                      <span className="pol-card-val">${(policy.premium || 0).toLocaleString()}/yr</span>
                    </div>
                    <div className="pol-card-row">
                      <span className="pol-card-lbl">Expires</span>
                      <span className="pol-card-val" style={{ color: isSoon ? '#f59e0b' : !isActive ? '#ef4444' : 'inherit' }}>
                        {new Date(policy.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {isActive && (
                      <div className="pol-card-progress-wrap">
                        <div className="pol-card-progress-bar">
                          <div className="pol-card-progress-fill" style={{
                            width: `${Math.min(100, Math.max(0, 100 - (days / 365) * 100))}%`,
                            background: isSoon ? '#f59e0b' : meta.color
                          }} />
                        </div>
                        <span className="pol-card-days" style={{ color: isSoon ? '#f59e0b' : meta.color }}>
                          {days}d left
                        </span>
                      </div>
                    )}
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

export default Policies;
