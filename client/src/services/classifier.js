import api from './api';

export const classifyQuery = async (message) => {
  const response = await api.post('/classify', { message });
  return response.data;
};

export const fetchAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};
