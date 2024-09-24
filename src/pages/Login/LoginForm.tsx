import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la connexion');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/accueil');  // Redirection vers la page d'accueil
      } else {
        throw new Error('Token non reçu');
      }
    } catch (err) {
      setError('Identifiants incorrects ou problème de connexion. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      <div className="relative">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
        <input 
          type={showPassword ? "text" : "password"}
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" 
        />
        <button 
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none mt-6"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;