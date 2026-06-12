const axios    = require("axios");
const FormData = require("form-data");
const fs       = require("fs");

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || "http://localhost:8000/verify-face";

async function verifyFace(registeredImagePath, selfiePath) {
    let response;

    try {
        // BUG FIX: preverimo oba podata pred klicem servisa
        
        if (!fs.existsSync(registeredImagePath)) {
      return {
        verified: false,
        error: "Registered face image file does not exist",
        path: registeredImagePath
      };
    }

    if (!fs.existsSync(selfiePath)) {
      return {
        verified: false,
        error: "Selfie image file does not exist",
        path: selfiePath
      };
    }

        const form = new FormData();
        form.append("registered_image", fs.createReadStream(registeredImagePath));
        form.append("selfie_image",     fs.createReadStream(selfiePath));

        // BUG FIX: timeout da ne čakamo večno če servis ne odgovori
        response = await axios.post(FACE_SERVICE_URL, form, {
            headers: form.getHeaders(),
            timeout: 15000  // 15 sekund
        });

        if (!response || !response.data) {
            throw new Error("Neveljaven odziv iz face verify servisa.");
        }

        return response.data;
    } catch (err) {
        console.error("Error calling face verification service:", err.message);
        return { verified: false, error: "Napaka pri preverjanju obraza: " + err.message };
    }
}

module.exports = verifyFace;
