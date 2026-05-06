import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ── Demo data ─────────────────────────────────────── */
const TENANTS = [
  { id: 1, name: 'Northstar Studio',  plan: 'Enterprise', users: 3, status: 'active',   created: 'Jan 10, 2025' },
  { id: 2, name: 'Partner Corp',      plan: 'Business',   users: 1, status: 'active',   created: 'Mar 5, 2025'  },
  { id: 3, name: 'Nordic Ventures',   plan: 'Starter',    users: 1, status: 'trial',    created: 'Apr 20, 2025' },
];

const ROLES = [
  { id: 1, name: 'Super Admin', users: 1, permissions: ['All access'], color: 'super-admin' },
  { id: 2, name: 'Admin',       users: 1, permissions: ['Users', 'Tenants', 'Reports'],  color: 'admin'   },
  { id: 3, name: 'Manager',     users: 2, permissions: ['Users', 'Reports'],              color: 'manager' },
  { id: 4, name: 'User',        users: 1, permissions: ['Read only'],                     color: 'user'    },
];

const ANALYTICS_MONTHLY = [
  { month: 'Nov', logins: 210, actions: 140, newUsers: 1 },
  { month: 'Dec', logins: 325, actions: 200, newUsers: 2 },
  { month: 'Jan', logins: 275, actions: 175, newUsers: 0 },
  { month: 'Feb', logins: 400, actions: 260, newUsers: 1 },
  { month: 'Mar', logins: 360, actions: 300, newUsers: 1 },
  { month: 'Apr', logins: 475, actions: 340, newUsers: 2 },
  { month: 'May', logins: 440, actions: 365, newUsers: 0 },
];

const USERS_TABLE = [
  { id: 1, name: 'Faiz Ahmed',    email: 'superadmin@example.com', role: 'Super Admin', tenant: 'Northstar Studio',  status: 'active',   joined: 'Jan 12, 2025' },
  { id: 2, name: 'Sara Chen',     email: 'sara.chen@ns.io',        role: 'Admin',       tenant: 'Northstar Studio',  status: 'active',   joined: 'Feb 3, 2025'  },
  { id: 3, name: 'Arjun Mehta',   email: 'arjun@northstar.io',     role: 'Manager',     tenant: 'Northstar Studio',  status: 'active',   joined: 'Mar 18, 2025' },
  { id: 4, name: 'Layla Hassan',  email: 'layla@partner.io',       role: 'User',        tenant: 'Partner Corp',      status: 'inactive', joined: 'Apr 2, 2025'  },
  { id: 5, name: 'Tom Eriksson',  email: 'tom.e@nordic.io',        role: 'Manager',     tenant: 'Nordic Ventures',   status: 'active',   joined: 'Apr 29, 2025' },
];

const CHART_DATA = [
  { month: 'Nov', a: 42, b: 28 },
  { month: 'Dec', a: 65, b: 40 },
  { month: 'Jan', a: 55, b: 35 },
  { month: 'Feb', a: 80, b: 52 },
  { month: 'Mar', a: 72, b: 60 },
  { month: 'Apr', a: 95, b: 68 },
  { month: 'May', a: 88, b: 73 },
];

const ACTIVITY = [
  { color: 'purple', text: <><strong>Faiz Ahmed</strong> created tenant <strong>Nordic Ventures</strong></>,        time: '2m ago'  },
  { color: 'teal',   text: <><strong>Sara Chen</strong> updated role permissions for <strong>Admin</strong></>,     time: '18m ago' },
  { color: 'amber',  text: <><strong>Tom Eriksson</strong> invited <strong>3 new users</strong></>,                 time: '1h ago'  },
  { color: 'blue',   text: <><strong>Arjun Mehta</strong> generated monthly report</>,                              time: '3h ago'  },
  { color: 'red',    text: <><strong>Layla Hassan</strong> account set to <strong>inactive</strong></>,             time: '5h ago'  },
];

/* ── Helper ────────────────────────────────────────── */
function initials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

