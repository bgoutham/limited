import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company_name: '',
    user_type: 'Limited Partner', // Default to LP
    is_accredited: false
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Account Details, 3: Accreditation
  
  const { register, login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const validateForm = () => {
    if (step === 1) {
      if (!formData.first_name || !formData.last_name) {
        setFormError('Please enter your name');
        return false;
      }
    } else if (step === 2) {
      if (!formData.email) {
        setFormError('Please enter your email');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormError('Please enter a valid email address');
        return false;
      }
      
      if (!formData.password) {
        setFormError('Please enter a password');
        return false;
      }
      
      if (formData.password.length < 8) {
        setFormError('Password must be at least 8 characters');
        return false;
      }
      
      if (formData.password !== confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
    }
    
    setFormError(null);
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      if (validateForm()) {
        handleNextStep();
      }
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Register the user
      await register(formData);
      
      // Auto login after successful registration
      await login(formData.email, formData.password);
      
      // Redirect to homepage
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="John"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Doe"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="company_name">
                Company/Family Office Name (Optional)
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Your company"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="user_type">
                I am a:
              </label>
              <select
                id="user_type"
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="Limited Partner">Limited Partner (LP)</option>
                <option value="Fund Manager">Fund Manager (GP)</option>
              </select>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                To comply with regulations, we need to verify that you are an accredited investor.
              </p>
              
              <div className="flex items-center mb-4">
                <input
                  id="is_accredited"
                  name="is_accredited"
                  type="checkbox"
                  checked={formData.is_accredited}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_accredited" className="ml-2 text-gray-300">
                  I certify that I am an accredited investor
                </label>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg text-gray-400 text-sm">
                <p className="font-medium text-gray-300 mb-2">As defined by the SEC, an accredited investor is:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>An individual with income exceeding $200,000 in each of the two most recent years.</li>
                  <li>A joint income with a spouse or spousal equivalent exceeding $300,000 in each of those years.</li>
                  <li>A net worth over $1 million, excluding the value of their primary residence.</li>
                  <li>A holder of certain professional certifications or designations.</li>
                  <li>An entity with total assets in excess of $5 million not formed for the specific purpose of investing.</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                By clicking "Create Account", you agree to our{' '}
                <a href="#" className="text-blue-500">Terms of Service</a> and{' '}
                <a href="#" className="text-blue-500">Privacy Policy</a>.
              </p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-gray-400">Join Limited to access exclusive investment opportunities</p>
        </div>
        
        {formError && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
            {formError}
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex-1 h-1 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              3
            </div>
            <div className={`flex-1 h-1 ${step > 3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Basic Info</span>
            <span>Account Details</span>
            <span>Verification</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`${step > 1 ? 'ml-auto' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {step < 3 ? 'Continue' : isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;