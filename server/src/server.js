// server/src/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Configure CORS to allow requests from Vercel and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL, // Your Vercel frontend URL
    ].filter(Boolean);
    
    // Allow all Vercel preview and production URLs
    const isVercelDomain = origin.includes('.vercel.app') || origin.includes('vercel.app');
    
    // Check if origin is in allowed list or is a Vercel domain
    if (
      allowedOrigins.indexOf(origin) !== -1 || 
      isVercelDomain ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      // Log for debugging
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(console.error);
