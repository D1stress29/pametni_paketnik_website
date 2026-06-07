const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    // BUG FIX: preverimo da header sploh obstaja in ima pravo obliko
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Manjka avtentikacijski žeton." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Žeton je prazen." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        // BUG FIX: ločimo med expirano in neveljavno žetonom
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Seja je potekla. Prosim, prijavite se znova." });
        }
        return res.status(401).json({ message: "Neveljaven žeton." });
    }
};
