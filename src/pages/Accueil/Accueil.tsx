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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userGrade === 'admin') {
      fetchGradeRequests();
    }
  }, [userGrade]);

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decodedToken.grade === 'admin');
      }
    };

    checkAdminStatus();
  }, []);

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
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-r from-[#25a8a6] to-[#efa872]">
      <Banner onRequestGrade={handleRequestGrade} />
      <main className="flex-grow w-full px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="text-white">
            <h1 className="text-4xl font-bold mb-2 text-center">Post & Share</h1>
            <h2 className="text-2xl font-bold mb-4 text-center">Bienvenue sur votre espace</h2>
            <p className="text-lg text-center mb-6">Vous êtes maintenant connecté à votre compte.</p>
          </section>

          <section>
            <Carousel refreshTrigger={refreshCarousel} isAdmin={isAdmin} />
          </section>

          {(userGrade === 'utilisateur' || userGrade === 'admin') && (
            <section className="text-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#25a8a6] text-white rounded-full hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25a8a6] focus:ring-opacity-50"
              >
                Commencer à partager
              </button>
            </section>
          )}

          <section>
            <WeeklyCalendar />
          </section>

          {userGrade === 'admin' && gradeRequests.length > 0 && (
            <section className="text-center">
              <button 
                onClick={() => setShowGradeRequestModal(true)}
                className="px-4 py-2 bg-[#efa872] text-white rounded-full hover:bg-opacity-80 transition duration-300"
              >
                Demandes de grade en attente ({gradeRequests.length})
              </button>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ImageUploadForm onSubmit={handleImageUpload} />
      </Modal>
      <Modal isOpen={showGradeRequestModal} onClose={() => setShowGradeRequestModal(false)}>
        <h2 className="text-xl font-bold mb-4 text-[#25a8a6]">Demandes de grade en attente</h2>
        {gradeRequests.map(user => (
          <div key={user._id} className="mb-4">
            <p>{user.email} demande le grade utilisateur</p>
            <button 
              onClick={() => handleApproveGrade(user._id, true)}
              className="mr-2 px-4 py-2 bg-[#25a8a6] text-white rounded-full hover:bg-opacity-80 transition duration-300"
            >
              Approuver
            </button>
            <button 
              onClick={() => handleApproveGrade(user._id, false)}
              className="px-4 py-2 bg-[#cf5e60] text-white rounded-full hover:bg-opacity-80 transition duration-300"
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