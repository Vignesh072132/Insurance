import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">🛡️ ICMS</Link>
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/policies">Policies</Link>
          {(user.role === 'admin' || user.role === 'agent') && (
            <Link to="/create-policy">Create Policy</Link>
          )}
          <Link to="/claims">Claims</Link>
          <Link to="/submit-claim">Submit Claim</Link>
          {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          <span className="user-info">{user.name} ({user.role})</span>
          <button onClick={toggleTheme} className="btn-theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      )}
      {!user && (
        <button onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}
    </nav>
  );
};

export default Navbar;
