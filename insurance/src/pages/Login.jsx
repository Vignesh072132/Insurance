import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const highlights = [
  { icon: '⚡', text: 'Instant claim submissions & real-time tracking' },
  { icon: '🔒', text: 'Bank-grade security for all your data' },
  { icon: '📊', text: 'Smart dashboard with visual analytics' },
  { icon: '🤝', text: '24/7 dedicated customer support' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-page">

      {/* Left Panel */}
      <div className="split-left">
        <div className="split-left-inner">
          <div className="split-brand">🛡️ ICMS</div>
          <h2 className="split-headline">Your Insurance,<br />Managed Smarter.</h2>
          <p className="split-subtext">
            One secure platform to manage all your policies, file claims, and stay protected — anytime, anywhere.
          </p>
          <ul className="split-highlights">
            {highlights.map(h => (
              <li key={h.text}>
                <span className="split-hi-icon">{h.icon}</span>
                <span>{h.text}</span>
              </li>
            ))}
          </ul>
          <div className="split-trust">
            <div className="trust-avatars">
              {['👩','👨','👩🏽','👨🏻','👩🏾'].map((a, i) => (
                <span key={i} className="trust-avatar">{a}</span>
              ))}
            </div>
            <span className="trust-text">Trusted by <strong>10,000+</strong> customers</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="split-right">
        <div className="split-form-box">
          <div className="split-form-header">
            <h3>Welcome back</h3>
            <p>Sign in to your account to continue</p>
          </div>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit} className="split-form">
            <div className="split-field">
              <label>Email address</label>
              <div className="split-input-wrap">
                <span className="split-input-icon">✉️</span>
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="split-field">
              <label>Password</label>
              <div className="split-input-wrap">
                <span className="split-input-icon">🔑</span>
                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="split-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="split-submit" disabled={loading}>
              {loading ? <span className="split-spinner" /> : 'Sign In'}
            </button>
          </form>
          <p className="split-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>

    </div>
  );
};

export default Login;
