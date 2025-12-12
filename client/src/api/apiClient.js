
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const uploadModel = async (file) => {
  const formData = new FormData();
  formData.append('model', file);
  const { data } = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.fileUrl;
};

export const saveSettings = async (settings) => {
  const { data } = await axios.post(`${API_BASE}/settings`, settings);
  return data;
};

export const fetchSettings = async () => {
  const { data } = await axios.get(`${API_BASE}/settings`);
  return data;
};
