import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Réservation de Salles
      </Link>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Banner;