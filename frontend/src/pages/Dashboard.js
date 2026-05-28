import { useEffect, useState } from "react";
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
            <h1>Dashboard</h1>

            {/* Če pride do napake, jo izpišemo uporabniku namesto crasha */}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            {mailboxes.length === 0 && !error ? (
                <p>Ni najdenih paketnikov.</p>
            ) : (
                mailboxes.map(mailbox => (
                    <div key={mailbox._id}>
                        <h3>{mailbox.name}</h3>
                        <p>{mailbox.location}</p>

                        <button onClick={() => unlock(mailbox._id)}>
                            Unlock
                        </button>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;