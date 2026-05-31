import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
        color-scheme: light;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #eef7ec;
        color: #1f3d2e;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { min-height: 100vh; }

    .admin-wrap { display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    .sidebar {
        width: 230px;
        background: linear-gradient(180deg, #1d6b3d 0%, #155230 100%);
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        position: sticky;
        top: 0;
        height: 100vh;
        flex-shrink: 0;
        box-shadow: 4px 0 20px rgba(29, 107, 61, 0.15);
    }

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 20px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        margin-bottom: 12px;
    }

    .sidebar-logo .icon {
        width: 38px;
        height: 38px;
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }

    .sidebar-logo span {
        font-weight: 700;
        font-size: 1rem;
        color: white;
        line-height: 1.2;
    }

    .sidebar-logo small {
        display: block;
        font-size: 0.7rem;
        color: rgba(255,255,255,0.55);
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 20px;
        cursor: pointer;
        color: rgba(255,255,255,0.65);
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.15s;
        border-left: 3px solid transparent;
        text-decoration: none;
    }

    .nav-item:hover {
        background: rgba(255,255,255,0.1);
        color: white;
    }

    .nav-item.active {
        background: rgba(255,255,255,0.15);
        color: white;
        border-left-color: white;
        font-weight: 600;
    }

    .nav-icon { font-size: 16px; width: 20px; text-align: center; }

    .sidebar-bottom {
        margin-top: auto;
        padding: 16px 20px;
        border-top: 1px solid rgba(255,255,255,0.15);
    }

    .admin-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.15);
        border-radius: 20px;
        padding: 5px 12px;
        font-size: 0.78rem;
        color: white;
        font-weight: 600;
        width: 100%;
        justify-content: center;
        margin-bottom: 10px;
    }

    .logout-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 9px 12px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px;
        color: rgba(255,255,255,0.8);
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
        justify-content: center;
        font-weight: 500;
    }

    .logout-btn:hover {
        background: rgba(255,255,255,0.2);
        color: white;
    }

    /* ── Main ── */
    .main-content {
        flex: 1;
        padding: 36px 40px;
        background: #eef7ec;
        overflow-y: auto;
    }

    .page-header { margin-bottom: 28px; }

    .page-header h1 {
        font-size: 1.7rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: #1f3d2e;
        margin-bottom: 4px;
    }

    .page-header p { color: #4a7a5a; font-size: 0.9rem; }

    /* ── Stats ── */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
    }

    .stat-card {
        background: white;
        border: 1px solid #cfe5d0;
        border-radius: 20px;
        padding: 22px;
        box-shadow: 0 4px 16px rgba(29, 107, 61, 0.07);
        transition: box-shadow 0.2s, transform 0.2s;
    }

    .stat-card:hover {
        box-shadow: 0 8px 28px rgba(29, 107, 61, 0.13);
        transform: translateY(-2px);
    }

    .stat-label {
        font-size: 0.75rem;
        color: #5a8a6a;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .stat-value {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1;
        color: var(--accent, #1d6b3d);
    }

    .stat-sub { font-size: 0.75rem; color: #7aaa8a; margin-top: 6px; }

    /* ── Cards / Tables ── */
    .section-card {
        background: white;
        border: 1px solid #cfe5d0;
        border-radius: 20px;
        overflow: hidden;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(29, 107, 61, 0.07);
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 24px;
        border-bottom: 1px solid #e4f0e4;
        gap: 12px;
        flex-wrap: wrap;
        background: #f9fff4;
    }

    .section-header h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e4e2f;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
    }

    .count-badge {
        background: #e4f0e4;
        border-radius: 20px;
        padding: 2px 10px;
        font-size: 0.75rem;
        color: #3a7a4a;
        font-weight: 600;
    }

    .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

    .data-table th {
        text-align: left;
        padding: 11px 24px;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #5a8a6a;
        font-weight: 600;
        background: #f4fbf4;
        border-bottom: 1px solid #e4f0e4;
        white-space: nowrap;
    }

    .data-table td {
        padding: 13px 24px;
        border-bottom: 1px solid #edf5ed;
        color: #1f3d2e;
        vertical-align: middle;
    }

    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #f4fbf4; }

    /* ── Badges ── */
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
    }

    .badge-admin    { background: #d4edda; color: #1d6b3d; border: 1px solid #a8d5b5; }
    .badge-owner    { background: #dce8f5; color: #1a4a7a; border: 1px solid #aac4e0; }
    .badge-courier  { background: #fef3cd; color: #7a5500; border: 1px solid #f0d080; }
    .badge-family   { background: #f0f0f0; color: #555;    border: 1px solid #ddd; }
    .badge-locked   { background: #fde8e8; color: #a02020; border: 1px solid #f0b0b0; }
    .badge-unlocked { background: #d4edda; color: #1d6b3d; border: 1px solid #a8d5b5; }
    .badge-success  { background: #d4edda; color: #1d6b3d; }
    .badge-fail     { background: #fde8e8; color: #a02020; }

    /* ── Buttons ── */
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s;
        font-family: inherit;
        white-space: nowrap;
    }

    .btn-primary { background: #1d6b3d; color: white; }
    .btn-primary:hover { background: #155230; box-shadow: 0 4px 12px rgba(29,107,61,0.3); }

    .btn-danger { background: white; color: #c0392b; border-color: #e8aaaa; }
    .btn-danger:hover { background: #fde8e8; }

    .btn-ghost { background: white; color: #3a6a4a; border-color: #cfe5d0; }
    .btn-ghost:hover { background: #f4fbf4; }

    .btn-sm { padding: 4px 12px; font-size: 0.78rem; }

    .actions-row { display: flex; gap: 6px; align-items: center; }

    /* ── Modal ── */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(29, 61, 46, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        padding: 20px;
        backdrop-filter: blur(4px);
    }

    .modal {
        background: white;
        border: 1px solid #cfe5d0;
        border-radius: 24px;
        padding: 32px;
        width: 100%;
        max-width: 460px;
        box-shadow: 0 20px 50px rgba(29, 107, 61, 0.18);
    }

    .modal h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 20px; color: #1e4e2f; }

    .form-group { margin-bottom: 14px; }

    .form-group label {
        display: block;
        font-size: 0.78rem;
        font-weight: 600;
        color: #5a8a6a;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 6px;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px 14px;
        background: #f4fbf4;
        border: 1px solid #cfe5d0;
        border-radius: 10px;
        color: #1f3d2e;
        font-size: 0.9rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s;
    }

    .form-group input:focus,
    .form-group select:focus { border-color: #1d6b3d; box-shadow: 0 0 0 3px rgba(29,107,61,0.1); }

    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; }

    /* ── Misc ── */
    .mono { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #4a7a5a; }
    .text-muted { color: #7aaa8a; font-size: 0.85rem; }

    .empty-state { text-align: center; padding: 48px 24px; color: #7aaa8a; font-size: 0.9rem; }
    .empty-state .icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5; }

    .loading { text-align: center; padding: 40px; color: #7aaa8a; font-size: 0.88rem; }

    .error-msg {
        background: #fde8e8;
        border: 1px solid #f0b0b0;
        color: #a02020;
        border-radius: 10px;
        padding: 10px 16px;
        font-size: 0.85rem;
        margin: 12px 24px;
    }

    .top-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .search-input {
        padding: 8px 14px;
        background: white;
        border: 1px solid #cfe5d0;
        border-radius: 999px;
        color: #1f3d2e;
        font-size: 0.88rem;
        font-family: inherit;
        outline: none;
        min-width: 220px;
        transition: border-color 0.15s, box-shadow 0.15s;
    }

    .search-input:focus { border-color: #1d6b3d; box-shadow: 0 0 0 3px rgba(29,107,61,0.1); }

    .pagination {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 24px;
        border-top: 1px solid #edf5ed;
        font-size: 0.82rem;
        color: #7aaa8a;
        justify-content: flex-end;
        background: #f9fff4;
    }

    @media (max-width: 768px) {
        .sidebar { display: none; }
        .main-content { padding: 20px 16px; }
    }
`;

const ROLE_LABELS = { admin: "Admin", owner: "Lastnik", courier: "Kurir", family: "Družina" };
function roleBadge(role) { return <span className={`badge badge-${role}`}>{ROLE_LABELS[role] || role}</span>; }
function formatDate(iso) { return new Date(iso).toLocaleString("sl-SI", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

function EditUserModal({ user, onClose, onSave }) {
    const [form, setForm] = useState({ name: user.name || "", email: user.email || "", role: user.role || "family" });
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        try {
            const res = await axios.put(`${API}/users/${user._id}`, form, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            onSave(res.data);
        } catch (err) { alert("Napaka: " + (err.response?.data?.message || err.message)); }
        finally { setSaving(false); }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>✏️ Uredi uporabnika</h3>
                <div className="form-group"><label>Ime</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label>Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="form-group">
                    <label>Vloga</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                        <option value="admin">Admin</option>
                        <option value="owner">Lastnik (owner)</option>
                        <option value="courier">Kurir (courier)</option>
                        <option value="family">Družina (family)</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onClose}>Prekliči</button>
                    <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Shranjujem..." : "Shrani"}</button>
                </div>
            </div>
        </div>
    );
}

function StatsTab() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`${API}/stats`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
            .then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
    }, []);
    if (loading) return <div className="loading">Nalagam statistike</div>;
    return (
        <>
            <div className="stats-grid">
                <div className="stat-card" style={{"--accent": "var(--blue)"}}>
                    <div className="stat-label">Skupaj uporabnikov</div>
                    <div className="stat-value" style={{color:"var(--blue)"}}>{stats?.totalUsers ?? "—"}</div>
                    <div className="stat-sub">registriranih računov</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Paketniki</div>
                    <div className="stat-value">{stats?.totalMailboxes ?? "—"}</div>
                    <div className="stat-sub">v sistemu</div>
                </div>
                <div className="stat-card" style={{"--accent": "var(--yellow)"}}>
                    <div className="stat-label">Vsi odklepi</div>
                    <div className="stat-value" style={{color:"var(--yellow)"}}>{stats?.totalLogs ?? "—"}</div>
                    <div className="stat-sub">skupaj beleženih</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Danes</div>
                    <div className="stat-value">{stats?.recentLogs ?? "—"}</div>
                    <div className="stat-sub">odklepov v zadnjih 24h</div>
                </div>
                <div className="stat-card" style={{"--accent": stats?.successRate >= 90 ? "var(--green)" : "var(--yellow)"}}>
                    <div className="stat-label">Uspešnost</div>
                    <div className="stat-value" style={{color: stats?.successRate >= 90 ? "var(--green)" : "var(--yellow)"}}>{stats?.successRate ?? "—"}%</div>
                    <div className="stat-sub">uspešnih odklepov</div>
                </div>
            </div>
            <div className="section-card" style={{padding: "28px 24px"}}>
                <h2 style={{fontSize:"0.95rem", fontWeight:600, marginBottom:14, color:"var(--text-muted)"}}>ℹ️ Opomba za admina</h2>
                <p style={{color:"var(--text-muted)", fontSize:"0.88rem", lineHeight:1.7}}>
                    Ta nadzorna plošča je namenjena samo administratorjem sistema <strong style={{color:"var(--text)"}}>Pametni Paketnik</strong>.<br/>
                    Z njo upravljaš vse uporabnike (vloge, brisanje), vse paketnike in gledaš celotno zgodovino odklepov.<br/><br/>
                    Za aktivacijo admin dostopa: v MongoDB ročno nastavi <code style={{color:"var(--green)", background:"var(--green-dim)", padding:"1px 6px", borderRadius:4}}>role: "admin"</code> na želenem računu.
                </p>
            </div>
        </>
    );
}

function UsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState("");
    const load = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/users`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            setUsers(res.data);
        } catch { setError("Napaka pri nalaganju uporabnikov."); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);
    const deleteUser = async (id, name) => {
        if (!window.confirm(`Res izbrisati uporabnika "${name}"?`)) return;
        try {
            await axios.delete(`${API}/users/${id}`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            setUsers(u => u.filter(x => x._id !== id));
        } catch (err) { alert("Napaka: " + (err.response?.data?.message || err.message)); }
    };
    const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    return (
        <>
            {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={(updated) => { setUsers(u => u.map(x => x._id === updated._id ? updated : x)); setEditUser(null); }} />}
            <div className="section-card">
                <div className="section-header">
                    <h2>👥 Uporabniki <span className="count-badge">{users.length}</span></h2>
                    <input className="search-input" placeholder="Iskanje po imenu ali emailu..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {error && <div className="error-msg">{error}</div>}
                {loading ? <div className="loading">Nalagam uporabnike</div> : filtered.length === 0 ? (
                    <div className="empty-state"><div className="icon">👤</div><div>Ni najdenih uporabnikov.</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Ime</th><th>Email</th><th>Vloga</th><th>Registriran</th><th>Dejanja</th></tr></thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id}>
                                    <td style={{fontWeight:600}}>{u.name || <span className="text-muted">—</span>}</td>
                                    <td className="mono">{u.email}</td>
                                    <td>{roleBadge(u.role)}</td>
                                    <td className="mono">{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
                                    <td><div className="actions-row">
                                        <button className="btn btn-ghost btn-sm" onClick={() => setEditUser(u)}>✏️ Uredi</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id, u.name)}>🗑 Izbriši</button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}


function MailboxesTab() {
    const [mailboxes, setMailboxes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editMailbox, setEditMailbox] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        Promise.all([
            axios.get(`${API}/mailboxes`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }),
            axios.get(`${API}/users`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        ]).then(([m, u]) => { setMailboxes(m.data); setUsers(u.data); })
        .catch(() => setError("Napaka pri nalaganju podatkov."))
        .finally(() => setLoading(false));
    }, []);
    const deleteMailbox = async (id, name) => {
        if (!window.confirm(`Izbrisati paketnik "${name}" in vse njegove loge?`)) return;
        try {
            await axios.delete(`${API}/mailboxes/${id}`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            setMailboxes(m => m.filter(x => x._id !== id));
        } catch (err) { alert("Napaka: " + (err.response?.data?.message || err.message)); }
    };
    const filtered = mailboxes.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()) || m.location?.toLowerCase().includes(search.toLowerCase()) || m.deviceId?.toLowerCase().includes(search.toLowerCase()));
    return (
        <>
            {(editMailbox || showAdd) && <EditMailboxModal mailbox={editMailbox} users={users} onClose={() => { setEditMailbox(null); setShowAdd(false); }} onSave={(saved, isNew) => { if (isNew) setMailboxes(m => [saved, ...m]); else setMailboxes(m => m.map(x => x._id === saved._id ? saved : x)); setEditMailbox(null); setShowAdd(false); }} />}
            <div className="section-card">
                <div className="section-header">
                    <h2>📦 Paketniki <span className="count-badge">{mailboxes.length}</span></h2>
                    <div className="top-bar">
                        <input className="search-input" placeholder="Iskanje paketnikov..." value={search} onChange={e => setSearch(e.target.value)} />
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Dodaj paketnik</button>
                    </div>
                </div>
                {error && <div className="error-msg">{error}</div>}
                {loading ? <div className="loading">Nalagam paketnike</div> : filtered.length === 0 ? (
                    <div className="empty-state"><div className="icon">📦</div><div>Ni najdenih paketnikov.</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Ime</th><th>Lokacija</th><th>Device ID</th><th>Stanje</th><th>Lastnik</th><th>Dejanja</th></tr></thead>
                        <tbody>
                            {filtered.map(m => (
                                <tr key={m._id}>
                                    <td style={{fontWeight:600}}>{m.name}</td>
                                    <td className="text-muted">{m.location || "—"}</td>
                                    <td><code className="mono">{m.deviceId || "—"}</code></td>
                                    <td><span className={`badge ${m.isLocked ? "badge-locked" : "badge-unlocked"}`}>{m.isLocked ? "🔒 Zaklenjen" : "🔓 Odklenjen"}</span></td>
                                    <td className="text-muted">{m.owner ? `${m.owner.name || "—"} (${m.owner.email || "—"})` : <span style={{opacity:0.4}}>Brez lastnika</span>}</td>
                                    <td><div className="actions-row">
                                        <button className="btn btn-ghost btn-sm" onClick={() => setEditMailbox(m)}>✏️ Uredi</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteMailbox(m._id, m.name)}>🗑 Izbriši</button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}


const TABS = [
    { id: "stats", label: "Statistike", icon: "📊" },
    { id: "users", label: "Uporabniki", icon: "👥" },
    { id: "mailboxes", label: "Paketniki", icon: "📦" },
    { id: "logs", label: "Logi", icon: "📋" },
];



function AdminPage() {
    const [tab, setTab] = useState("stats");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    

    return (
        <>
            <style>{styles}</style>
            <div className="admin-wrap">
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="icon">📦</div>
                        <div>
                            <span>Škatlarji</span>
                            <small>Admin panel</small>
                        </div>
                    </div>

                    {TABS.map(t => (
                        <div
                            key={t.id}
                            className={`nav-item ${tab === t.id ? "active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            <span className="nav-icon">{t.icon}</span>
                            {t.label}
                        </div>
                    ))}

                    <div
                        className="nav-item"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span className="nav-icon">🏠</span>
                        Dashboard
                    </div>

                    <div className="sidebar-bottom">
                        <div className="admin-badge">
                            ⚡ {user.name || "Admin"}
                        </div>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            🚪 Odjava
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="page-header">
                        <h1>Admin panel</h1>
                    </div>
                </main>
            </div>
        </>
    );
}

export default AdminPage;