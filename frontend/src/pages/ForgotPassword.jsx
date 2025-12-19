import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
  const { requestPasswordReset } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await requestPasswordReset(email);
      setMessage(res.data.message || 'Check your email for reset link.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset link.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
