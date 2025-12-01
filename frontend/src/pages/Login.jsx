import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, loginWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      // Do NOT redirect here, user will update after login()
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  // Redirect after user state updates
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/");
    }
  }, [user, navigate]);

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

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

      {/* Google Login Button */}
      <button
        className="w-full mt-4 py-2 border rounded flex items-center justify-center gap-2 hover:bg-gray-100"
        onClick={handleGoogleLogin}
      >
        <img src="/google.png" alt="Google" className="w-7 h-7" />
        Sign in with Google
      </button>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-green-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
