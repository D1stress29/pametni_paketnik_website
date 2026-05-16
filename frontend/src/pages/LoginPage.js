import { useState } from "react";
import axios from "axios";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            { email, password }
        );

        localStorage.setItem("token", res.data.token);
        alert("Logged in");
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Smart Mailbox Login</h1>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={login}>
                Login
            </button>
        </div>
    );
}

export default LoginPage;