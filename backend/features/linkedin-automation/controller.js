const linkedinService = require("./linkdinEasy");

/**
 * Controller to run LinkedIn automation
 */
async function runLinkedinAutomation(req, res) {
  console.log("📥 Incoming LinkedIn automation request");

  try {
    const { email, password, positions, locations } = req.body;

    // ✅ Validate required fields
    if (
      !email ||
      !password ||
      !Array.isArray(positions) ||
      !Array.isArray(locations)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing or invalid parameters: email, password, positions[], locations[]",
      });
    }

    // ✅ Execute the automation logic
    const result = await linkedinService.runAutomation({
      email,
      password,
      positions,
      locations,
    });

    // ✅ Respond based on service result
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error("❌ LinkedIn automation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while running LinkedIn automation",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

module.exports = {
  runLinkedinAutomation,
};
