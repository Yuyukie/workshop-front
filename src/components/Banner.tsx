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
    <header className="bg-gradient-to-r from-[#25a8a6] to-[#efa872] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link to="/accueil" className="flex items-center flex-shrink-0">
          <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
          <span className="text-xl font-bold text-white">Post & Share</span>
        </Link>
        <div className="flex-grow flex justify-center items-center">
          {userGrade === 'visiteur' && onRequestGrade && (
            <div className="text-center">
              <p className="text-white mb-2">Tu joues un rôle pour EPSI ? Demande tes droits !</p>
              <button 
                onClick={onRequestGrade}
                className="px-4 py-2 bg-white text-[#25a8a6] rounded-full hover:bg-opacity-80 transition duration-300"
              >
                Demander le grade utilisateur
              </button>
            </div>
          )}
        </div>
        <div className="relative flex-shrink-0">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-white hover:text-[#1a7572] focus:outline-none transition duration-300"
          >
            <span className="text-sm font-medium">Menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-sm text-[#25a8a6] hover:bg-[#1a7572] hover:text-white transition duration-300"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Banner;