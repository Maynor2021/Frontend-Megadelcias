// src/utils/auth.js
import axios from "axios";

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await axios.get("http://localhost:4000/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.valid;
  } catch {
    return false;
  }
};