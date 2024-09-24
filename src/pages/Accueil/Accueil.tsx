import React from 'react';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';
import WeeklyCalendar from '../../components/WeeklyCalendar';

const Accueil: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Banner />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Post & Share</h1>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bienvenue sur votre espace</h2>
          <p className="text-lg text-gray-600 text-center mb-8">Vous êtes maintenant connecté à votre compte.</p>
          <div className="flex justify-center mb-8">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Commencer à partager
            </button>
          </div>
          <WeeklyCalendar />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accueil;