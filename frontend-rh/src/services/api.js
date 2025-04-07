import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // o donde esté corriendo tu backend
});

export default api;
