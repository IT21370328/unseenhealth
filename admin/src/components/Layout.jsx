import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
    { label: 'Articles', path: '/articles', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
    { label: 'New Article', path: '/articles/new', icon: 'M12 5v14M5 12h14' },
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Unseen <span>Health</span></div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon d={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Log out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
