// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://backend0-1-tgre.onrender.com";

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const fetchDashboardData = async (uid) => {
  const response = await fetch(`${BASE_URL}/dashboard/${uid}`);
  return response.json();
};
