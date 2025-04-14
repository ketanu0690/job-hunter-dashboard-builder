const express = require("express");
const axios = require("axios"); // Import axios for HTTP requests
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("✅ Incoming request to /linkedin-automation");

  try {
    // Call the webhook
    const webhookUrl = "https://localhost:7296/webhook/linkedin/start"; // Webhook URL
    const payload = {
      configPath: "C:\\WIS\\Personal\\job-hunter-dashboard-builder\\shared-services\\config.yml", // Config path
      callbackUrl: process.env.VITE_BACKEND_URL || "http://localhost:3000", // Callback URL from .env
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Webhook called successfully:", response.data);

    // Respond to the client
    res.status(200).json({
      message: "Webhook called successfully!",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error calling webhook:", error.message);

    // Respond with an error
    res.status(500).json({
      message: "Failed to call webhook",
      error: error.message,
    });
  }
});

module.exports = router;