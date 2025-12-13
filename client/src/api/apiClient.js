
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
// Normalize the URL to remove trailing slashes
const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_BASE = getApiBase();

export const uploadModel = async (file) => {
  const formData = new FormData();
  formData.append('model', file);
  const { data } = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // Prefer dataUrl for Vercel (serverless), fallback to fileUrl for local development
  return data.dataUrl || data.fileUrl;
};

export const saveSettings = async (settings) => {
  const { data } = await axios.post(`${API_BASE}/settings`, settings);
  return data;
};

export const fetchSettings = async () => {
  const { data } = await axios.get(`${API_BASE}/settings`);
  return data;
};
