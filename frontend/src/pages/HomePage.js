import Header from "../components/Header";
import { Link } from "react-router-dom";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');

    :root {
        color-scheme: light;
        font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        background: #eef7ec;
        color: #1f3d2e;
    }
    * { box-sizing: border-box; }
    body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    main {
        flex: 1;
        padding: 56px 24px 64px;
    }
    .hero {
        max-width: 940px;
        margin: 0 auto;
        background: #f9fff4;
        border: 1.5px solid #dcedd8;
        border-radius: 28px;
        padding: 48px 44px;
        box-shadow: 0 24px 60px rgba(29,107,61,0.13);
    }
    .hero-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
        border-radius: 99px;
        padding: 4px 14px;
        font-size: 0.8rem;
        font-weight: 700;
        font-family: 'DM Mono', monospace;
        letter-spacing: 0.02em;
        margin-bottom: 20px;
    }
    .hero h1 {
        margin: 0 0 18px;
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        line-height: 1.07;
        letter-spacing: -0.04em;
        font-weight: 700;
        color: #1a2e1f;
    }
    .hero h1 span {
        color: #1d6b3d;
    }
    .hero > p {
        margin: 0 0 32px;
        max-width: 680px;
        font-size: 1.05rem;
        line-height: 1.8;
        color: #2c4d33;
    }
    .cta-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 40px;
    }
    .btn-cta {
        padding: 13px 26px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        transition: transform 0.18s, box-shadow 0.18s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(29,107,61,0.2); }
    .btn-cta.primary { background: #1d6b3d; color: white; }
    .btn-cta.outline { background: white; color: #1d6b3d; border: 1.5px solid #cfe5d0; }

    /* Feature cards */
    .features {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
        margin-top: 12px;
    }
    .feature-card {
        background: white;
        border: 1.5px solid #cfe5d0;
        border-radius: 18px;
        padding: 24px;
        transition: box-shadow 0.2s, transform 0.2s;
    }
    .feature-card:hover {
        box-shadow: 0 8px 28px rgba(29,107,61,0.13);
        transform: translateY(-2px);
    }
    .feature-icon {
        font-size: 2rem;
        margin-bottom: 12px;
        display: block;
    }
    .feature-card h3 {
        font-size: 0.98rem;
        font-weight: 700;
        color: #1e4e2f;
        margin: 0 0 8px;
    }
    .feature-card p {
        font-size: 0.85rem;
        color: #3c5b42;
        line-height: 1.65;
        margin: 0;
    }

    /* Mailbox showcase */
    .mailbox-showcase {
        background: white;
        border: 1.5px solid #cfe5d0;
        border-radius: 20px;
        padding: 28px;
        margin-top: 28px;
    }
    .mailbox-showcase h2 {
        margin: 0 0 20px;
        font-size: 1.15rem;
        color: #1e4e2f;
        font-weight: 700;
    }
    .mailbox-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid #eef7ec;
    }
    .mailbox-row:last-child { border-bottom: none; }
    .mailbox-dot {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #1d6b3d, #47a45d);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        flex-shrink: 0;
    }
    .mailbox-row-info strong {
        display: block;
        font-size: 0.95rem;
        color: #1a2e1f;
    }
    .mailbox-row-info span {
        font-size: 0.8rem;
        color: #4a6352;
    }
    .status-pill {
        margin-left: auto;
        font-size: 0.74rem;
        font-weight: 700;
        font-family: 'DM Mono', monospace;
        padding: 4px 10px;
        border-radius: 99px;
    }
    .status-pill.locked { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .status-pill.free   { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

    footer {
        background: #1d6b3d;
        color: #e9f7e8;
        text-align: center;
        font-size: 0.9rem;
        padding: 20px 24px;
    }
`;

function HomePage() {
    return (
        <>
            <style>{styles}</style>
            <Header />

            <main>
                <section className="hero">
                    <div className="hero-eyebrow">
                        📦 Pametna izmenjava knjig
                    </div>

                    <h1>Škatlarji – <span>paketniki</span> za skupnost</h1>

                    <p>
                        Skupnost paketnikov, kjer si sosedje izmenjujejo knjige, pošto in pakete.
                        Vsak paketnik je dostopen z mobilno aplikacijo ali prepoznavanjem obraza —
                        varno, enostavno, zeleno.
                    </p>

                    <div className="cta-row">
                        <Link to="/login" className="btn-cta primary">🔑 Prijava</Link>
                        <Link to="/register" className="btn-cta outline">📝 Registracija</Link>
                        <Link to="/dashboard" className="btn-cta outline">📚 Oglej si knjige</Link>
                    </div>

                    {/* Feature cards */}
                    <div className="features">
                        <div className="feature-card">
                            <span className="feature-icon">🔓</span>
                            <h3>Odklepanje na daljavo</h3>
                            <p>Odkleni paketnik direktno iz aplikacije — kadarkoli in od koderkoli.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📸</span>
                            <h3>Prepoznava obraza</h3>
                            <p>Prijava z 2FA in sliko obraza za dodatno varnost tvojih dostopov.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📚</span>
                            <h3>Izmenjava knjig</h3>
                            <p>Pusti knjigo v paketnik ali si izposodi od soseda. Skupnost si pomaga.</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📋</span>
                            <h3>Dnevnik dostopov</h3>
                            <p>Preveri kdaj in kako je bil paketnik odklenjen — popolna preglednost.</p>
                        </div>
                    </div>

                    {/* Paketniki showcase */}
                    <div className="mailbox-showcase">
                        <h2>📦 Primeri paketnikov v sistemu</h2>

                        <div className="mailbox-row">
                            <div className="mailbox-dot">📦</div>
                            <div className="mailbox-row-info">
                                <strong>Paketnik – Blok A</strong>
                                <span>Velenje, Naselje Kardeljev trg</span>
                            </div>
                            <span className="status-pill free">● Prost</span>
                        </div>

                        <div className="mailbox-row">
                            <div className="mailbox-dot">📦</div>
                            <div className="mailbox-row-info">
                                <strong>Paketnik – Knjižnica</strong>
                                <span>Velenje, Trg mladosti</span>
                            </div>
                            <span className="status-pill locked">● Zaklenjeno</span>
                        </div>

                        <div className="mailbox-row">
                            <div className="mailbox-dot">📦</div>
                            <div className="mailbox-row-info">
                                <strong>Paketnik – Šola</strong>
                                <span>Velenje, Šaleška cesta</span>
                            </div>
                            <span className="status-pill free">● Prost</span>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2026 Škatlarji – Pametni paketniki za skupnost</p>
            </footer>
        </>
    );
}

export default HomePage;
