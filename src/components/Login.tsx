import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Mot de passe</label>
            <input type="password" id="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;