
const express = require('express');
const router = express.Router();
const applyConfigService = require('./service');
const multer = require('multer');
const upload = multer();

/**
 * @swagger
 * /api/apply-config:
 *   post:
 *     summary: Apply configuration and trigger automation
 *     description: Saves the provided JSON configuration as YAML and triggers automation process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuration saved and automation triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: Detailed message about the operation
 *                 automationSummary:
 *                   type: object
 *                   description: Summary of the automation configuration
 *                 logs:
 *                   type: array
 *                   description: Logs from the automation process
 */
router.post('/api/apply-config', upload.none(), async (req, res) => {
  console.log('Received POST /api/apply-config request:', req.body);

  try {
    const configData = req.body;
    
    if (!configData) {
      return res.status(400).json({ 
        status: 'error',
        message: 'No configuration data provided.'
      });
    }
    
    // Save config and trigger automation
    const result = await applyConfigService.applyConfig(configData);
    
    return res.json(result);
  } catch (error) {
    console.error('Error handling /api/apply-config:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Failed to process configuration.',
      error: error.message
    });
  }
});

module.exports = router;
