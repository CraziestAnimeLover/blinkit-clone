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
    if (user) navigate(user.isAdmin ? "/admin" : "/");
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
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {/* Email/Password Login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Login
        </button>
      </form>

      {/* OTP Login */}
      <div className="mt-6">
        <h3 className="text-center font-semibold mb-2">Or login with OTP</h3>
        <input
          type="text"
          placeholder="Phone (+91XXXXXXXXXX)"
          value={otpForm.phone}
          onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600"
          >
            Send OTP
          </button>
        )}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpForm.otp}
              onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
              className="border p-2 w-full my-2"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </>
        )}
        {status && <p className="text-center mt-2 text-green-500">{status}</p>}
      </div>

      {/* Google Login */}
      <button
        className="w-full mt-4 py-2 border rounded flex items-center justify-center gap-2 hover:bg-gray-100"
        onClick={loginWithGoogle}
      >
        <img src="/google.png" alt="Google" className="w-7 h-7" />
        Sign in with Google
      </button>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-green-500 hover:underline">Sign up</Link>
        <p className="text-center mt-2 text-sm">
          <Link to="/forgot-password" className="text-green-500 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </p>
    </div>
  );
};

export default Login;
