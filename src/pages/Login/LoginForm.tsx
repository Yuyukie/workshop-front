import React, { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess: (email: string, password: string) => void;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#25a8a6] bg-opacity-10 border border-[#25a8a6] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25a8a6] focus:border-[#25a8a6] text-gray-900 placeholder-gray-500 valid:bg-[#25a8a6] valid:bg-opacity-20"
          placeholder="Votre email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#efa872] bg-opacity-10 border border-[#efa872] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#efa872] focus:border-[#efa872] text-gray-900 placeholder-gray-500 valid:bg-[#efa872] valid:bg-opacity-20"
          placeholder="Votre mot de passe"
        />
      </div>
      {error && <p className="text-[#cf5e60] text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#25a8a6] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25a8a6]"
      >
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;