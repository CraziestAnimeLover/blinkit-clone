import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
    vehicleType: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(user.isAdmin ? "/admin" : "/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/blinkit-bg.jpg')" }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT INFO */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-[#0c831f] text-white">
          <div>
            <p className="text-sm opacity-90 mb-4">
              India’s fastest grocery delivery
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Groceries delivered <br /> in minutes
            </h1>

            <p className="mt-4 text-sm opacity-90 max-w-xs">
              Fresh fruits, snacks & daily essentials at your doorstep.
            </p>

           <img
      src="/blinkitbags.jpg"
      alt="Blinkit Bag"
      className="absolute animate-float w-56"
      style={{
        top: "280px",   // 👈 move UP / DOWN
        left: "120px",  // 👈 move LEFT / RIGHT
      }}
    />
          </div>

          <p className="text-xs opacity-70">© 2025 Blinkit-style App</p>
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-10">
          <h2 className="text-3xl font-semibold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-3 border rounded-full"
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-3 border rounded-full"
              placeholder="Email"
              type="email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-3 border rounded-full"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-3 border rounded-full"
              placeholder="Address (optional)"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <select
              className="w-full px-4 py-3 border rounded-full bg-white"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery Partner</option>
            </select>

            {form.role === "delivery" && (
              <input
                className="w-full px-4 py-3 border rounded-full"
                placeholder="Vehicle Type (Bike / Cycle)"
                onChange={(e) =>
                  setForm({ ...form, vehicleType: e.target.value })
                }
              />
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full py-3 rounded-full bg-[#0c831f] text-white font-semibold">
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 border rounded-full flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img src="/google.png" className="w-6 h-6" />
            Sign up with Google
          </button>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
