import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    is_accredited: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API}/auth/me`);
        const userData = response.data;
        
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          company_name: userData.company_name || '',
          is_accredited: userData.is_accredited || false
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      await updateUserProfile(formData);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDateString = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const getVerificationStatusClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-900 text-green-400';
      case 'Pending Verification':
        return 'bg-orange-900 text-orange-400';
      case 'Suspended':
        return 'bg-red-900 text-red-400';
      default:
        return 'bg-gray-900 text-gray-400';
    }
  };
  
  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <a href="/" className="hover:text-white">Home</a>
          <span>›</span>
          <span className="text-white">Profile</span>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account details and verification status</p>
        </div>
        
        {updateSuccess && (
          <div className="bg-green-900 text-green-200 p-4 rounded-lg mb-6">
            Your profile has been updated successfully.
          </div>
        )}
        
        {updateError && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
            {updateError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : null}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
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
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
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
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="company_name">
                      Company/Family Office Name
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="bg-gray-800 w-full p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center">
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
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-gray-400 text-sm">First Name</div>
                      <div className="text-lg">{formData.first_name}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Last Name</div>
                      <div className="text-lg">{formData.last_name}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-gray-400 text-sm">Email</div>
                    <div className="text-lg">{currentUser?.email}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-gray-400 text-sm">Company/Family Office</div>
                    <div className="text-lg">{formData.company_name || '—'}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-gray-400 text-sm">Accredited Investor Status</div>
                    <div className="text-lg">
                      {formData.is_accredited ? (
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mr-2">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                          Accredited
                        </span>
                      ) : 'Not Accredited'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Account Information</h2>
              
              <div className="mb-6">
                <div className="text-gray-400 text-sm">Account Type</div>
                <div className="text-lg">{currentUser?.user_type}</div>
              </div>
              
              <div className="mb-6">
                <div className="text-gray-400 text-sm">Verification Status</div>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getVerificationStatusClass(currentUser?.status)}`}>
                    {currentUser?.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-gray-400 text-sm">Member Since</div>
                <div className="text-lg">{formatDateString(currentUser?.created_at)}</div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Actions</h2>
              
              <button
                onClick={logout}
                className="bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-lg w-full text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;