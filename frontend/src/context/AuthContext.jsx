import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user info
  const [loading, setLoading] = useState(true);

  // 🟢 Signup
  const signup = async (name, email, password, address) => {
    const res = await axios.post("http://localhost:8000/api/auth/signup", {
      name,
      email,
      password,
      address,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // 🟢 Login
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:8000/api/auth/login", {
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
        const res = await axios.get("http://localhost:8000/api/auth/me", {
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

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
