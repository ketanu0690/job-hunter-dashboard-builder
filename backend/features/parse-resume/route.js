const express = require('express');
const multer = require('multer');

//import { parseResume } from './service.js';
const { parseResume } = require('./service');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory for now

router.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }
    const parsedData = await parseResume(req.file);
    return res.json(parsedData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ error: 'Failed to parse resume.' });
  }
});

module.exports = router;