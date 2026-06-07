import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

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
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setUser(res.data);
            setSelectedMailbox(res.data.preferredMailbox?._id || "");
        } catch {
            setMessage("Napaka pri nalaganju profila.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMailboxes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/mailboxes", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setMailboxes(res.data);
        } catch {
            setMessage("Ni mogoče naložiti paketnikov.");
        }
    };

    const savePreferredMailbox = async () => {
        setSaving(true);

        try {
            const res = await axios.put(
                "http://localhost:5000/api/users/me",
                { preferredMailbox: selectedMailbox || null },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );

            setUser(res.data);
            setMessage("Najljubši paketnik shranjen.");
        } catch {
            setMessage("Napaka pri shranjevanju.");
        } finally {
            setSaving(false);
        }
    };

    const toggleAddBooks = (id) => {
        setExpandedMailbox(prev => (prev === id ? null : id));
    };

    const addBook = (mailboxId) => {
        if (!titleInput.trim()) return;

        setBooksList(prev => ({
            ...prev,
            [mailboxId]: [
                ...(prev[mailboxId] || []),
                { title: titleInput.trim(), author: authorInput.trim() }
            ]
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
        const booksPayload = booksList[mailboxId] || [];
        if (!booksPayload.length) return;

        await axios.post(
            `http://localhost:5000/api/mailboxes/${mailboxId}/books`,
            { books: booksPayload },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );

        setBooksList(prev => ({ ...prev, [mailboxId]: [] }));
        setExpandedMailbox(null);
        fetchMailboxes();
    };

    if (loading) return <p style={{ padding: 40 }}>Nalaganje...</p>;

    return (
        <>
            <Header />

            <div style={{ padding: 40, maxWidth: 960, margin: "0 auto" }}>

                {/* HEADER */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20
                }}>
                    <div>
                        <h1>Profil</h1>
                        <p>Pregled uporabnika in upravljanje knjig</p>
                    </div>

                    <Link to="/dashboard">
                        <button
                            style={{
                                padding: "8px 12px",
                                background: "#1f2937",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer"
                            }}
                        >
                            ← Nazaj na Dashboard
                        </button>
                    </Link>
                </div>

                {message && (
                    <p style={{ color: "red", marginBottom: 10 }}>{message}</p>
                )}

                {/* USER INFO CARD */}
                {user && (
                    <div style={{
                        padding: 16,
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        background: "white",
                        marginBottom: 20
                    }}>
                        <h3>Uporabniški podatki</h3>

                        <p><b>Ime:</b> {user.name}</p>
                        <p><b>Email:</b> {user.email}</p>
                        <p><b>Vloga:</b> {user.role}</p>
                        <p><b>Ustvarjen:</b> {new Date(user.createdAt).toLocaleString()}</p>

                        <p>
                            <b>Najljubši paketnik:</b>{" "}
                            {user.preferredMailbox?.name || "Ni izbran"}
                        </p>
                    </div>
                )}

                {/* MAILBOX SELECT */}
                <div style={{
                    padding: 16,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    background: "white",
                    marginBottom: 30
                }}>
                    <h3>Izberi najljubši paketnik</h3>

                    <select
                        value={selectedMailbox}
                        onChange={(e) => setSelectedMailbox(e.target.value)}
                        style={{ padding: 8, marginRight: 10 }}
                    >
                        <option value="">-- izberi --</option>
                        {mailboxes.map(m => (
                            <option key={m._id} value={m._id}>
                                {m.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={savePreferredMailbox}
                        disabled={saving}
                        style={{
                            padding: "8px 12px",
                            background: "#f97316",
                            color: "white",
                            border: "none",
                            borderRadius: 6
                        }}
                    >
                        Shrani
                    </button>
                </div>

                {/* MAILBOXES */}
                <h2>Paketniki</h2>

                {mailboxes.map(mailbox => (
                    <div key={mailbox._id} style={{
                        padding: 14,
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        background: "white",
                        marginBottom: 10
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <strong>{mailbox.name}</strong>

                            <button
                                onClick={() => toggleAddBooks(mailbox._id)}
                                style={{
                                    padding: "6px 10px",
                                    background: "#f97316",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6
                                }}
                            >
                                {expandedMailbox === mailbox._id ? "Zapri" : "Dodaj knjige"}
                            </button>
                        </div>

                        {expandedMailbox === mailbox._id && (
                            <div style={{ marginTop: 10 }}>
                                <input
                                    placeholder="Naslov"
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    style={{ padding: 8, marginRight: 6 }}
                                />

                                <input
                                    placeholder="Avtor"
                                    value={authorInput}
                                    onChange={(e) => setAuthorInput(e.target.value)}
                                    style={{ padding: 8 }}
                                />

                                <button onClick={() => addBook(mailbox._id)} style={{ marginLeft: 10 }}>
                                    Dodaj
                                </button>

                                <ul>
                                    {(booksList[mailbox._id] || []).map((b, i) => (
                                        <li key={i}>
                                            {b.title} - {b.author}
                                            <button onClick={() => removeBook(mailbox._id, i)}>
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => submitBooks(mailbox._id)}
                                    style={{
                                        padding: "8px 12px",
                                        background: "#f97316",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6
                                    }}
                                >
                                    Pošlji
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default ProfilePage;