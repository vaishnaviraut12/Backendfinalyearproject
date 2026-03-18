import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const registerUser = (data) =>
  axios.post(`${API}/api/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API}/api/auth/login`, data);