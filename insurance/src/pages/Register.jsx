import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const highlights = [
  { icon: '📋', text: 'Manage all your policies in one place' },
  { icon: '⚡', text: 'Fast & hassle-free claim submissions' },
  { icon: '🛡️', text: 'Comprehensive coverage for every need' },
  { icon: '💰', text: 'Transparent premiums with no hidden fees' },
];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h2 className="split-headline">Protection for<br />Every Moment.</h2>
          <p className="split-subtext">
            Join thousands of customers who trust ICMS to safeguard their health, vehicles, homes, and businesses.
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
            <h3>Create your account</h3>
            <p>Start managing your insurance today</p>
          </div>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit} className="split-form">
            <div className="split-field">
              <label>Full Name</label>
              <div className="split-input-wrap">
                <span className="split-input-icon">👤</span>
                <input type="text" placeholder="John Doe" value={formData.name} onChange={set('name')} required />
              </div>
            </div>
            <div className="split-field">
              <label>Email address</label>
              <div className="split-input-wrap">
                <span className="split-input-icon">✉️</span>
                <input type="email" placeholder="you@example.com" value={formData.email} onChange={set('email')} required />
              </div>
            </div>
            <div className="split-field">
              <label>Password</label>
              <div className="split-input-wrap">
                <span className="split-input-icon">🔑</span>
                <input type={showPass ? 'text' : 'password'} placeholder="Create a strong password"
                  value={formData.password} onChange={set('password')} required />
                <button type="button" className="split-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="split-field">
              <label>I am a</label>
              <div className="split-role-group">
                {['customer', 'agent', 'admin'].map(r => (
                  <label key={r} className={`split-role-btn ${formData.role === r ? 'role-active' : ''}`}>
                    <input type="radio" name="role" value={r} checked={formData.role === r} onChange={set('role')} />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="split-submit" disabled={loading}>
              {loading ? <span className="split-spinner" /> : 'Create Account'}
            </button>
          </form>
          <p className="split-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>

    </div>
  );
};

export default Register;
