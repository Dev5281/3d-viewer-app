// server/src/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Use memory storage for Vercel (ephemeral file system)
// For production, consider using cloud storage (S3, Cloudinary, Vercel Blob)
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = ['.glb', '.gltf'];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowed.includes(ext));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

router.post('/', upload.single('model'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Invalid file type' });
  
  try {
    // Convert file buffer to data URL for immediate use
    // This works on Vercel since we don't need persistent storage
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'model/gltf-binary';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Also try to save to disk for local development
    if (process.env.NODE_ENV !== 'production' || process.env.USE_DISK_STORAGE === 'true') {
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = path.extname(req.file.originalname);
      const filename = `${path.basename(req.file.originalname, ext)}-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      return res.json({ fileUrl, dataUrl }); // Return both for compatibility
    }
    
    // For Vercel/production, return data URL
    res.json({ fileUrl: dataUrl, isDataUrl: true });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;
