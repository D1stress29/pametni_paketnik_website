import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLogged(!!localStorage.getItem("token"));
        const onStorage = () => setIsLogged(!!localStorage.getItem("token"));
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLogged(false);
        navigate("/");
    };

    const container = {
        background: "linear-gradient(135deg, #1d6b3d 0%, #47a45d 100%)",
        padding: 16,
        color: "white",
    };

    const row = {
        maxWidth: 1160,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const brand = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontWeight: 700,
    };

    const actions = {
        display: "flex",
        gap: 12,
        alignItems: "center",
    };

    // Common button base for header buttons
    const HeaderButton = {
        textDecoration: "none",
        padding: "10px 16px",
        borderRadius: 999,
        display: "inline-block",
        fontWeight: 700,
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "1rem",
        lineHeight: 1,
        textAlign: "center",
    };

    const btnHome = {
        ...HeaderButton,
        background: "white",
        color: "#1d6b3d",
        border: "none",
    };

    const btnOutline = {
        ...HeaderButton,
        background: "rgba(255,255,255,0.18)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.35)",
    };

    const btnSolid = {
        ...HeaderButton,
        background: "#1d6b3d",
        color: "white",
        borderRadius: 999,
    };

    return (
        <div style={container}>
            <div style={row}>
                <div style={brand}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: 20 }}></i>
                    <span>Škatlarji</span>
                </div>

                <div style={actions}>
                    <Link to="/" style={btnHome}>Domov</Link>
                    <Link to="/history" style={btnOutline}>Dostopi</Link>

                    {isLogged ? (
                        <>
                            <Link to="/profile" style={btnSolid}>Moj profil</Link>
                            <button onClick={handleLogout} style={{ ...btnOutline, cursor: "pointer" }}>Odjava</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={btnOutline}>Prijava</Link>
                            <Link to="/register" style={btnOutline}>Registracija</Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Header;
