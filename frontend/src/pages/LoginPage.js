import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage({ defaultMode }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(defaultMode === "register");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            setMessage("Login successful. Redirecting to dashboard...");
            navigate("/dashboard");
        } catch (err) {
            const errorText = err.response?.data?.message || err.message;
            setMessage(`Login failed: ${errorText}`);
        }
    };

    const register = async () => {
        try {
            if (!name) {
                setMessage("Please enter your name to create a user.");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    role: "user"
                }
            );

            setMessage("Account created successfully. Please login.");
            setIsRegistering(false);
            setPassword("");
        } catch (err) {
            const errorText = err.response?.data?.error || err.response?.data?.message || err.message;
            setMessage(`Registration failed: ${errorText}`);
        }
    };

    return (
        <div style={{ padding: 40, maxWidth: 420 }}>
            <h1>{isRegistering ? "Create your account" : "Smart Mailbox Login"}</h1>

            {isRegistering && (
                <>
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <br /><br />
                </>
            )}

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={isRegistering ? register : login}>
                {isRegistering ? "Register" : "Login"}
            </button>

            <button
                style={{ marginLeft: 12 }}
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setMessage("");
                }}
            >
                {isRegistering ? "Back to Login" : "Create account"}
            </button>

            {message && (
                <div style={{ marginTop: 16, color: "#444" }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default LoginPage;