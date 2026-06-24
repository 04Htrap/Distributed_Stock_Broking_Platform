import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { logout, userId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <div className="app-header__logo">SB</div>
        StockBro
      </Link>

      <nav className="app-header__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
        >
          Orders
        </NavLink>
      </nav>

      <div className="app-header__actions">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {userId?.slice(0, 8)}…
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
