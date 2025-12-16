// server/src/routes/settingsRoutes.js
const express = require('express');
const ViewerSetting = require('../models/viewerSettings');

const router = express.Router();

// Handle OPTIONS preflight requests explicitly
router.options('/', (req, res) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  res.sendStatus(200);
});

router.post('/', async (req, res) => {
  try {
    const { backgroundColor, wireframe, modelUrl } = req.body;
    const setting = await ViewerSetting.create({
      backgroundColor,
      wireframe,
      modelUrl
    });
    res.json(setting);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

router.get('/', async (req, res) => {
  try {
    const latest = await ViewerSetting.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
