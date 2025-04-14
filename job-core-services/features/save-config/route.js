const express = require('express');
const router = express.Router();
const saveConfigService = require('./service');

/**
 * @swagger
 * /api/save-config:
 *   post:
 *     summary: Save the job application automation configuration
 *     description: Saves the provided YAML configuration for the automation bot.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               yaml:
 *                 type: string
 *                 description: YAML configuration content
 *                 required: true
 *     responses:
 *       200:
 *         description: Configuration saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post('/api/save-config', async (req, res) => {
  console.log('Received POST /api/save-config request:', req.body);

  try {
    const { yaml: yamlContent } = req.body;
    if (!yamlContent) {
      return res.status(400).json({ error: 'No YAML config provided.' });
    }
    const result = await saveConfigService.saveConfig(yamlContent);
    return res.json(result);

    console.log('Result from saveConfig service:', result);

  } catch (error) {
    console.error('Error handling /api/save-config:', error);
    return res.status(500).json({ error: 'Failed to save configuration.' });
  }
});


/**
 * @swagger
 * /api/save-config:
 *   get:
 *     summary: Get the current job application automation configuration
 *     description: Reads and returns the content of the config.yml file.
 *     responses:
 *       200:
 *         description: Successfully retrieved the configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 config:
 *                   type: string
 *                   description: Content of the config.yml file
 *       404:
 *         description: Configuration file not found
 *       500:
 *         description: Error reading configuration file
 */
router.get('/api/save-config', async (req, res) => {

  try {
    const config = await saveConfigService.getConfig();
    console.log('Configuration read successfully:', config);
    return res.json({ config });
  } catch (error) {
    if (error.message === 'Config file not found') {
      return res.status(404).json({ error: 'Configuration file not found' });
    }
    console.error('Error reading config.yml:', error);
    return res.status(500).json({ error: 'Failed to read configuration file' });
  }
});

module.exports = router;