import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

function Dashboard() {
    const [mailboxes, setMailboxes] = useState([]);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null); // Shranimo napako, da jo izpišemo v UI
    const [selectedMailboxId, setSelectedMailboxId] = useState(null);
    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");
    const [booksList, setBooksList] = useState({});

    useEffect(() => {
        fetchMailboxes();
    }, []);

    // Poll for updates so when other users add books they appear for everyone
    useEffect(() => {
        const id = setInterval(fetchMailboxes, 8000);
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

    const toggleAdd = (mailbox) => {
        const next = selectedMailboxId === mailbox._id ? null : mailbox._id;
        setSelectedMailboxId(next);

        // If opening, ensure this mailbox's books are visible in the main books list
        if (next) {
            const mailboxBooks = mailbox.books || [];
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            setBooks(prev => {
                const existingIds = new Set(prev.map(p => p._id));
                const toAdd = [];
                mailboxBooks.forEach(book => {
                    const id = book && book._id ? book._id : `${mailbox._id}_${book.title || Math.random()}`;
                    if (!existingIds.has(id)) {
                        toAdd.push({
                            _id: id,
                            title: typeof book === 'string' ? book : book.title,
                            author: typeof book === 'string' ? undefined : book.author,
                            offeredBy: book.offeredBy ? (book.offeredBy.name || undefined) : undefined,
                            interestedCount: (book.interested || []).length || 0,
                            interestedByCurrent: (book.interested || []).some(u => {
                                if (!u) return false;
                                if (typeof u === 'string') return (u === (currentUser._id || currentUser.id));
                                return (u._id === (currentUser._id || currentUser.id) || u.id === (currentUser._id || currentUser.id));
                            }),
                            bookId: book._id || null,
                            mailbox: { id: mailbox._id, name: mailbox.name }
                        });
                    }
                });
                return [...toAdd, ...prev];
            });
        }
    };

    const addBook = (mailboxId) => {
        if (titleInput.trim() === "") {
            alert("Prosim vnesite naslov knjige!");
            return;
        }
        const tempId = `pending_${mailboxId}_${Date.now()}`;
        const newBookLocal = { title: titleInput.trim(), author: authorInput.trim(), tempId };
        setBooksList(prev => ({
            ...prev,
            [mailboxId]: [...(prev[mailboxId] || []), newBookLocal]
        }));

        // Also immediately show this pending book in the main books list for instant feedback
        const mailboxObj = mailboxes.find(m => m._id === mailboxId) || { name: "Neznan paketnik" };
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const previewEntry = {
            _id: tempId,
            title: newBookLocal.title,
            author: newBookLocal.author,
            offeredBy: currentUser.name || undefined,
            interestedCount: 0,
            interestedByCurrent: false,
            bookId: null,
            tempId,
            mailbox: { id: mailboxId, name: mailboxObj.name }
        };
        setBooks(prev => [previewEntry, ...prev]);
        setTitleInput("");
        setAuthorInput("");
    };

    const removeBook = (mailboxId, index) => {
        // Remove from local pending list
        let removed = null;
        setBooksList(prev => {
            const list = prev[mailboxId] || [];
            removed = list[index];
            return {
                ...prev,
                [mailboxId]: list.filter((_, i) => i !== index)
            };
        });

        // Also remove preview entry from main books list if it was pending
        if (removed && removed.tempId) {
            setBooks(prev => prev.filter(b => b.tempId !== removed.tempId));
        }
    };

    const submitBooks = async (mailboxId) => {
        try {
            const booksPayload = booksList[mailboxId] || [];
            if (booksPayload.length === 0) {
                alert("Dodajte vsaj eno knjigo!");
                return;
            }

            await axios.post(
                `http://localhost:5000/api/mailboxes/${mailboxId}/books`,
                { books: booksPayload },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );

            alert("Knjige uspešno dodane!");
            setBooksList(prev => ({
                ...prev,
                [mailboxId]: []
            }));
            setSelectedMailboxId(null);

            // Refresh mailboxes and derived books
            fetchMailboxes();
        } catch (err) {
            alert("Napaka pri dodajanju knjig: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <Header />

            <div style={{ padding: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <h1>Dashboard</h1>
                        <p>Pregled poštnih paketnikov, odklep in hitri dostop do profila.</p>
                    </div>
                </div>

            {/* Če pride do napake, jo izpišemo uporabniku namesto crasha */}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            {/* Books list shown as primary view */}
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
                                        {b.interestedByCurrent ? "You\'re interested" : "I'm interested"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Existing mailbox list below for unlock/add actions */}
            {mailboxes.length === 0 && !error ? (
                <p>Ni najdenih paketnikov.</p>
            ) : (
                mailboxes.map(mailbox => (
                    <div key={mailbox._id} style={{ marginBottom: 18, padding: 18, border: "1px solid #ddd", borderRadius: 12 }}>
                        <h3>{mailbox.name}</h3>
                        <p>{mailbox.location}</p>
                        <p style={{ color: "#555" }}><strong>Ustvaril:</strong> {mailbox.owner?.name || "Neznan"} | <strong>Ustvarjeno:</strong> {new Date(mailbox.createdAt).toLocaleDateString("sl-SI")}</p>
                        
                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                            <button onClick={() => unlock(mailbox._id)} style={{ padding: "8px 16px", background: "#1d6b3d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                Unlock
                            </button>
                            <button onClick={() => toggleAdd(mailbox)} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                {selectedMailboxId === mailbox._id ? "Zapri" : "Dodaj knjige"}
                            </button>
                        </div>

                        {selectedMailboxId === mailbox._id && (
                            <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
                                <h4>Dodaj knjige (naslov + avtor)</h4>
                                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                    <input 
                                        type="text"
                                        placeholder="Naslov knjige"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addBook(mailbox._id)}
                                        style={{ flex: 1, padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc" }}
                                    />
                                    <input 
                                        type="text"
                                        placeholder="Avtor (opcijsko)"
                                        value={authorInput}
                                        onChange={(e) => setAuthorInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addBook(mailbox._id)}
                                        style={{ width: 220, padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc" }}
                                    />
                                    <button onClick={() => addBook(mailbox._id)} style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                        Dodaj
                                    </button>
                                </div>

                                {booksList[mailbox._id] && booksList[mailbox._id].length > 0 && (
                                    <div>
                                        <h5>Knjige na seznamu:</h5>
                                        <ul style={{ marginBottom: 12, paddingLeft: 20 }}>
                                            {booksList[mailbox._id].map((book, index) => (
                                                <li key={index} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span>{book.title}{book.author ? ` — ${book.author}` : ""}</span>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button 
                                                            onClick={() => removeBook(mailbox._id, index)}
                                                            style={{ padding: "4px 8px", background: "#dc2626", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                                                        >
                                                            Odstrani
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <button 
                                            onClick={() => submitBooks(mailbox._id)}
                                            style={{ padding: "10px 16px", background: "#059669", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}
                                        >
                                            Pošlji knjige
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
        </>
    );
}

export default Dashboard;