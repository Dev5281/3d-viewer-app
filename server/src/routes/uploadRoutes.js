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
  
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    req.fileValidationError = `File type ${ext} not allowed. Please upload a .glb or .gltf file.`;
    cb(new Error(req.fileValidationError), false);
  }
}

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
}); 

// Error handler middleware for multer errors
router.post('/', (req, res, next) => {
  upload.single('model')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          error: 'File too large. Maximum file size is 50MB.' 
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          error: 'Unexpected file field. Please use the field name "model".' 
        });
      }
      return res.status(400).json({ 
        error: `Upload error: ${err.message}` 
      });
    }
    next();
  });
}, (req, res) => {
  // Handle multer errors
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  
  if (!req.file) {
    console.error('No file received. Request body keys:', Object.keys(req.body || {}));
    return res.status(400).json({ error: 'No file received. Please ensure you are uploading a .glb or .gltf file.' });
  }
  
  try {
    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    });
    
    // Convert file buffer to data URL for immediate use
    // This works on Vercel since we don't need persistent storage
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'model/gltf-binary';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    console.log('Data URL created, length:', dataUrl.length);
    
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
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: `Failed to process file: ${error.message}` });
  }
});

module.exports = router;
