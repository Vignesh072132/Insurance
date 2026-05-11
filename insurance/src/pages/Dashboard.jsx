import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

// --- Donut Chart ---
const DonutChart = ({ data }) => {
  const colors = ['#667eea','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1'];
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <p className="chart-empty">No policy data yet</p>;
  let offset = 0;
  const r = 70, cx = 90, cy = 90, stroke = 26;
  const circ = 2 * Math.PI * r;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const el = <circle key={d.label} cx={cx} cy={cy} r={r} fill="none"
      stroke={colors[i % colors.length]} strokeWidth={stroke}
      strokeDasharray={`${dash} ${circ - dash}`}
      strokeDashoffset={-offset * circ}
      style={{ transition: 'stroke-dasharray 0.8s ease' }} />;
    offset += pct;
    return el;
  });
  return (
    <div className="chart-donut-wrap">
      <div className="donut-svg-wrap">
        <svg viewBox="0 0 180 180" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {slices}
        </svg>
        <div className="donut-center">
          <span className="donut-total">{total}</span>
          <span className="donut-label">Total</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((d, i) => (
          <div key={d.label} className="legend-item">
            <span className="legend-dot" style={{ background: colors[i % colors.length] }} />
            <span className="legend-text">{d.label}</span>
            <span className="legend-val">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Bar Chart ---
const BarChart = ({ data }) => {
  const meta = { Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }, Approved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' }, Rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' } };
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="chart-bar-wrap">
      {data.map(d => {
        const m = meta[d.label] || { color: '#667eea', bg: 'rgba(102,126,234,0.12)' };
        return (
          <div key={d.label} className="bar-group">
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${(d.value / max) * 130}px`, background: `linear-gradient(to top, ${m.color}, ${m.color}cc)`, boxShadow: `0 4px 14px ${m.color}55` }} />
            </div>
            <span className="bar-value" style={{ color: m.color }}>{d.value}</span>
            <div className="bar-badge" style={{ background: m.bg, color: m.color }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- Line Chart ---
const LineChart = ({ data }) => {
  if (!data.length) return <p className="chart-empty">No data yet</p>;
  const W = 340, H = 150, pad = 32;
  const max = Math.max(...data.map(d => d.value), 1);
  const xStep = (W - pad * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => ({ x: pad + i * xStep, y: H - pad - (d.value / max) * (H - pad * 2) }));
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${H - pad} ` + line + ` ${pts[pts.length-1].x},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25,0.5,0.75,1].map(t => (
        <line key={t} x1={pad} y1={H - pad - t*(H-pad*2)} x2={W-pad} y2={H - pad - t*(H-pad*2)}
          stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <polygon points={area} fill="url(#lg)" />
      <polyline points={line} fill="none" stroke="#667eea" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#667eea" strokeWidth="2.5" />
          <text x={p.x} y={H - 10} textAnchor="middle" fontSize="9" fill="#94a3b8">{data[i].label}</text>
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#667eea">{data[i].value}</text>
        </g>
      ))}
    </svg>
  );
};

const now = new Date();
const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ policies: 0, claims: 0, pending: 0, approved: 0 });
  const [policyTypes, setPolicyTypes] = useState([]);
  const [claimStatus, setClaimStatus] = useState([]);
  const [policiesByMonth, setPoliciesByMonth] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [polRes, clmRes] = await Promise.all([api.get('/policies'), api.get('/claims')]);
        const policies = polRes.data.policies || [];
        const claims = clmRes.data.claims || [];
        const pending  = claims.filter(c => c.status === 'Pending').length;
        const approved = claims.filter(c => c.status === 'Approved').length;
        setStats({ policies: polRes.data.count, claims: clmRes.data.count, pending, approved });

        const typeMap = {};
        policies.forEach(p => { typeMap[p.policyType] = (typeMap[p.policyType] || 0) + 1; });
        setPolicyTypes(Object.entries(typeMap).map(([label, value]) => ({ label, value })));

        const statusMap = { Pending: 0, Approved: 0, Rejected: 0 };
        claims.forEach(c => { if (c.status in statusMap) statusMap[c.status]++; });
        setClaimStatus(Object.entries(statusMap).map(([label, value]) => ({ label, value })));

        const monthMap = {};
        policies.forEach(p => {
          const d = new Date(p.createdAt || p.startDate);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          monthMap[key] = (monthMap[key] || 0) + 1;
        });
        const sorted = Object.entries(monthMap).sort(([a],[b]) => a.localeCompare(b)).slice(-6);
        setPoliciesByMonth(sorted.map(([k,v]) => ({ label: k.slice(5), value: v })));
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Policies', value: stats.policies, icon: '📋', color: '#667eea', bg: 'rgba(102,126,234,0.12)', link: '/policies', trend: 'View all policies' },
    { label: 'Total Claims',   value: stats.claims,   icon: '📁', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  link: '/claims',   trend: 'View all claims' },
    { label: 'Pending Review', value: stats.pending,  icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', link: '/claims',   trend: 'Needs attention' },
    { label: 'Approved Claims',value: stats.approved, icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.12)', link: '/claims',   trend: 'Successfully resolved' },
  ];

  return (
    <div className="db-root">

      {/* ── Hero Banner ── */}
      <div className="db-hero">
        <div className="db-hero-overlay" />
        <div className="db-hero-content">
          <div className="db-hero-left">
            <p className="db-greeting">{greeting} 👋</p>
            <h1 className="db-hero-title">{user?.name}</h1>
            <p className="db-hero-sub">Here's what's happening with your insurance portfolio today.</p>
            <div className="db-hero-actions">
              <Link to="/create-policy" className="db-btn-primary">+ New Policy</Link>
              <Link to="/submit-claim" className="db-btn-ghost">Submit Claim</Link>
            </div>
          </div>
          <div className="db-hero-right">
            <div className="db-hero-badge">
              <span className="db-badge-icon">🛡️</span>
              <div>
                <p className="db-badge-title">Coverage Active</p>
                <p className="db-badge-sub">{stats.policies} active {stats.policies === 1 ? 'policy' : 'policies'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="db-body">
        <div className="db-stats">
          {statCards.map(s => (
            <Link to={s.link} key={s.label} className="db-stat-card" style={{ '--card-color': s.color, '--card-bg': s.bg }}>
              <div className="db-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="db-stat-info">
                <span className="db-stat-value">{s.value}</span>
                <span className="db-stat-label">{s.label}</span>
              </div>
              <span className="db-stat-trend">{s.trend} →</span>
            </Link>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="db-charts">

          <div className="db-chart-card db-chart-wide">
            <div className="db-chart-header">
              <div>
                <h3>Policy Growth</h3>
                <p>New policies created over the last 6 months</p>
              </div>
              <span className="db-chart-badge db-badge-blue">Monthly</span>
            </div>
            <LineChart data={policiesByMonth} />
          </div>

          <div className="db-chart-card">
            <div className="db-chart-header">
              <div>
                <h3>Claims Overview</h3>
                <p>Breakdown by current status</p>
              </div>
              <span className="db-chart-badge db-badge-amber">Live</span>
            </div>
            <BarChart data={claimStatus} />
          </div>

          <div className="db-chart-card">
            <div className="db-chart-header">
              <div>
                <h3>Policy Mix</h3>
                <p>Distribution across policy types</p>
              </div>
              <span className="db-chart-badge db-badge-purple">All Time</span>
            </div>
            <DonutChart data={policyTypes} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
