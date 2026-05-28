import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [mailboxes, setMailboxes] = useState([]);
    const [error, setError] = useState(null); // Shranimo napako, da jo izpišemo v UI

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

    return (
        <div style={{ padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Pregled poštnih paketnikov, odklep in hitri dostop do profila.</p>
                </div>
                <Link to="/profile" style={{ textDecoration: "none", padding: "10px 16px", borderRadius: 10, background: "#1d6b3d", color: "white" }}>
                    Moj profil
                </Link>
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
                        <button onClick={() => unlock(mailbox._id)}>
                            Unlock
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;