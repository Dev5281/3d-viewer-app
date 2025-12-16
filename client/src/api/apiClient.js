
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
// Normalize the URL to remove trailing slashes
const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_BASE = getApiBase();

// Create axios instance with increased timeout for large file uploads
const apiClient = axios.create({
  timeout: 120000, // 2 minutes timeout for large file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadModel = async (file) => {
  try {
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
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
    
    // Prefer dataUrl for Vercel (serverless), fallback to fileUrl for local development
    const url = data.dataUrl || data.fileUrl;
    
    if (!url) {
      throw new Error('Upload successful but no file URL returned from server');
    }
    
    return url;
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.statusText || 'Upload failed';
      throw new Error(`Upload failed: ${errorMessage}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Upload failed: No response from server. Please check your connection.');
    } else {
      // Error in request setup
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
