const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function verifyFace(registeredImagePath, selfiePath) {
  try {
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
    console.log("REGISTERED EXISTS:", fs.existsSync(registeredImagePath));
console.log("SELFIE EXISTS:", fs.existsSync(selfiePath));

    form.append("registered_image", fs.createReadStream(registeredImagePath));
    form.append("selfie_image", fs.createReadStream(selfiePath));

    const response = await axios.post(
      "http://localhost:8000/verify-face",
      form,
      { headers: form.getHeaders() }
    );

   
    return response.data;

  } catch (err) {
    console.error("Face verification error:", err.message);
    return { verified: false, error: err.message };
  }
}

module.exports = verifyFace;

