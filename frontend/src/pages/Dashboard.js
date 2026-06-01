import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

function Dashboard() {
    const [mailboxes, setMailboxes] = useState([]);
    const [error, setError] = useState(null); // Shranimo napako, da jo izpišemo v UI
    const [selectedMailboxId, setSelectedMailboxId] = useState(null);
    const [bookName, setBookName] = useState("");
    const [booksList, setBooksList] = useState({});

    useEffect(() => {
        fetchMailboxes();
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

    const addBook = (mailboxId) => {
        if (bookName.trim() === "") {
            alert("Prosim vnesite ime knjige!");
            return;
        }
        
        setBooksList(prev => ({
            ...prev,
            [mailboxId]: [...(prev[mailboxId] || []), bookName]
        }));
        setBookName("");
    };

    const removeBook = (mailboxId, index) => {
        setBooksList(prev => ({
            ...prev,
            [mailboxId]: prev[mailboxId].filter((_, i) => i !== index)
        }));
    };

    const submitBooks = async (mailboxId) => {
        try {
            const books = booksList[mailboxId] || [];
            if (books.length === 0) {
                alert("Dodajte vsaj eno knjigo!");
                return;
            }
            
            await axios.post(
                `http://localhost:5000/api/mailboxes/${mailboxId}/books`,
                { books },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );
            alert("Knjige uspešno dodane!");
            setBooksList(prev => ({
                ...prev,
                [mailboxId]: []
            }));
            setSelectedMailboxId(null);
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
                            <button onClick={() => setSelectedMailboxId(selectedMailboxId === mailbox._id ? null : mailbox._id)} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                {selectedMailboxId === mailbox._id ? "Zapri" : "Dodaj knjige"}
                            </button>
                        </div>

                        {selectedMailboxId === mailbox._id && (
                            <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
                                <h4>Dodaj imena knjig</h4>
                                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                    <input 
                                        type="text"
                                        placeholder="Vnesite ime knjige"
                                        value={bookName}
                                        onChange={(e) => setBookName(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addBook(mailbox._id)}
                                        style={{ flex: 1, padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc" }}
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
                                                    <span>{book}</span>
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
        </>
    );
}

export default Dashboard;