import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FundDetail = () => {
  const { fundId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentError, setInvestmentError] = useState(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  
  useEffect(() => {
    const fetchFundDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API}/funds/${fundId}`);
        setFund(response.data);
        // Set default investment to the minimum
        setInvestmentAmount(response.data.min_investment);
      } catch (err) {
        console.error('Error fetching fund details:', err);
        setError('Failed to load fund details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundDetails();
  }, [fundId]);
  
  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    setInvestmentError(null);
    setInvestmentSuccess(false);
    setIsInvesting(true);
    
    // Validate investment amount
    const amount = Number(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setInvestmentError('Please enter a valid investment amount');
      setIsInvesting(false);
      return;
    }
    
    if (amount < fund.min_investment) {
      setInvestmentError(`Minimum investment amount is ${formatCurrency(fund.min_investment)}`);
      setIsInvesting(false);
      return;
    }
    
    try {
      await axios.post(`${API}/investments`, {
        fund_id: fundId,
        amount: amount
      });
      
      setInvestmentSuccess(true);
      
      // Reset form
      setInvestmentAmount(fund.min_investment);
      
      // Redirect to portfolio after short delay
      setTimeout(() => {
        navigate('/portfolio');
      }, 3000);
    } catch (err) {
      console.error('Error making investment:', err);
      setInvestmentError(err.response?.data?.detail || 'Failed to process your investment. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl">Loading fund details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center text-white">
        <div className="text-xl text-red-500 mb-4">{error}</div>
        <Link to="/funds" className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
          Back to Funds
        </Link>
      </div>
    );
  }
  
  if (!fund) {
    return (
      <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center text-white">
        <div className="text-xl mb-4">Fund not found</div>
        <Link to="/funds" className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
          Back to Funds
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <Link to="/funds" className="hover:text-white">Funds</Link>
          <span>›</span>
          <span className="text-white">{fund.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  {fund.symbol}
                </div>
                <h1 className="text-3xl font-bold">{fund.name}</h1>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {fund.fund_type}
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {fund.status}
                </div>
                {fund.target_close_date && (
                  <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                    Closes: {formatDate(fund.target_close_date)}
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 mb-8">{fund.description}</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Fund Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-4">
                <div>
                  <div className="text-gray-400 text-sm">General Partner</div>
                  <div className="text-lg">{fund.gp_name}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Minimum Investment</div>
                  <div className="text-lg">{formatCurrency(fund.min_investment)}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Carry</div>
                  <div className="text-lg">{fund.carry}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Management Fee</div>
                  <div className="text-lg">{fund.management_fee}</div>
                </div>
                
                {fund.performance && (
                  <div>
                    <div className="text-gray-400 text-sm">Performance</div>
                    <div className="text-lg">{fund.performance}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Invest in {fund.name}</h2>
              
              {investmentSuccess && (
                <div className="bg-green-900 text-green-200 p-4 rounded-lg mb-6">
                  Your investment has been submitted successfully! Redirecting to your portfolio...
                </div>
              )}
              
              {investmentError && (
                <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
                  {investmentError}
                </div>
              )}
              
              <form onSubmit={handleInvestmentSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="amount">
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      id="amount"
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="bg-gray-800 w-full p-3 pl-8 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="10000"
                      min={fund.min_investment}
                      step="1000"
                      required
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Minimum: {formatCurrency(fund.min_investment)}
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isInvesting || investmentSuccess}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors ${
                    (isInvesting || investmentSuccess) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isInvesting ? 'Processing...' : 'Invest Now'}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 12 2.25c-2.786 0-5.433.608-7.812 1.7 3.012 3.012 3.912 7.461 2.318 11.346A11.949 11.949 0 0 1 12 21.75c2.786 0 5.433-.608 7.812-1.7-3.012-3.012-3.912-7.461-2.318-11.346A11.949 11.949 0 0 1 12 2.25Z" />
                  </svg>
                  <span className="text-gray-400 text-sm">Secured Investment Process</span>
                </div>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                  </svg>
                  <span className="text-gray-400 text-sm">Easy Document Signing</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                  <span className="text-gray-400 text-sm">Multiple Payment Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetail;