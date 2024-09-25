import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo_site_web.png';

interface BannerProps {
  onRequestGrade?: () => void;
}

const Banner: React.FC<BannerProps> = ({ onRequestGrade }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const userGrade = localStorage.getItem('userGrade');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userGrade');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/accueil" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
          <span className="text-xl font-bold text-gray-800">Post & Share</span>
        </Link>
        <div className="flex items-center">
          {userGrade === 'visiteur' && onRequestGrade && (
            <button 
              onClick={onRequestGrade}
              className="mr-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
            >
              Demander le grade utilisateur
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <span className="text-sm font-medium">Menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Se déconnecter</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;