import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-black text-white border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <h1 className="text-xl font-bold">Limited</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gray-600 rounded-md flex items-center justify-center">
            <span className="text-sm font-medium">DO</span>
          </div>
          <div>
            <div className="text-sm">Doremus family office</div>
            <div className="text-xs text-gray-400">Limited</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul>
          <li>
            <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Browse</span>
            </Link>
          </li>
          <li>
            <Link to="/funds" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Funds</span>
            </Link>
          </li>
          <li>
            <Link to="/companies" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span>Companies</span>
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span>Portfolio</span>
            </Link>
          </li>
          <li>
            <Link to="/invites" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span>Invites</span>
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <span>Transactions</span>
            </Link>
          </li>
          <li>
            <Link to="/network" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <span>My Network</span>
            </Link>
          </li>
          <li>
            <Link to="/fin-ai" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span>Fin.ai</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <div className="text-xs text-gray-400">Profile</div>
            <div className="text-sm">20% complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fund Card Component
const FundCard = ({ symbol, name, minInvestment, carry, description, isCompact }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
            {symbol}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        {description && !isCompact && (
          <p className="text-gray-400 text-sm mb-4">{description}</p>
        )}
        <div className="mt-auto">
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(minInvestment)}</p>
              <p className="text-sm text-gray-400">Min investment per fund</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{carry}</p>
              <p className="text-sm text-gray-400">Carry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page
