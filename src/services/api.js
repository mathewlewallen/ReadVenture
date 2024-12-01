import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API URL
});

// Function to set the authorization token in the request headers
api.setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;