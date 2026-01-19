import axios from "axios";
import { createContext, useEffect, useState } from "react";

import { socket } from "../socket";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* --------------------------------------------------
     SET / REMOVE AUTH TOKEN (GLOBAL AXIOS)
  -------------------------------------------------- */
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  /* --------------------------------------------------
     SIGNUP
  -------------------------------------------------- */

const signup = async ({ name, email, password, address, role = "user", vehicleType }) => {
  const payload = { name, email, password, role };

  // Handle delivery partner
  if (role === "delivery") {
    payload.vehicleType = vehicleType;
    payload.isVerified = false; // pending admin approval
    payload.status = "INACTIVE";
  }

  // Convert address to backend format if provided
  if (address) {
    payload.addressLine = address; // matches backend UserSchema
  }

  const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, payload);

  localStorage.setItem("token", res.data.token);
  setAuthToken(res.data.token);
  setUser(res.data.user);
};


  /* --------------------------------------------------
     LOGIN
  -------------------------------------------------- */
  const login = async (email, password) => {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };



    // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      }
    };
    loadUser();
  }, []);
  /* --------------------------------------------------
     LOGOUT
  -------------------------------------------------- */
const logout = () => {
  socket.disconnect();
  localStorage.removeItem("token");
  setUser(null);
 
};

  /* --------------------------------------------------
     GOOGLE LOGIN
  -------------------------------------------------- */
  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  /* --------------------------------------------------
     LOAD USER FROM TOKEN (/me)
  -------------------------------------------------- */
  const setUserFromToken = async (token) => {
    try {
      setAuthToken(token);
      const res = await axios.get(`${BACKEND_URL}/api/auth/me`);
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth restore failed:", err);
      localStorage.removeItem("token");
      setAuthToken(null);
      setUser(null);
    }
  };

  /* --------------------------------------------------
     SEND OTP
  -------------------------------------------------- */
  const sendOtp = async (phone) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/verify/send`, {
        phone,
      });
      return res.data;
    } catch (err) {
      console.error("Send OTP error:", err);
      return { success: false, message: "Failed to send OTP" };
    }
  };

  /* --------------------------------------------------
     VERIFY OTP
  -------------------------------------------------- */
  const verifyOtp = async (phone, otp) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/verify/verify`, {
        phone,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
      }

      return res.data;
    } catch (err) {
      console.error("Verify OTP error:", err);
      return { success: false, message: "OTP verification failed" };
    }
  };

  /* --------------------------------------------------
     RESTORE AUTH ON PAGE REFRESH
  -------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setUserFromToken(token).finally(() => setLoading(false));
  }, []);


  const refreshUser = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/auth/me`);
    setUser(res.data.user);
  } catch (err) {
    console.error("Failed to refresh user");
  }
};

/* --------------------------------------------------
   FORGOT PASSWORD
-------------------------------------------------- */
const requestPasswordReset = async (email) => {
  return axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
};

/* --------------------------------------------------
   RESET PASSWORD
-------------------------------------------------- */
const resetPassword = async (token, password) => {
  return axios.post(
    `${BACKEND_URL}/api/auth/reset-password/${token}`,
    { password }
  );
};


  /* --------------------------------------------------
     PROVIDER
  -------------------------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        signup,
        login,
        logout,
        loginWithGoogle,
        setUserFromToken,
        sendOtp,
        verifyOtp,
          refreshUser,
           requestPasswordReset,
           resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
