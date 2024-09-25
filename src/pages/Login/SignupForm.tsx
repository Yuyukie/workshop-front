import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SignupFormProps {
  onSignupSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !confirmEmail || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez fournir un email valide.');
      return;
    }

    if (email !== confirmEmail) {
      setError('Les adresses email ne correspondent pas.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du compte');
      }

      const data = await response.json();
      console.log('Compte créé avec succès:', data);
      
      // Fermer la modale de création de compte et ouvrir la modale de confirmation
      onSignupSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded" 
        />
      </div>
      <div>
        <label htmlFor="confirmEmail" className="block mb-2">Confirmer Email</label>
        <input 
          type="email" 
          id="confirmEmail" 
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded" 
        />
      </div>
      <div className="relative">
        <label htmlFor="password" className="block mb-2">Mot de passe</label>
        <input 
          type={showPassword ? "text" : "password"}
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded pr-10" 
        />
        <button 
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="relative">
        <label htmlFor="confirmPassword" className="block mb-2">Confirmer le mot de passe</label>
        <input 
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded pr-10" 
        />
        <button 
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Créer un compte
      </button>
    </form>
  );
};

export default SignupForm;