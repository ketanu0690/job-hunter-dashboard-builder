
const linkedinService = require('./service');

async function runLinkedinAutomation(req, res) {
  console.log("came herere linkedin controller")
  try {
    const parameters = req.body;
    
    // Validate request
    if (!parameters) {
      return res.status(400).json({
        success: false,
        message: "Missing automation parameters"
      });
    }

    // Run the automation
    const result = await linkedinService.runAutomation(parameters);
    
    // Return the response
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("LinkedIn controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while running LinkedIn automation",
      error: error.message
    });
  }
}

module.exports = {
  runLinkedinAutomation
};
