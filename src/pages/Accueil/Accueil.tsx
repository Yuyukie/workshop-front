import React, { useState, useEffect } from 'react';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';
import WeeklyCalendar from '../../components/WeeklyCalendar';
import Carousel from '../../components/Carousel';
import Modal from '../../components/Modal';
import ImageUploadForm from '../../components/ImageUploadForm';

const Accueil: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshCarousel, setRefreshCarousel] = useState(0);
  const [gradeRequests, setGradeRequests] = useState<any[]>([]);
  const [showGradeRequestModal, setShowGradeRequestModal] = useState(false);
  const userGrade = localStorage.getItem('userGrade');

  useEffect(() => {
    if (userGrade === 'admin') {
      fetchGradeRequests();
    }
  }, [userGrade]);

  const fetchGradeRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1234/api/auth/gradeRequests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGradeRequests(data);
      } else {
        console.error('Erreur lors de la récupération des demandes de grade:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de grade:', error);
    }
  };

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

  const handleRequestGrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1234/api/auth/requestGrade', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        alert('Votre demande de grade a été envoyée');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de grade:', error);
    }
  };

  const handleApproveGrade = async (userId: string, approve: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:1234/api/auth/approveGrade/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approve })
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        console.log(`Demande traitée pour l'utilisateur avec l'ID ${userId}`);
        console.log(`Rang de l'utilisateur : ${data.user.grade}`);
        setShowGradeRequestModal(false);
        fetchGradeRequests();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du traitement de la demande');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la demande de grade:', error);
      alert('Une erreur est survenue lors du traitement de la demande.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Banner onRequestGrade={handleRequestGrade} />
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

        {userGrade === 'visiteur' && (
          <div className="mt-4 text-center bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-800 mb-2">Tu joues un rôle pour EPSI ? Demande tes droits !</p>
            <button 
              onClick={handleRequestGrade}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
            >
              Demander le grade utilisateur
            </button>
          </div>
        )}

        {userGrade === 'admin' && gradeRequests.length > 0 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowGradeRequestModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300"
            >
              Demandes de grade en attente ({gradeRequests.length})
            </button>
          </div>
        )}
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploadForm onSubmit={handleImageUpload} />
      </Modal>
      <Modal isOpen={showGradeRequestModal} onClose={() => setShowGradeRequestModal(false)}>
        <h2 className="text-xl font-bold mb-4">Demandes de grade en attente</h2>
        {gradeRequests.map(user => (
          <div key={user._id} className="mb-4">
            <p>{user.email} demande le grade utilisateur</p>
            <button 
              onClick={() => handleApproveGrade(user._id, true)}
              className="mr-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
            >
              Approuver
            </button>
            <button 
              onClick={() => handleApproveGrade(user._id, false)}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
            >
              Refuser
            </button>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Accueil;