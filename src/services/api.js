import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API URL
});

// Function to set the authorization token in the request headers
api.setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-project-id.cloudfunctions.net', // Replace with your Firebase Cloud Functions URL
});

api.setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

api.handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error('Request error:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
  }
  console.error('Error config:', error.config);

  // You can add more specific error handling logic here, such as
  // displaying error messages to the user or retrying the request.
};

export default api;