const Home = () => {
  const [featuredData, setFeaturedData] = useState({
    featured_funds: [],
    all_funds: [],
    all_companies: [],
    all_deals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const response = await axios.get(`${API}/featured`);
        setFeaturedData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  const featured = featuredData.featured_funds.slice(0, 3);

  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-gray-800 text-xs font-medium text-white px-3 py-1 rounded-full w-fit mb-4">
          Early access
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Welcome to Limited.</h1>
        <p className="text-xl text-gray-400 mb-8">Exclusive access to funds and deals.</p>
        
        {/* Featured Opportunities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Featured opportunities.</h2>
          <p className="text-gray-400 mb-6">Current selection of top performing funds.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((fund, index) => (
              <FundCard 
                key={fund.id}
                symbol={fund.symbol}
                name={fund.name}
                minInvestment={fund.min_investment}
                carry={fund.carry}
                description={fund.description}
              />
            ))}
            {featured.length < 3 && (
              <div className="bg-gray-900 rounded-lg overflow-hidden flex flex-col">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">
                      18
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-3xl font-semibold text-white mb-4">Select opportunities</h3>
                      <p className="text-gray-400">Presented by North Capital</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Brought to you in partnership with NorthCap
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Funds raising now */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Funds raising now.</h2>
            <Link to="/funds" className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
              View all funds ({featuredData.all_funds.length})
            </Link>
          </div>
          <p className="text-gray-400 mb-6">Invest broadly through venture funds.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredData.all_funds.slice(0, 3).map((fund) => (
              <FundCard 
                key={fund.id}
                symbol={fund.symbol}
                name={fund.name}
                minInvestment={fund.min_investment}
                carry={fund.carry}
                isCompact={true}
              />
            ))}
          </div>
        </div>
        
        {/* Deal flow */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Deal flow.</h2>
            <Link to="/deals" className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
              View all deals ({featuredData.all_deals.length})
            </Link>
          </div>
          <p className="text-gray-400 mb-6">Exclusive access to top deals.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredData.all_deals.slice(0, 3).map((deal) => (
              <div key={deal.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {deal.symbol.substring(0, 2)}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{deal.company_name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Funds Page
const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get(`${API}/featured`);
        setFunds(response.data.all_funds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setLoading(false);
      }
    };
    
    fetchFunds();
  }, []);
  
  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <span className="text-white">Funds</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Venture Funds</h1>
        <p className="text-gray-400 mb-8">Explore and invest in top-performing venture funds</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-xl">
            <input 
              type="text" 
              placeholder="Search funds..." 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-8 text-white">
                <option>All Types</option>
                <option>Venture Fund</option>
                <option>Demo Day Fund</option>
                <option>Growth Fund</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className="relative">
              <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-8 text-white">
                <option>All Amounts</option>
                <option>$10K+</option>
                <option>$25K+</option>
                <option>$100K+</option>
                <option>$1M+</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <button className="bg-gray-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </button>
            <button className="bg-gray-800 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">GP</th>
                <th className="pb-3 font-medium">Min. Commitment</th>
                <th className="pb-3 font-medium">Carry</th>
                <th className="pb-3 font-medium">Management Fees</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund.id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-sm font-medium">
                        {fund.symbol}
                      </div>
                      <div>
                        <div className="font-medium">{fund.name}</div>
                        <div className="text-sm text-gray-400">{fund.fund_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{fund.gp_name}</td>
                  <td className="py-4">
                    {fund.min_investment >= 1000000 
                      ? `$${(fund.min_investment/1000000).toFixed(1)}M` 
                      : `$${fund.min_investment.toLocaleString()}`}
                  </td>
                  <td className="py-4">{fund.carry}</td>
                  <td className="py-4">{fund.management_fee}</td>
                  <td className="py-4">
                    <span className="inline-block px-2 py-1 bg-green-900 text-green-400 rounded-full text-xs">
                      {fund.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Companies Page
const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API}/featured`);
        setCompanies(response.data.all_companies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex justify-center items-center text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 bg-black min-h-screen text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <span className="text-white">Companies</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className="text-gray-400 mb-8">Exclusive access to top deals from AngelList</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-xl">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-8 text-white">
                <option>All Sectors</option>
                <option>FinTech</option>
                <option>AI/ML</option>
                <option>Blockchain/Crypto</option>
                <option>Enterprise Software</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className="relative">
              <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-8 text-white">
                <option>All Rounds</option>
                <option>Pre-Seed</option>
                <option>Seed</option>
                <option>Seed+</option>
                <option>Series A</option>
                <option>Series A+</option>
                <option>Late Stage</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Lead</th>
                <th className="pb-3 font-medium">Co-investors</th>
                <th className="pb-3 font-medium">Sector</th>
                <th className="pb-3 font-medium">Valuation</th>
                <th className="pb-3 font-medium">Round</th>
                <th className="pb-3 font-medium">Traction</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded bg-${company.sector === 'FinTech' ? 'blue' : company.sector === 'AI/ML' ? 'purple' : 'green'}-600 flex items-center justify-center text-sm font-medium`}>
                        {company.symbol}
                      </div>
                      <div className="font-medium">{company.name}</div>
                    </div>
                  </td>
                  <td className="py-4">{company.lead_investor}</td>
                  <td className="py-4">{company.co_investors && company.co_investors.length > 0 ? company.co_investors.join(", ") : "—"}</td>
                  <td className="py-4">
                    <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                      {company.sector}
                    </span>
                  </td>
                  <td className="py-4">{company.valuation}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 ${
                      company.round === 'Pre-Seed' ? 'bg-purple-900 text-purple-400' :
                      company.round === 'Seed' ? 'bg-blue-900 text-blue-400' :
                      company.round === 'Seed+' ? 'bg-indigo-900 text-indigo-400' :
                      company.round === 'Series A' ? 'bg-green-900 text-green-400' :
                      company.round === 'Series A+' ? 'bg-teal-900 text-teal-400' :
                      'bg-gray-900 text-gray-400'
                    } rounded-full text-xs`}>
                      {company.round}
                    </span>
                  </td>
                  <td className="py-4">{company.traction}</td>
                  <td className="py-4 text-right">
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Placeholder Pages
const Portfolio = () => (
  <div className="flex-1 bg-black min-h-screen text-white p-8">
    <h1 className="text-3xl font-bold mb-8">Portfolio</h1>
    <p className="text-gray-400">Your investment portfolio will appear here.</p>
  </div>
);

const Invites = () => (
  <div className="flex-1 bg-black min-h-screen text-white p-8">
    <h1 className="text-3xl font-bold mb-8">Invites</h1>
    <p className="text-gray-400">Your investment invites will appear here.</p>
  </div>
);

const Transactions = () => (
  <div className="flex-1 bg-black min-h-screen text-white p-8">
    <h1 className="text-3xl font-bold mb-8">Transactions</h1>
    <p className="text-gray-400">Your transaction history will appear here.</p>
  </div>
);

const Network = () => (
  <div className="flex-1 bg-black min-h-screen text-white p-8">
    <h1 className="text-3xl font-bold mb-8">My Network</h1>
    <p className="text-gray-400">Your network connections will appear here.</p>
  </div>
);

const FinAI = () => (
  <div className="flex-1 bg-black min-h-screen text-white flex flex-col items-center justify-center p-8">
    <div className="max-w-2xl w-full">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Fin AI</h1>
      <p className="text-center text-gray-400 mb-8">Research Private Markets</p>
      
      <div className="relative mb-12">
        <input 
          type="text" 
          placeholder="Ask about a company or your portfolio" 
          className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-6 text-white pr-12"
        />
        <button className="absolute right-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">SUGGESTIONS</h2>
          <button className="text-gray-400 flex items-center space-x-1">
            <span>Refresh</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Who left Rippling in the last year?</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">R</div>
              <div className="text-gray-400">Rippling</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">What is my best performing SPV?</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <div className="text-gray-400">My portfolio</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">YOUR THREADS</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div className="font-medium">How much runway does Carrot Fertility have?</div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>2 hours ago</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div className="font-medium">How does OpenAI's revenue compare to competitors?</div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>3 hours ago</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div className="font-medium">What is OpenAI's valuation?</div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Feb 13, 2025</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App bg-black min-h-screen text-white">
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/invites" element={<Invites />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/network" element={<Network />} />
            <Route path="/fin-ai" element={<FinAI />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;