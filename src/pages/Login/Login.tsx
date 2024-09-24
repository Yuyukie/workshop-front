import React, { useState } from 'react';
import Modal from '../../components/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Login: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <img src="/path/to/your/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Post & Share</h1>
        
        <div className="space-y-4">
          <button 
            onClick={() => setIsLoginModalOpen(true)} 
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Se connecter
          </button>
          <button 
            onClick={() => setIsSignupModalOpen(true)} 
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Créer un compte
          </button>
        </div>
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginForm />
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
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Aller à la page de connexion
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;