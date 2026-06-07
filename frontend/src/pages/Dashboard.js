import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    :root {
        --green-dark: #1d6b3d;
        --green-mid: #2e7d4f;
        --green-light: #47a45d;
        --green-pale: #eef7ec;
        --green-border: #cfe5d0;
        --book-amber: #d97706;
        --book-amber-light: #fef3c7;
        --book-amber-border: #fde68a;
        --text-main: #1a2e1f;
        --text-sub: #4a6352;
        --white: #fff;
        --card-shadow: 0 2px 12px rgba(29,107,61,0.09);
        --card-shadow-hover: 0 8px 28px rgba(29,107,61,0.16);
        font-family: 'DM Sans', system-ui, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        background: var(--green-pale);
        color: var(--text-main);
        min-height: 100vh;
    }

    .dashboard-wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 24px 60px;
    }

    .dashboard-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 32px;
        gap: 16px;
        flex-wrap: wrap;
    }

    .dashboard-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--green-dark);
        letter-spacing: -0.03em;
        line-height: 1.1;
    }

    .dashboard-sub {
        margin-top: 6px;
        color: var(--text-sub);
        font-size: 0.97rem;
    }

    .section-heading {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--green-dark);
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .section-heading .count-badge {
        background: var(--green-dark);
        color: white;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 2px 9px;
        font-family: 'DM Mono', monospace;
    }

    /* ─── PAKETNIKI GRID ─── */
    .mailbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-bottom: 44px;
    }

    .mailbox-card {
        background: var(--white);
        border: 1.5px solid var(--green-border);
        border-radius: 16px;
        padding: 20px;
        box-shadow: var(--card-shadow);
        transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .mailbox-card:hover {
        box-shadow: var(--card-shadow-hover);
        transform: translateY(-2px);
        border-color: var(--green-light);
    }

    .mailbox-top {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .mailbox-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-light) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 1.25rem;
    }

    .mailbox-info {
        flex: 1;
        min-width: 0;
    }

    .mailbox-name {
        font-size: 1.02rem;
        font-weight: 700;
        color: var(--green-dark);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mailbox-location {
        font-size: 0.82rem;
        color: var(--text-sub);
        margin-top: 2px;
    }

    .mailbox-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        font-weight: 600;
        font-family: 'DM Mono', monospace;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status-dot.locked   { background: #ef4444; box-shadow: 0 0 0 2px #fecaca; }
    .status-dot.unlocked { background: #22c55e; box-shadow: 0 0 0 2px #bbf7d0; }

    .mailbox-meta {
        font-size: 0.8rem;
        color: var(--text-sub);
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .mailbox-books-count {
        background: var(--book-amber-light);
        color: var(--book-amber);
        border: 1px solid var(--book-amber-border);
        border-radius: 99px;
        padding: 1px 8px;
        font-size: 0.76rem;
        font-weight: 600;
    }

    .btn-unlock {
        padding: 9px 14px;
        background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.875rem;
        width: 100%;
        transition: opacity 0.2s, transform 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: 'DM Sans', sans-serif;
    }

    .btn-unlock:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    /* ─── KNJIGE GRID ─── */
    .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 14px;
    }

    .book-card {
        background: var(--white);
        border: 1.5px solid var(--green-border);
        border-radius: 16px;
        padding: 18px;
        box-shadow: var(--card-shadow);
        transition: box-shadow 0.2s, transform 0.2s;
        display: flex;
        gap: 14px;
        align-items: flex-start;
    }

    .book-card:hover {
        box-shadow: var(--card-shadow-hover);
        transform: translateY(-2px);
    }

    .book-spine {
        width: 8px;
        border-radius: 4px;
        align-self: stretch;
        flex-shrink: 0;
        background: linear-gradient(180deg, var(--book-amber) 0%, #b45309 100%);
    }

    .book-body {
        flex: 1;
        min-width: 0;
    }

    .book-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.3;
    }

    .book-author {
        font-size: 0.82rem;
        color: var(--text-sub);
        margin-top: 3px;
        font-style: italic;
    }

    .book-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        flex-wrap: wrap;
    }

    .book-tag {
        background: var(--green-pale);
        color: var(--green-dark);
        border: 1px solid var(--green-border);
        border-radius: 99px;
        font-size: 0.74rem;
        font-weight: 600;
        padding: 2px 8px;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .book-tag.amber {
        background: var(--book-amber-light);
        color: var(--book-amber);
        border-color: var(--book-amber-border);
    }

    .book-interest-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        gap: 8px;
    }

    .interest-count {
        font-size: 0.82rem;
        color: var(--text-sub);
        font-family: 'DM Mono', monospace;
    }

    .btn-interest {
        padding: 7px 13px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.8rem;
        transition: opacity 0.2s, transform 0.15s;
        font-family: 'DM Sans', sans-serif;
    }

    .btn-interest:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.88; }

    .btn-interest.active {
        background: var(--green-pale);
        color: var(--green-dark);
        border: 1.5px solid var(--green-border);
        cursor: default;
    }

    .btn-interest.inactive {
        background: linear-gradient(135deg, var(--book-amber) 0%, #b45309 100%);
        color: white;
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-sub);
        font-size: 0.95rem;
        background: var(--white);
        border: 1.5px dashed var(--green-border);
        border-radius: 16px;
    }

    .empty-state .empty-icon { font-size: 2.4rem; display: block; margin-bottom: 10px; }

    .error-msg {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        border-radius: 10px;
        padding: 12px 16px;
        margin-bottom: 24px;
        font-size: 0.9rem;
    }

    .divider {
        border: none;
        border-top: 2px solid var(--green-border);
        margin: 32px 0;
    }
`;

function Dashboard() {
    const [mailboxes, setMailboxes] = useState([]);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMailboxes();
    }, []);

    useEffect(() => {
        const id = setInterval(fetchMailboxes, 5000);
        return () => clearInterval(id);
    }, []);

    const fetchMailboxes = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/mailboxes",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );
            setMailboxes(res.data);

            const flat = [];
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            (res.data || []).forEach(mailbox => {
                (mailbox.books || []).forEach(book => {
                    if (typeof book === "string") {
                        flat.push({
                            _id: `${mailbox._id}_${flat.length}`,
                            title: book,
                            author: "",
                            offeredBy: undefined,
                            interestedCount: 0,
                            interestedByCurrent: false,
                            bookId: null,
                            mailbox: { id: mailbox._id, name: mailbox.name }
                        });
                    } else {
                        const interestedArr = book.interested || [];
                        const interestedCount = interestedArr.length;
                        const interestedByCurrent = interestedArr.some(u => {
                            if (!u) return false;
                            if (typeof u === "string") return u === (currentUser._id || currentUser.id);
                            return u._id === (currentUser._id || currentUser.id) || u.id === (currentUser._id || currentUser.id);
                        });
                        flat.push({
                            _id: book._id || `${mailbox._id}_${flat.length}`,
                            title: book.title,
                            author: book.author,
                            offeredBy: book.offeredBy ? book.offeredBy.name : undefined,
                            interestedCount,
                            interestedByCurrent,
                            bookId: book._id,
                            mailbox: { id: mailbox._id, name: mailbox.name }
                        });
                    }
                });
            });
            setBooks(flat);
            setError(null);
        } catch (err) {
            console.error("Napaka pri pridobivanju paketnikov:", err);
            setError("Ni mogoče naložiti paketnikov. Preveri backend ruto.");
        }
    };

    const unlock = async (id) => {
        try {
            await axios.post(
                `http://localhost:5000/api/mailboxes/${id}/unlock`,
                { method: "mobile-app" },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );
            alert("Paketnik odklenjen!");
            fetchMailboxes();
        } catch (err) {
            alert("Napaka pri odklepanju: " + (err.response?.data?.message || err.message));
        }
    };

    const expressInterest = async (mailboxId, bookId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/mailboxes/${mailboxId}/books/${bookId}/interest`,
                {},
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );
            fetchMailboxes();
        } catch (err) {
            alert("Napaka pri beleženju interesa: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <style>{styles}</style>
            <Header />

            <div className="dashboard-wrap">
                <div className="dashboard-top">
                    <div>
                        <div className="dashboard-title">📦 Dashboard</div>
                        <div className="dashboard-sub">
                            Pregled paketnikov in knjig, ki jih je skupnost ponudila za izmenjavo.
                        </div>
                    </div>
                    <Link to="/profile">
                        <button style={{
                            padding: "9px 18px",
                            background: "white",
                            color: "var(--green-dark)",
                            border: "1.5px solid var(--green-border)",
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif"
                        }}>
                            + Dodaj knjige
                        </button>
                    </Link>
                </div>

                {error && <div className="error-msg">⚠️ {error}</div>}

                {/* ── PAKETNIKI ── */}
                <div className="section-heading">
                    📦 Paketniki
                    <span className="count-badge">{mailboxes.length}</span>
                </div>

                {mailboxes.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        Ni najdenih paketnikov.
                    </div>
                ) : (
                    <div className="mailbox-grid">
                        {mailboxes.map(m => (
                            <div key={m._id} className="mailbox-card">
                                <div className="mailbox-top">
                                    <div className="mailbox-icon">📦</div>
                                    <div className="mailbox-info">
                                        <div className="mailbox-name">{m.name}</div>
                                        {m.location && (
                                            <div className="mailbox-location">📍 {m.location}</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <div className="mailbox-status">
                                        <span className={`status-dot ${m.isLocked ? "locked" : "unlocked"}`}></span>
                                        {m.isLocked ? "Zaklenjeno" : "Odklenjeno"}
                                    </div>
                                    {(m.books || []).length > 0 && (
                                        <span className="mailbox-books-count">
                                            📚 {(m.books || []).length} {(m.books || []).length === 1 ? "knjiga" : "knjig"}
                                        </span>
                                    )}
                                </div>

                                {m.owner && (
                                    <div className="mailbox-meta">
                                        👤 Lastnik: <strong>{m.owner.name}</strong>
                                    </div>
                                )}

                                <button className="btn-unlock" onClick={() => unlock(m._id)}>
                                    🔓 Odkleni paketnik
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <hr className="divider" />

                {/* ── KNJIGE ── */}
                <div className="section-heading">
                    📚 Knjige v paketnikih
                    <span className="count-badge">{books.length}</span>
                </div>

                {books.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📖</span>
                        Trenutno ni nobene knjige v paketnikih.
                        <div style={{ marginTop: 8 }}>
                            <Link to="/profile" style={{ color: "var(--green-dark)", fontWeight: 600 }}>
                                Dodaj svojo knjigo →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="books-grid">
                        {books.map((b, idx) => {
                            const title = (b.title || "").toString().trim();
                            const author = (b.author || "").toString().trim();
                            const offeredBy = typeof b.offeredBy === "object"
                                ? b.offeredBy?.name
                                : (b.offeredBy || "");

                            return (
                                <div
                                    key={`${b.mailbox.id}-${b._id || idx}-${idx}`}
                                    className="book-card"
                                >
                                    <div className="book-spine" />

                                    <div className="book-body">
                                        <div className="book-title">{title}</div>
                                        {author && (
                                            <div className="book-author">{author}</div>
                                        )}

                                        <div className="book-meta-row">
                                            {offeredBy && (
                                                <span className="book-tag">
                                                    👤 {offeredBy}
                                                </span>
                                            )}
                                            <span className="book-tag amber">
                                                📦 {b.mailbox?.name}
                                            </span>
                                        </div>

                                        <div className="book-interest-row">
                                            <span className="interest-count">
                                                ❤️ {b.interestedCount || 0} zainteresiranih
                                            </span>

                                            {b.bookId && (
                                                <button
                                                    onClick={() => expressInterest(b.mailbox.id, b.bookId)}
                                                    disabled={b.interestedByCurrent}
                                                    className={`btn-interest ${b.interestedByCurrent ? "active" : "inactive"}`}
                                                >
                                                    {b.interestedByCurrent ? "✓ Zainteresiran" : "Me zanima"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;
