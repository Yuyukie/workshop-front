import React, { useState } from "react";
import Modal from "../../components/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import backgroundImage from "../../assets/Logo_site_web.png";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
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
      console.log("Tentative de connexion pour:", email); // Log pour le débogage
      const response = await fetch("http://localhost:1234/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Réponse du serveur:", response.status, errorData); // Log pour le débogage
        if (response.status === 401) {
          throw new Error(
            errorData.error || "Identifiants incorrects. Veuillez réessayer."
          );
        } else {
          throw new Error(
            errorData.error ||
              "Erreur de connexion. Veuillez réessayer plus tard."
          );
        }
      }

      const data = await response.json();
      console.log("Données de connexion reçues:", data); // Log pour le débogage

      if (!data.token || !data.grade) {
        console.error("Données de réponse invalides:", data); // Log pour le débogage
        throw new Error(
          "Réponse du serveur invalide. Veuillez contacter l'administrateur."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userGrade", data.grade);

      setIsLoginModalOpen(false);
      navigate("/accueil");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setLoginError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#25a8a6] to-[#efa872]">
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <div className="relative w-full h-96">
          <img
            src={backgroundImage}
            alt="Logo Post & Share"
            className="w-full h-full object-contain absolute inset-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
            }}
          />
        </div>
        <h1 className="text-6xl font-bold text-white mt-4 text-shadow-lg">
          Post & Share
        </h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 mx-auto">
        <div className="space-y-4">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full px-4 py-3 bg-[#25a8a6] text-white rounded-full hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25a8a6] focus:ring-opacity-50"
          >
            Se connecter
          </button>
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="w-full px-4 py-3 bg-[#efa872] text-white rounded-full hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#efa872] focus:ring-opacity-50"
          >
            Créer un compte
          </button>
        </div>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <LoginForm onLoginSuccess={handleLoginSuccess} error={loginError} />
      </Modal>

      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      >
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </Modal>

      <Modal isOpen={isConfirmationModalOpen} onClose={handleConfirmationClose}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#25a8a6]">
            Compte créé avec succès!
          </h2>
          <p className="mb-6 text-gray-600">
            Votre compte a été créé. Vous pouvez maintenant vous connecter.
          </p>
          <button
            onClick={handleConfirmationClose}
            className="px-6 py-3 bg-[#efa872] text-white rounded-full hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#efa872] focus:ring-opacity-50"
          >
            Aller à la page de connexion
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
