const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    method: req.method,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']
  });
  next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    console.log('OPTIONS preflight request detected:', {
      path: req.path,
      url: req.url,
      originalUrl: req.originalUrl,
      origin: origin
    });
    
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    }
    
    console.log('Sending 200 for OPTIONS request');
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isVercelOrigin = origin && (origin.includes('.vercel.app') || origin.includes('vercel.app'));
  
  if (origin && (isVercelOrigin || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      console.log('CORS: No origin, allowing request');
      return callback(null, true);
    }
    
    console.log('CORS: Checking origin:', origin);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    const isVercelDomain = /https?:\/\/[^/]+\.vercel\.app/.test(origin) || 
                          origin.includes('vercel.app');
    
    const isAllowed = 
      allowedOrigins.indexOf(origin) !== -1 || 
      isVercelDomain ||
      process.env.NODE_ENV === 'development' ||
      !process.env.VERCEL;
    
    if (isAllowed) {
      console.log('CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('CORS: Origin not explicitly allowed:', origin);
      console.log('Allowed origins:', allowedOrigins);
      console.log('Is Vercel domain:', isVercelDomain);
      if (process.env.VERCEL) {
        console.log('CORS: Allowing on Vercel (permissive mode)');
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.options('/api/upload', (req, res) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  res.sendStatus(200);
});

app.options('/api/settings', (req, res) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  res.sendStatus(200);
});

app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

app.post('/upload', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/upload instead.',
    correctEndpoint: '/api/upload'
  });
});

app.get('/settings', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/settings instead.',
    correctEndpoint: '/api/settings'
  });
});

app.post('/settings', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/settings instead.',
    correctEndpoint: '/api/settings'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL,
    cors: 'enabled'
  });
});

app.post('/api/upload/test', (req, res) => {
  res.json({ 
    message: 'Upload endpoint is reachable',
    timestamp: new Date().toISOString(),
    bodySize: req.headers['content-length'] || 'unknown'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '3D Viewer API Server',
    status: 'running',
    endpoints: ['/api/upload', '/api/settings', '/api/health'],
    timestamp: new Date().toISOString(),
    vercel: !!process.env.VERCEL
  });
});

app.all('/test', (req, res) => {
  res.json({
    message: 'Test endpoint reached',
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    path: req.path,
    method: req.method
  });
});

app.use((req, res) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS in 404 handler (unexpected):', req.path);
    return res.sendStatus(200);
  }
  
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/api/upload', '/api/settings', '/api/health', '/api/upload/test']
  });
});

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
