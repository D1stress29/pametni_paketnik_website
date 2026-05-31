import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    );
}

export default AdminPage;