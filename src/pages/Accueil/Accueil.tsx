import React, { useState } from 'react';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';
import WeeklyCalendar from '../../components/WeeklyCalendar';
import Carousel from '../../components/Carousel';
import Modal from '../../components/Modal';
import ImageUploadForm from '../../components/ImageUploadForm';

const Accueil: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshCarousel, setRefreshCarousel] = useState(0);
  const userGrade = localStorage.getItem('userGrade');

  const handleImageUpload = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch('http://localhost:1234/api/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse du serveur:', errorText);
        throw new Error(errorText || 'Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      console.log('Image uploadée avec succès:', data);
      setIsModalOpen(false);
      setRefreshCarousel(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      // Affichez l'erreur à l'utilisateur ici
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Banner />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Post & Share</h1>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bienvenue sur votre espace</h2>
          
          <Carousel refreshTrigger={refreshCarousel} />
          
          <p className="text-lg text-gray-600 text-center mb-8">Vous êtes maintenant connecté à votre compte.</p>
          {(userGrade === 'utilisateur' || userGrade === 'admin') && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Commencer à partager
              </button>
            </div>
          )}
          <WeeklyCalendar />
        </div>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploadForm onSubmit={handleImageUpload} />
      </Modal>
    </div>
  );
};

export default Accueil;