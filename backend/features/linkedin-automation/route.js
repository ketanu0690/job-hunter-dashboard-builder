
const express = require('express');
const linkedinController = require('./controller');

const router = express.Router();

/**
 * @swagger
 * /api/linkedin/apply:
 *   post:
 *     summary: Run LinkedIn Easy Apply automation
 *     description: Initiates automation to apply for jobs on LinkedIn based on provided parameters
 *     tags: [LinkedIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - positions
 *               - locations
 *             properties:
 *               email:
 *                 type: string
 *                 description: LinkedIn account email
 *               password:
 *                 type: string
 *                 description: LinkedIn account password
 *               positions:
 *                 type: array
 *                 description: Job positions to search for
 *                 items:
 *                   type: string
 *               locations:
 *                 type: array
 *                 description: Locations to search in
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Automation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.post('/api/linkedin/apply', linkedinController.runLinkedinAutomation);

module.exports = router;
