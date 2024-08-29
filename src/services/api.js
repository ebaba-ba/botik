require("dotenv").config();
const axios = require("axios");
const axiosClient = axios.create({
  baseURL: process.env.API_COLLECTION,
  headers: {
    "Content-Type": "application/json",
    // Add any other common headers here
  },
});

axiosClient.interceptors.request.use((config) => {
  let token = process.env.TOKEN;
  console.log(process.env.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Handle the case where there is no token
    // You might want to redirect to the login page or take appropriate action
  }

  return config;
});

module.exports = { axiosClient };
