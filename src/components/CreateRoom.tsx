import React, { useState } from 'react';

interface CreateRoomProps {
  onAddRoom: (room: { name: string; equipment: string }) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onAddRoom }) => {
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoom({ name, equipment });
    setName('');
    setEquipment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Ajouter une nouvelle salle</h2>
      <input
        type="text"
        placeholder="Nom de la salle"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Équipement"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
      >
        Ajouter
      </button>
    </form>
  );
};

export default CreateRoom;