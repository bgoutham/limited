import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PortfolioPage = () => {
  const { currentUser } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [pendingInvestments, setPendingInvestments] = useState(0);
  
  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API}/investments`);
        setInvestments(response.data);
        
        // Calculate totals
        let total = 0;
        let pending = 0;
        
        response.data.forEach(investment => {
          total += investment.amount;
          if (investment.status === 'Pending') {
            pending += investment.amount;
          }
        });
        
        setTotalInvested(total);
        setPendingInvestments(pending);
      } catch (err) {
        console.error('Error fetching investments:', err);
        setError('Failed to load your investment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestments();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl">Loading your portfolio...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <span className="text-white">Portfolio</span>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
          <p className="text-gray-400">Manage and track your investments</p>
        </div>
        
        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total Invested</div>
            <div className="text-3xl font-bold">{formatCurrency(totalInvested)}</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Active Investments</div>
            <div className="text-3xl font-bold">{investments.filter(i => i.status === 'Completed').length}</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Pending Investments</div>
            <div className="text-3xl font-bold">{formatCurrency(pendingInvestments)}</div>
          </div>
        </div>
        
        {investments.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No investments yet</h2>
            <p className="text-gray-400 mb-6">Start building your portfolio by exploring available funds</p>
            <Link to="/funds" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors">
              Browse Funds
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Investments</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="pb-3 font-medium">Fund</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-800 hover:bg-gray-900">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-medium">
                            {investment.fund_symbol}
                          </div>
                          <div className="font-medium">{investment.fund_name}</div>
                        </div>
                      </td>
                      <td className="py-4">{formatCurrency(investment.amount)}</td>
                      <td className="py-4">{formatDate(investment.created_at)}</td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          investment.status === 'Completed' 
                            ? 'bg-green-900 text-green-400' 
                            : investment.status === 'Pending' 
                              ? 'bg-orange-900 text-orange-400' 
                              : 'bg-red-900 text-red-400'
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link to={`/funds/${investment.fund_id}`} className="text-blue-500 hover:text-blue-400 text-sm">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;