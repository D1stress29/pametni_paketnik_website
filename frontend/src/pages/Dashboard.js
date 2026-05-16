import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [mailboxes, setMailboxes] = useState([]);

    useEffect(() => {
        fetchMailboxes();
    }, []);

    const fetchMailboxes = async () => {

        const res = await axios.get(
            "http://localhost:5000/api/mailboxes",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );

        setMailboxes(res.data);
    };

    const unlock = async (id) => {

        await axios.post(
            `http://localhost:5000/api/mailboxes/${id}/unlock`,
            {
                userId: "USER_ID",
                method: "mobile-app"
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );

        alert("Unlocked");
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Dashboard</h1>

            {
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
            }
        </div>
    );
}

export default Dashboard;