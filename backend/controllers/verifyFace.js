const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function verifyFace(registeredImagePath, selfiePath) {
  try {
    const form = new FormData();

    form.append("registered_image", fs.createReadStream(registeredImagePath));
    form.append("selfie_image", fs.createReadStream(selfiePath));

    const response = await axios.post(
      "http://localhost:5000/verify-face",
      form,
      { headers: form.getHeaders() }
    );

    return response.data;

  } catch (err) {
    console.error("Face verification error:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = verifyFace;

