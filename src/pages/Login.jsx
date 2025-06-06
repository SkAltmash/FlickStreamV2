import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const firebaseErrorMap = {
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Please enter a valid email address.',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/');
    } catch (error) {
      const friendlyMsg = firebaseErrorMap[error.code] || error.message;
      setErrorMsg(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 mb-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow rounded transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>

      {errorMsg && <div className="text-red-600 dark:text-red-400 mb-4 text-center">{errorMsg}</div>}

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value.trimStart())}
          required
          aria-label="Email address"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Password"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
