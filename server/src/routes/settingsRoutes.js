// server/src/routes/settingsRoutes.js
const express = require('express');
const ViewerSetting = require('../models/viewerSettings');

const router = express.Router();

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
