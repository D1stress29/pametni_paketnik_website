const axios    = require("axios");
const FormData = require("form-data");
const fs       = require("fs");

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || "http://localhost:8000/verify-face";

async function verifyFace(registeredImagePath, selfiePath) {
    // BUG FIX: preverimo oba podata pred klicem servisa
    if (!registeredImagePath || !fs.existsSync(registeredImagePath)) {
        return { verified: false, error: "Registrirana slika ne obstaja.", path: registeredImagePath };
    }
    if (!selfiePath || !fs.existsSync(selfiePath)) {
        return { verified: false, error: "Selfie slika ne obstaja.", path: selfiePath };
    }

    const form = new FormData();
    form.append("registered_image", fs.createReadStream(registeredImagePath));
    form.append("selfie_image",     fs.createReadStream(selfiePath));

    // BUG FIX: timeout da ne čakamo večno če servis ne odgovori
    const response = await axios.post(FACE_SERVICE_URL, form, {
        headers: form.getHeaders(),
        timeout: 15000  // 15 sekund
    });

    return response.data;
}

module.exports = verifyFace;
