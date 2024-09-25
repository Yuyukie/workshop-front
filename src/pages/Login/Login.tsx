import React, { useState } from 'react';
import Modal from '../../components/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import backgroundImage from '../../assets/Logo_site_web.png';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:1234/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();

      // Stockage du token et du grade dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userGrade', data.grade);

      // Redirection vers la page d'accueil pour tous les utilisateurs
      setIsLoginModalOpen(false);
      navigate('/accueil');
    } catch (err) {
      setLoginError('Erreur lors de la connexion. Veuillez réessayer.');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <div className="relative">
          <img src={backgroundImage} alt="Logo Post & Share" className="w-full h-96 object-contain rounded-3xl" />
          <div className="absolute inset-0 rounded-3xl shadow-custom"></div>
        </div>
        <h1 className="text-6xl font-bold text-white text-shadow mt-4">Post & Share</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 mx-auto">
        <div className="space-y-4">
          <button 
            onClick={() => setIsLoginModalOpen(true)} 
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Se connecter
          </button>
          <button 
            onClick={() => setIsSignupModalOpen(true)} 
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Créer un compte
          </button>
        </div>
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginForm onLoginSuccess={handleLoginSuccess} error={loginError} />
      </Modal>

      <Modal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)}>
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </Modal>

      <Modal isOpen={isConfirmationModalOpen} onClose={handleConfirmationClose}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Compte créé avec succès!</h2>
          <p className="mb-6 text-gray-600">Votre compte a été créé. Vous pouvez maintenant vous connecter.</p>
          <button 
            onClick={handleConfirmationClose}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Aller à la page de connexion
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;