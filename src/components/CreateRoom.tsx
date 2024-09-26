import React, { useState } from 'react';

interface CreateRoomProps {
  onAddRoom: (room: { name: string; equipment: string }) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onAddRoom }) => {
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !equipment) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    onAddRoom({ name, equipment });
    setName('');
    setEquipment('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-[#25a8a6]">Ajouter une nouvelle salle</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la salle</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-[#25a8a6] bg-opacity-10 border border-[#25a8a6] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25a8a6] focus:border-[#25a8a6] text-gray-900 placeholder-gray-500 valid:bg-[#25a8a6] valid:bg-opacity-20"
          placeholder="Nom de la salle"
          required
        />
      </div>
      <div>
        <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Équipement</label>
        <input
          type="text"
          id="equipment"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-[#efa872] bg-opacity-10 border border-[#efa872] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#efa872] focus:border-[#efa872] text-gray-900 placeholder-gray-500 valid:bg-[#efa872] valid:bg-opacity-20"
          placeholder="Équipement de la salle"
          required
        />
      </div>
      {error && <p className="text-[#cf5e60] text-sm">{error}</p>}
      <button 
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#25a8a6] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25a8a6] transition duration-300"
      >
        Ajouter la salle
      </button>
    </form>
  );
};

export default CreateRoom;