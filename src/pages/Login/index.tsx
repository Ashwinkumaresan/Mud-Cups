import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../api';

interface LoginPageProps {
  onLogin: (token: string, user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      onLogin(data.token, data.user);
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your active orders and complete checkout.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-bold text-white bg-[#1B4D3E] hover:bg-[#123329] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4D3E] transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#1B4D3E] hover:text-[#123329] transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};
