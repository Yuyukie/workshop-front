import React from 'react';

const Accueil: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Bienvenue sur Post & Share</h1>
        <p className="text-xl text-gray-600 text-center mb-8">Vous êtes maintenant connecté à votre compte.</p>
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
            Commencer à partager
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accueil;