/* ═══════════════════════════════════════════════════════ */
/*  LOGIN                                                  */
/* ═══════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [email, setEmail]       = useState('superadmin@example.com');
  const [password, setPassword] = useState('superadmin123');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      onLogin(res.data.user, res.data.accessToken);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">⚡</div>
          <span className="login-brand-name">NexaPanel</span>
        </div>

        <div className="login-hero">
          <h1>One platform,<br />every team.</h1>
          <p>
            Manage tenants, roles, and users across your entire organization
            from a single, beautifully designed workspace.
          </p>
        </div>

        <div className="login-stats">
          <div className="login-stat">
            <strong>3 tenants</strong>
            <small>Active</small>
          </div>
          <div className="login-stat">
            <strong>5 users</strong>
            <small>In system</small>
          </div>
          <div className="login-stat">
            <strong>4 roles</strong>
            <small>Configured</small>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome back</h2>
          <p className="login-card-sub">Sign in to your workspace dashboard.</p>

          <div className="demo-hint">
            <span className="demo-hint-icon">🔑</span>
            <div className="demo-hint-body">
              <strong>Demo credentials (pre-filled)</strong>
              {email} · {password}
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">✉</span>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">🔒</span>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  DASHBOARD                                              */
/* ═══════════════════════════════════════════════════════ */
const NAV = [
  { icon: '◈',  label: 'Overview',   badge: null },
  { icon: '👥', label: 'Users',      badge: '5'  },
  { icon: '🏢', label: 'Tenants',    badge: '3'  },
  { icon: '🛡', label: 'Roles',      badge: null },
  { icon: '📊', label: 'Analytics',  badge: null },
  { icon: '⚙', label: 'Settings',   badge: null },
];

function RoleBadge({ role }) {
  const cls = { 'Super Admin': 'super-admin', Admin: 'admin', Manager: 'manager', User: 'user' }[role] || 'user';
  return <span className={`role-badge ${cls}`}>{role}</span>;
}

