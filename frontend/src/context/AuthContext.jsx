import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // ---------------- SIGNUP ----------------
  const signup = async (name, email, password, address, role = "user") => {
    const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, { name, email, password, address, role });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const requestPasswordReset = async (email) => {
    return await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
  };

  const resetPassword = async (token, newPassword) => {
    return await axios.post(`${BACKEND_URL}/api/auth/reset-password/${token}`, { password: newPassword });
  };

  // ---------------- SET USER FROM TOKEN ----------------
  const setUserFromToken = async (token) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data.user);
    localStorage.setItem("token", token);
  } catch (err) {
    console.error("Error fetching /me:", err);
    localStorage.removeItem("token");
    setUser(null);
  }
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    setUserFromToken(token).finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      signup,
      login,
      logout,
      loginWithGoogle,
      loading,
      setUserFromToken,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

