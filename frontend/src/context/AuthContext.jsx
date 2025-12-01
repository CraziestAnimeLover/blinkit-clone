import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user info
  const [loading, setLoading] = useState(true);

  // 🟢 Signup
  const signup = async (name, email, password, address, role = "user") => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
      name,
      email,
      password,
      address,
      role,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // 🟢 Login
  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // 🟢 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🟢 Auto-login on refresh
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);


  const loginWithGoogle = () => {
  window.location.href = "http://localhost:8000/api/auth/google";
};



  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loginWithGoogle , loading }}>
      {children}
    </AuthContext.Provider>
  );
};