/* ── Page: Overview ───────────────────────────────── */
function PageOverview({ user }) {
  const maxA = Math.max(...CHART_DATA.map(d => d.a));
  const maxB = Math.max(...CHART_DATA.map(d => d.b));
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Good morning, {user.name.split(' ')[0]} 👋</h2>
          <p>Here's what's happening in <strong>{user.tenant}</strong> today.</p>
        </div>
        <button className="btn-primary">＋ Invite user</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon purple">👥</div><span className="stat-change up">↑ 12%</span></div>
          <div><div className="stat-value">5</div><div className="stat-label">Total users</div></div>
          <div className="stat-bar"><div className="stat-bar-fill purple" style={{ width: '72%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon teal">🏢</div><span className="stat-change up">↑ 5%</span></div>
          <div><div className="stat-value">3</div><div className="stat-label">Active tenants</div></div>
          <div className="stat-bar"><div className="stat-bar-fill teal" style={{ width: '45%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon amber">🛡</div><span className="stat-change down">↓ 2%</span></div>
          <div><div className="stat-value">4</div><div className="stat-label">Role types</div></div>
          <div className="stat-bar"><div className="stat-bar-fill amber" style={{ width: '60%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon blue">📋</div><span className="stat-change up">↑ 31%</span></div>
          <div><div className="stat-value">88</div><div className="stat-label">Events this month</div></div>
          <div className="stat-bar"><div className="stat-bar-fill blue" style={{ width: '88%' }} /></div>
        </div>
      </div>

      <div className="row-2col">
        <div className="card">
          <div className="card-header"><span className="card-title">User activity overview</span><span className="card-action">Last 7 months</span></div>
          <div className="chart-area">
            {CHART_DATA.map(d => (
              <div className="chart-col" key={d.month}>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: `${(d.a / maxA) * 160}px` }} title={`Logins: ${d.a}`} />
                  <div className="chart-bar secondary" style={{ height: `${(d.b / maxB) * 160}px` }} title={`Actions: ${d.b}`} />
                </div>
                <div className="chart-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Recent activity</span><span className="card-action">View all</span></div>
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${a.color}`} />
                <div className="activity-content"><span className="activity-text">{a.text}</span><span className="activity-time">{a.time}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">All users</span><span className="card-action">Export CSV</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Tenant</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {USERS_TABLE.map((u, i) => (
                <tr key={u.id}>
                  <td><div className="user-cell"><div className={`user-avatar v${i + 1}`}>{initials(u.name)}</div><div><div className="user-name">{u.name}</div><div className="user-email">{u.email}</div></div></div></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.tenant}</td>
                  <td><span className={`status-badge ${u.status}`}>{u.status === 'active' ? '● Active' : '○ Inactive'}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page: Users ───────────────────────────────────── */
function PageUsers() {
  const [search, setSearch] = useState('');
  const filtered = USERS_TABLE.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Users</h2>
          <p>Manage all users across every tenant in your system.</p>
        </div>
        <button className="btn-primary">＋ Add user</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon purple">✅</div><span className="stat-change up">↑ 12%</span></div>
          <div><div className="stat-value">4</div><div className="stat-label">Active users</div></div>
          <div className="stat-bar"><div className="stat-bar-fill purple" style={{ width: '80%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon amber">⏸</div><span className="stat-change down">↓ 1</span></div>
          <div><div className="stat-value">1</div><div className="stat-label">Inactive users</div></div>
          <div className="stat-bar"><div className="stat-bar-fill amber" style={{ width: '20%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon blue">🏢</div></div>
          <div><div className="stat-value">3</div><div className="stat-label">Tenants covered</div></div>
          <div className="stat-bar"><div className="stat-bar-fill blue" style={{ width: '60%' }} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All users ({filtered.length})</span>
          <input
            className="search-input"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Tenant</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td><div className="user-cell"><div className={`user-avatar v${(i % 5) + 1}`}>{initials(u.name)}</div><div><div className="user-name">{u.name}</div><div className="user-email">{u.email}</div></div></div></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.tenant}</td>
                  <td><span className={`status-badge ${u.status}`}>{u.status === 'active' ? '● Active' : '○ Inactive'}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.joined}</td>
                  <td><span className="card-action" style={{ cursor: 'pointer' }}>Edit</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page: Tenants ─────────────────────────────────── */
function PageTenants() {
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Tenants</h2>
          <p>Organizations using your platform.</p>
        </div>
        <button className="btn-primary">＋ New tenant</button>
      </div>

      <div className="tenants-grid">
        {TENANTS.map((t, i) => (
          <div className="tenant-card" key={t.id}>
            <div className="tenant-card-top">
              <div className={`user-avatar v${i + 1}`} style={{ width: 48, height: 48, borderRadius: 14, fontSize: '1rem' }}>
                {t.name.slice(0, 2).toUpperCase()}
              </div>
              <span className={`status-badge ${t.status === 'trial' ? 'inactive' : 'active'}`}>
                {t.status === 'active' ? '● Active' : '◑ Trial'}
              </span>
            </div>
            <div className="tenant-name">{t.name}</div>
            <div className="tenant-meta">
              <span>{t.plan}</span>
              <span>{t.users} user{t.users !== 1 ? 's' : ''}</span>
              <span>Since {t.created}</span>
            </div>
            <div className="tenant-bar">
              <div className="tenant-bar-fill" style={{ width: `${(t.users / 5) * 100}%` }} />
            </div>
            <div className="tenant-actions">
              <button className="tenant-btn">Manage</button>
              <button className="tenant-btn ghost">View logs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page: Roles ───────────────────────────────────── */
function PageRoles() {
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Roles &amp; Permissions</h2>
          <p>Control what each role can access across the platform.</p>
        </div>
        <button className="btn-primary">＋ New role</button>
      </div>

      <div className="roles-grid">
        {ROLES.map(r => (
          <div className="role-card" key={r.id}>
            <div className="role-card-head">
              <span className={`role-badge ${r.color}`}>{r.name}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{r.users} user{r.users !== 1 ? 's' : ''}</span>
            </div>
            <div className="role-perms">
              {r.permissions.map(p => (
                <span key={p} className="perm-tag">✓ {p}</span>
              ))}
            </div>
            <div className="role-card-footer">
              <button className="tenant-btn">Edit permissions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page: Analytics ───────────────────────────────── */
function PageAnalytics() {
  const max = Math.max(...ANALYTICS_MONTHLY.map(d => d.logins));
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Analytics</h2>
          <p>Platform-wide usage trends over the last 7 months.</p>
        </div>
        <button className="btn-primary">⬇ Export report</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon purple">🔐</div><span className="stat-change up">↑ 18%</span></div>
          <div><div className="stat-value">2,485</div><div className="stat-label">Total logins</div></div>
          <div className="stat-bar"><div className="stat-bar-fill purple" style={{ width: '92%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon teal">⚡</div><span className="stat-change up">↑ 24%</span></div>
          <div><div className="stat-value">1,580</div><div className="stat-label">Total actions</div></div>
          <div className="stat-bar"><div className="stat-bar-fill teal" style={{ width: '78%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon amber">👤</div><span className="stat-change up">↑ 7</span></div>
          <div><div className="stat-value">7</div><div className="stat-label">New users added</div></div>
          <div className="stat-bar"><div className="stat-bar-fill amber" style={{ width: '35%' }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-icon blue">📈</div><span className="stat-change up">↑ 4.2%</span></div>
          <div><div className="stat-value">57%</div><div className="stat-label">Avg. engagement</div></div>
          <div className="stat-bar"><div className="stat-bar-fill blue" style={{ width: '57%' }} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Monthly logins vs actions</span><span className="card-action">7-month window</span></div>
        <div className="chart-area">
          {ANALYTICS_MONTHLY.map(d => (
            <div className="chart-col" key={d.month}>
              <div className="chart-bar-wrap">
                <div className="chart-bar" style={{ height: `${(d.logins / max) * 160}px` }} title={`Logins: ${d.logins}`} />
                <div className="chart-bar secondary" style={{ height: `${(d.actions / max) * 160}px` }} title={`Actions: ${d.actions}`} />
              </div>
              <div className="chart-label">{d.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Monthly breakdown</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Logins</th><th>Actions</th><th>New users</th><th>Engagement</th></tr></thead>
            <tbody>
              {ANALYTICS_MONTHLY.map(d => (
                <tr key={d.month}>
                  <td style={{ fontWeight: 600 }}>{d.month} 2025</td>
                  <td>{d.logins}</td>
                  <td>{d.actions}</td>
                  <td>{d.newUsers > 0 ? `+${d.newUsers}` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="stat-bar" style={{ flex: 1, margin: 0 }}>
                        <div className="stat-bar-fill purple" style={{ width: `${Math.round((d.actions / d.logins) * 100)}%` }} />
                      </div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {Math.round((d.actions / d.logins) * 100)}%
                      </span>
                    </div>
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

/* ── Page: Settings ────────────────────────────────── */
function PageSettings({ user }) {
  return (
    <div className="dashboard-body">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Settings</h2>
          <p>Manage your account and workspace preferences.</p>
        </div>
      </div>

      <div className="row-2col">
        <div className="settings-stack">
          <div className="card">
            <div className="card-header"><span className="card-title">Account</span></div>
            <div className="settings-body">
              <div className="settings-row">
                <div className={`user-avatar v1`} style={{ width: 56, height: 56, borderRadius: 16, fontSize: '1.1rem' }}>{initials(user.name)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                  <div style={{ marginTop: 4 }}><RoleBadge role={user.role} /></div>
                </div>
              </div>
              <div className="settings-field">
                <label>Display name</label>
                <input className="form-input" defaultValue={user.name} style={{ paddingLeft: 14 }} />
              </div>
              <div className="settings-field">
                <label>Email address</label>
                <input className="form-input" defaultValue={user.email} style={{ paddingLeft: 14 }} />
              </div>
              <button className="btn-primary" style={{ marginTop: 8, width: 'fit-content' }}>Save changes</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Security</span></div>
            <div className="settings-body">
              <div className="settings-field">
                <label>Current password</label>
                <input className="form-input" type="password" placeholder="••••••••" style={{ paddingLeft: 14 }} />
              </div>
              <div className="settings-field">
                <label>New password</label>
                <input className="form-input" type="password" placeholder="••••••••" style={{ paddingLeft: 14 }} />
              </div>
              <button className="btn-primary" style={{ marginTop: 8, width: 'fit-content' }}>Change password</button>
            </div>
          </div>
        </div>

        <div className="settings-stack">
          <div className="card">
            <div className="card-header"><span className="card-title">Workspace</span></div>
            <div className="settings-body">
              <div className="settings-info-row"><span>Tenant</span><strong>{user.tenant}</strong></div>
              <div className="settings-info-row"><span>Plan</span><strong>Enterprise</strong></div>
              <div className="settings-info-row"><span>Members</span><strong>5 users</strong></div>
              <div className="settings-info-row"><span>Data region</span><strong>EU West</strong></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Notifications</span></div>
            <div className="settings-body">
              {['New user joined', 'Role changes', 'Tenant updates', 'Weekly digest'].map(label => (
                <div className="toggle-row" key={label}>
                  <span style={{ fontSize: '0.88rem' }}>{label}</span>
                  <div className="toggle on" />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(240,93,93,0.3)' }}>
            <div className="card-header"><span className="card-title" style={{ color: 'var(--danger)' }}>Danger zone</span></div>
            <div className="settings-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Deleting your account is permanent and cannot be undone.
              </p>
              <button className="btn-danger">Delete account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">⚡</div>
          <span className="sidebar-brand-name">NexaPanel</span>
        </div>

        <nav className="sidebar-section">
          <p className="sidebar-section-label">Main menu</p>
          {NAV.map(item => (
            <div
              key={item.label}
              className={`nav-item${activeNav === item.label ? ' active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials(user.name)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
          <button className="sidebar-logout" onClick={onLogout} title="Sign out">↩</button>
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="topbar">
          <span className="topbar-title">{activeNav}</span>
          <div className="topbar-actions">
            <button className="icon-btn notif-dot">🔔</button>
            <button className="icon-btn">🔍</button>
            <div className="sidebar-avatar" style={{ width: 36, height: 36, borderRadius: 10 }}>
              {initials(user.name)}
            </div>
          </div>
        </header>

        {/* Routed page */}
        {activeNav === 'Overview'  && <PageOverview user={user} />}
        {activeNav === 'Users'     && <PageUsers />}
        {activeNav === 'Tenants'   && <PageTenants />}
        {activeNav === 'Roles'     && <PageRoles />}
        {activeNav === 'Analytics' && <PageAnalytics />}
        {activeNav === 'Settings'  && <PageSettings user={user} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  ROOT                                                   */
/* ═══════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />;
}

