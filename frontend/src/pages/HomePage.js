import { Link } from "react-router-dom";

const styles = `
    :root {
        color-scheme: light;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #eef7ec;
        color: #1f3d2e;
    }
    * {
        box-sizing: border-box;
    }
    body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    header {
        background: linear-gradient(135deg, #1d6b3d 0%, #47a45d 100%);
        padding: 20px 24px;
        color: white;
    }
    .nav-row {
        max-width: 1160px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
    }
    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 700;
        font-size: 1.25rem;
    }
    .brand i {
        font-size: 1.6rem;
    }
    .nav-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    .nav-actions a {
        text-decoration: none;
        padding: 0.9rem 1.3rem;
        border-radius: 999px;
        font-weight: 600;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .nav-actions a:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 22px rgba(15, 82, 42, 0.18);
    }
    .btn-primary {
        background: white;
        color: #1d6b3d;
    }
    .btn-secondary {
        background: rgba(255, 255, 255, 0.18);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.35);
    }
    main {
        flex: 1;
        padding: 48px 24px;
    }
    .hero {
        max-width: 920px;
        margin: 0 auto;
        background: #f9fff4;
        border: 1px solid #dcedd8;
        border-radius: 28px;
        padding: 40px;
        box-shadow: 0 20px 50px rgba(29, 107, 61, 0.12);
    }
    .hero h1 {
        margin: 0 0 16px;
        font-size: clamp(2.1rem, 4vw, 3.2rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
    }
    .hero p {
        margin: 0 0 26px;
        max-width: 760px;
        font-size: 1.05rem;
        line-height: 1.8;
        color: #2c4d33;
    }
    .section-card {
        background: white;
        border: 1px solid #cfe5d0;
        border-radius: 20px;
        padding: 28px;
        margin-top: 28px;
    }
    .section-card h2 {
        margin-top: 0;
        font-size: 1.25rem;
        color: #1e4e2f;
    }
    .section-card p {
        margin: 16px 0 0;
        color: #3c5b42;
        line-height: 1.75;
    }
    footer {
        background: #1d6b3d;
        color: #e9f7e8;
        text-align: center;
        font-size: 0.95rem;
        padding: 18px 24px;
    }
`;

function HomePage() {
    return (
        <>
            <style>{styles}</style>
            <header>
                <div className="nav-row">
                    <div className="brand">
                        <i className="fa-solid fa-box-open"></i>
                        <span>Škatlarji</span>
                    </div>
                    <div className="nav-actions">
                        <Link to="/login" className="btn-primary">Prijava</Link>
                        <Link to="/register" className="btn-secondary">Registracija</Link>
                        <Link to="/history" className="btn-secondary">Dostopi do pošte</Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="hero">
                    <h1>Pametna rešitev za paketnik in poštne dostopne pravice</h1>
                    <p>Ta projekt predstavlja osnovni vmesnik za upravljanje dostopa do paketnika, uporabniške prijave in prihodnji seznam dostopov do pošte.</p>

                    <div id="access-list" className="section-card">
                        <h2>Seznam dostopov do pošte</h2>
                        <p>Seznam dostopov še ni ustvarjen. Ko bo ta funkcionalnost dodana, bo tukaj prikazan celoten pregled poštnih dostopov in njihovih statusov.</p>
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2026 Pametni PaketniKnjig. Zeleni in pregledni dostopi za pametni paketnik.</p>
            </footer>
        </>
    );
}

export default HomePage;
