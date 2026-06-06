import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

function Dashboard() {
    const [mailboxes, setMailboxes] = useState([]);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMailboxes();
    }, []);

    // Poll for updates every 5 seconds so when users add books they appear immediately
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
            // Derive flat books list for display
            const flat = [];
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            (res.data || []).forEach(mailbox => {
                (mailbox.books || []).forEach(book => {
                    if (typeof book === "string") {
                        flat.push({
                            _id: `${mailbox._id}_${flat.length}`,
                            title: book,
                            author: undefined,
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
                            if (typeof u === 'string') return (u === (currentUser._id || currentUser.id));
                            return (u._id === (currentUser._id || currentUser.id) || u.id === (currentUser._id || currentUser.id));
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
            // Refresh to show updated interest counts
            fetchMailboxes();
        } catch (err) {
            alert("Napaka pri beleženju interesa: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <Header />

            <div style={{ padding: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <h1>Dashboard</h1>
                        <p>Pregled knjig v paketnikih. Dodajte knjige v svojem Profilu.</p>
                    </div>
                </div>

                {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

                <div style={{ marginBottom: 18 }}>
                    <h2>Knjige v paketnikih</h2>
                    {books.length === 0 ? (
                        <p>Ni najdenih knjig.</p>
                    ) : (
                        books.map((b, idx) => (
                            <div key={b._id || idx} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{b.title}</strong>
                                    <div style={{ color: "#555" }}>{b.author ? `Avtor: ${b.author}` : "Avtor: neznan"}</div>
                                    <div style={{ color: "#444", marginTop: 6 }}><strong>Ponudnik:</strong> {b.offeredBy || "Neznan"} | <strong>Paketnik:</strong> {b.mailbox?.name}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: 8 }}><strong>{b.interestedCount || 0}</strong> interested</div>
                                    {b.bookId ? (
                                        <button
                                            onClick={() => expressInterest(b.mailbox.id, b.bookId)}
                                            disabled={b.interestedByCurrent}
                                            style={{ padding: "8px 12px", background: b.interestedByCurrent ? '#94a3b8' : '#f97316', color: 'white', border: 'none', borderRadius: 6, cursor: b.interestedByCurrent ? 'default' : 'pointer' }}
                                        >
                                            {b.interestedByCurrent ? "You're interested" : "I'm interested"}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;