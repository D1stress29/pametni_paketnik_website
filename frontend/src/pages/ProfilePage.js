import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [mailboxes, setMailboxes] = useState([]);
    const [selectedMailbox, setSelectedMailbox] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedMailbox, setExpandedMailbox] = useState(null);
    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");
    const [booksList, setBooksList] = useState({});

    useEffect(() => {
        fetchProfile();
        fetchMailboxes();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users/me", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            setUser(res.data);
            setSelectedMailbox(res.data.preferredMailbox?._id || "");
        } catch (err) {
            setMessage("Napaka pri nalaganju profila. Prosim se ponovno prijavite.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMailboxes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/mailboxes", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            setMailboxes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const savePreferredMailbox = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await axios.put(
                "http://localhost:5000/api/users/me",
                { preferredMailbox: selectedMailbox || null },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );
            setUser(res.data);
            setMessage("Najljubši paketnik je bil shranjen.");
        } catch (err) {
            setMessage("Napaka pri shranjevanju izbrane lokacije.");
        } finally {
            setSaving(false);
        }
    };

    const toggleAddBooks = (mailboxId) => {
        setExpandedMailbox(expandedMailbox === mailboxId ? null : mailboxId);
    };

    const addBook = (mailboxId) => {
        if (titleInput.trim() === "") {
            alert("Prosim vnesite naslov knjige!");
            return;
        }
        const newBook = { title: titleInput.trim(), author: authorInput.trim() };
        setBooksList(prev => ({
            ...prev,
            [mailboxId]: [...(prev[mailboxId] || []), newBook]
        }));
        setTitleInput("");
        setAuthorInput("");
    };

    const removeBook = (mailboxId, index) => {
        setBooksList(prev => ({
            ...prev,
            [mailboxId]: (prev[mailboxId] || []).filter((_, i) => i !== index)
        }));
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
            setExpandedMailbox(null);
            fetchMailboxes();
        } catch (err) {
            alert("Napaka pri dodajanju knjig: " + (err.response?.data?.message || err.message));
        }
    };

    const renderItems = (mailbox) => {
        if (!mailbox.items || mailbox.items.length === 0) {
            return <span style={{ color: "#666" }}>Brez predmetov</span>;
        }
        return (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
                {mailbox.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        );
    };

    return (
        <div style={{ padding: 40, maxWidth: 960, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div>
                    <h1>Profil uporabnika</h1>
                    <p>Pregled vaših podatkov, izbira paketnika za knjige in seznam pametnih paketnikov.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: "none", padding: "12px 18px", background: "#1d6b3d", color: "white", borderRadius: 10 }}>
                    Nazaj na Dashboard
                </Link>
            </div>

            {loading && <p>Nalagam profil ...</p>}
            {message && <p style={{ color: message.includes("Napaka") ? "#a00" : "#146" }}>{message}</p>}

            {user && (
                <div style={{ marginTop: 24, display: "grid", gap: 20 }}>
                    <div style={{ padding: 24, borderRadius: 16, border: "1px solid #d9e6d3", background: "#f7fff4" }}>
                        <h2>O uporabniku</h2>
                        <p><strong>Ime:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Vloga:</strong> {user.role}</p>
                        <p><strong>Ustvarjen:</strong> {new Date(user.createdAt).toLocaleString("sl-SI")}</p>
                        <p><strong>Izbran paketnik za knjige:</strong> {user.preferredMailbox ? `${user.preferredMailbox.name} (${user.preferredMailbox.location})` : "Ni izbranega paketnika"}</p>
                    </div>

                    <div style={{ padding: 24, borderRadius: 16, border: "1px solid #d9e6d3" }}>
                        <h2>Izberi paketnik za svoje knjige</h2>
                        <select
                            value={selectedMailbox}
                            onChange={(e) => setSelectedMailbox(e.target.value)}
                            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfe5d0", marginBottom: 14 }}
                        >
                            <option value="">-- Izberi paketnik --</option>
                            {mailboxes.map(mailbox => (
                                <option key={mailbox._id} value={mailbox._id}>
                                    {mailbox.name} — {mailbox.location}
                                </option>
                            ))}
                        </select>
                        <button onClick={savePreferredMailbox} disabled={saving} style={{ padding: "12px 18px", background: "#1d6b3d", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
                            {saving ? "Shranjujem..." : "Shrani izbrani paketnik"}
                        </button>
                    </div>

                    <div style={{ padding: 24, borderRadius: 16, border: "1px solid #d9e6d3" }}>
                        <h2>Seznam pametnih paketnikov in dodajanje knjig</h2>
                        {mailboxes.length === 0 ? (
                            <p>Ni najdenih paketnikov.</p>
                        ) : (
                            mailboxes.map(mailbox => (
                                <div key={mailbox._id} style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                                    <h3 style={{ margin: 0 }}>{mailbox.name}</h3>
                                    <p style={{ margin: "6px 0" }}>{mailbox.location}</p>
                                    <p style={{ margin: "6px 0", color: "#555" }}><strong>Ustvaril:</strong> {mailbox.owner?.name || "Neznan"} | <strong>Ustvarjeno:</strong> {new Date(mailbox.createdAt).toLocaleDateString("sl-SI")}</p>

                                    <button
                                        onClick={() => toggleAddBooks(mailbox._id)}
                                        style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginTop: 10 }}
                                    >
                                        {expandedMailbox === mailbox._id ? "Zapri" : "Dodaj knjige"}
                                    </button>

                                    {expandedMailbox === mailbox._id && (
                                        <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
                                            <h4>Dodaj knjige (naslov + avtor)</h4>
                                            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Naslov knjige"
                                                    value={titleInput}
                                                    onChange={(e) => setTitleInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && addBook(mailbox._id)}
                                                    style={{ flex: 1, minWidth: 150, padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc" }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Avtor (opcijsko)"
                                                    value={authorInput}
                                                    onChange={(e) => setAuthorInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && addBook(mailbox._id)}
                                                    style={{ minWidth: 150, padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc" }}
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
                                                                <button
                                                                    onClick={() => removeBook(mailbox._id, index)}
                                                                    style={{ padding: "4px 8px", background: "#dc2626", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                                                                >
                                                                    Odstrani
                                                                </button>
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
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
