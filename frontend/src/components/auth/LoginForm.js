import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      await login(email, password);
      navigate('/'); // Redirect to homepage after successful login
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400">Sign in to access your Limited account</p>
        </div>
        
        {(formError || error) && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-400 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-blue-500 text-sm">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="text-gray-500 text-sm text-center mb-4">
            Or sign in with test accounts
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setEmail('investor@limited.com');
                setPassword('investor123');
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex justify-between items-center"
            >
              <span>Limited Partner</span>
              <span className="text-gray-400">investor@limited.com</span>
            </button>
            <button
              onClick={() => {
                setEmail('manager@limited.com');
                setPassword('manager123');
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex justify-between items-center"
            >
              <span>Fund Manager</span>
              <span className="text-gray-400">manager@limited.com</span>
            </button>
            <button
              onClick={() => {
                setEmail('admin@limited.com');
                setPassword('admin123');
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex justify-between items-center"
            >
              <span>Admin</span>
              <span className="text-gray-400">admin@limited.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;