
import axios from 'axios';

const getApiBase = () => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultUrl = isDevelopment 
    ? 'http://localhost:5000/api' 
    : 'https://threed-viewer-app-2.onrender.com/api';
  
  let url = import.meta.env.VITE_API_URL || defaultUrl;
  
  url = url.replace(/\/+$/, '');
  
  if (!url.endsWith('/api')) {
    console.warn(`VITE_API_URL doesn't end with /api. Current: ${url}. Adding /api automatically.`);
    url = url + '/api';
  }
  
  console.log('API Base URL:', url);
  return url;
};

const API_BASE = getApiBase();

const apiClient = axios.create({
  timeout: 120000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadModel = async (file) => {
  try {
    const fileSizeMB = file.size / 1024 / 1024;
    const maxSize = 50 * 1024 * 1024;
    const vercelLimit = 4.5 * 1024 * 1024;
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 50MB limit. Your file is ${fileSizeMB.toFixed(2)}MB`);
    }
    
    if (file.size > vercelLimit) {
      console.warn(`⚠️ File size (${fileSizeMB.toFixed(2)}MB) exceeds Vercel's 4.5MB limit. Upload may fail.`);
      throw new Error(`File too large for Vercel (4.5MB limit). Your file is ${fileSizeMB.toFixed(2)}MB. Please use a smaller file or upgrade to Vercel Pro.`);
    }

    const formData = new FormData();
    formData.append('model', file);
    
    const { data } = await apiClient.post(`${API_BASE}/upload`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    const url = data.dataUrl || data.fileUrl;
    
    if (!url) {
      throw new Error('Upload successful but no file URL returned from server');
    }
    
    return url;
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || error.response.statusText || 'Upload failed';
      throw new Error(`Upload failed: ${errorMessage}`);
    } else if (error.request) {
      throw new Error('Upload failed: No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Upload failed: Unknown error');
    }
  }
};

export const saveSettings = async (settings) => {
  const { data } = await axios.post(`${API_BASE}/settings`, settings);
  return data;
};

export const fetchSettings = async () => {
  const { data } = await axios.get(`${API_BASE}/settings`);
  return data;
};
