import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const { login, loginWithGoogle, user, setUserFromToken, sendOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [otpForm, setOtpForm] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Handle token from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setUserFromToken(token).then(() => navigate("/"));
    }
  }, [location.search]);

  // Redirect after normal login
 useEffect(() => {
  if (user) {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "delivery") navigate("/delivery/dashboard");
    else navigate("/");
  }
}, [user, navigate]);


  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!otpForm.phone) {
      setStatus("Enter phone number");
      return;
    }
    const data = await sendOtp(otpForm.phone);
    setStatus(data.message);
    if (data.success) setOtpSent(true);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpForm.otp) {
      setStatus("Enter OTP");
      return;
    }
    const data = await verifyOtp(otpForm.phone, otpForm.otp);
    setStatus(data.message);
    if (data.success) navigate("/");
  };

return (
  <div
    className="min-h-screen flex items-center justify-center relative"
    style={{
      backgroundImage: "url('/blinkit-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* BACKGROUND OVERLAY */}
    <div className="absolute inset-0 bg-black/60"></div>

    {/* LOGIN CARD */}
    <div className="relative z-10 w-full max-w-5xl h-[650px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">

      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-[#0c831f]/90 text-white">
        <div className="text-sm opacity-90">
          India’s fastest grocery delivery
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight animate-slideUp">
            Groceries & essentials <br />
            delivered in minutes
          </h1>

          <p className="mt-4 text-sm opacity-90 max-w-xs animate-slideUp delay-200">
            Fresh fruits, vegetables, snacks,
            and daily needs — right at your doorstep.
          </p>

          <img
            src="/blinkitbags.jpg"
            alt="Blinkit"
            className="mt-8 w-56 animate-float"
          />
        </div>

        <div className="text-xs opacity-70">
          © 2025 Blinkit-style Delivery
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col justify-center px-8 md:px-12 overflow-y-auto">

        <h2 className="text-3xl font-semibold mb-4">Log In</h2>

        {/* EMAIL LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-orange-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full py-3 rounded-full bg-[#0c831f] text-white font-semibold hover:opacity-90 transition">
            Sign In
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3 border rounded-full flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img src="/google.png" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>

        {/* OTP LOGIN */}
        <div className="mt-6">
          <h3 className="text-center text-sm font-semibold mb-3">
            Or login with OTP
          </h3>

          <input
            type="text"
            placeholder="Phone (+91XXXXXXXXXX)"
            value={otpForm.phone}
            onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
            className="w-full px-4 py-3 border rounded-full mb-3"
          />

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-full bg-[#0c831f] text-white hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpForm.otp}
                onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                className="w-full px-4 py-3 border rounded-full my-3"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-full bg-[#0c831f] text-white hover:bg-blue-600 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {status && (
            <p className="text-center text-green-500 text-sm mt-2">
              {status}
            </p>
          )}
        </div>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
);



};

export default Login;
