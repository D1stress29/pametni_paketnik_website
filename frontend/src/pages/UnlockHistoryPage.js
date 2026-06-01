import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function UnlockHistoryPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/unlock-logs/my", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            setLogs(res.data);
        } catch (err) {
            setError("Napaka pri nalaganju zgodovine.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (iso) => new Date(iso).toLocaleString("sl-SI");

    return (
        <>
            <Header />

            <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
                <h1>Moja zgodovina odklepov</h1>

                {loading && <p>Nalagam...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && logs.length === 0 && (
                <p>Še ni zabeleženih odklepov.</p>
            )}

            {logs.map((log) => (
                <div key={log._id} style={{
                    border: "1px solid #ccc",
                    borderRadius: 10,
                    padding: "16px 20px",
                    marginTop: 16,
                    background: log.success ? "#f4fff4" : "#fff4f4"
                }}>
                    <strong>{log.mailbox?.name || "Neznan paketnik"}</strong>
                    <span style={{ marginLeft: 12, color: "#666", fontSize: 14 }}>
                        {log.mailbox?.location}
                    </span>
                    <div style={{ marginTop: 6, fontSize: 14, color: "#444" }}>
                        🕐 {formatDate(log.timestamp)} &nbsp;|&nbsp;
                        Metoda: <code>{log.unlockMethod}</code> &nbsp;|&nbsp;
                        {log.success ? "✅ Uspešno" : "❌ Neuspešno"}
                    </div>
                </div>
            ))}
        </div>
    </>
    );
}

export default UnlockHistoryPage;