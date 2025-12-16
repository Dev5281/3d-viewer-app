const mongoose = require('mongoose');

const viewerSettingSchema = new mongoose.Schema({
  backgroundColor: { type: String, default: '#222222' },
  wireframe: { type: Boolean, default: false },
  modelUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ViewerSetting', viewerSettingSchema);
