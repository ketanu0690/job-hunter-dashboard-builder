// features/linkedin-automation/route.js
const express = require("express");
const router = express.Router();
const { runLinkedinAutomation } = require("./controller");

router.post(
  "/",
  (req, res, next) => {
    console.log("✅ Incoming request to /linkedin-automation");
    next(); 
  },
  runLinkedinAutomation
);

module.exports = router;
