import React, { useState, useEffect, useCallback } from 'react';
import { format, addWeeks, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from './Modal';
import CreateRoom from './CreateRoom';
import MakeReservation from './MakeReservation';

interface Room {
  _id: string;
  name: string;
  equipment: string;
  reservations: string[]; // Ajouté pour stocker les réservations
}

const WeeklyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ roomId: string, date: string } | null>(null);
  const [modalContent, setModalContent] = useState<'createRoom' | 'makeReservation' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1234/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const changeWeek = (amount: number) => {
    setCurrentDate(addWeeks(currentDate, amount));
  };

  const handleAddRoom = async (newRoom: { name: string; equipment: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:1234/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRoom)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la salle');
      }

      const data = await response.json();
      console.log('Salle créée avec succès:', data);
      setIsModalOpen(false);
      await fetchRooms();
      setError(null);
    } catch (error) {
      console.error('Error adding room:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCellClick = (roomId: string, date: Date) => {
    const formattedDate = format(date, 'dd MM yyyy');
    setSelectedCell({ roomId, date: formattedDate });
    setModalContent('makeReservation');
    setIsModalOpen(true);
  };

  const handleReservation = async () => {
    if (!selectedCell) return;

    try {
      console.log('Sending reservation request:', {
        roomId: selectedCell.roomId,
        date: selectedCell.date // Déjà au format 'JJ MM YYYY'
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:1234/api/rooms/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedCell.roomId,
          date: selectedCell.date // Déjà au format 'JJ MM YYYY'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Échec de la réservation');
      }

      const data = await response.json();
      console.log('Réservation réussie:', data);
      await fetchRooms();
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const isReserved = (roomId: string, date: Date) => {
    const room = rooms.find(r => r._id === roomId);
    if (!room) return false;
    const dateString = format(date, 'dd MM yyyy');
    return room.reservations.includes(dateString);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => changeWeek(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
        >
          Semaine précédente
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button 
          onClick={() => changeWeek(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
        >
          Semaine suivante
        </button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        <div className="font-bold text-center">Salles</div>
        {days.map((day) => (
          <div key={day.toString()} className="font-bold text-center">
            {format(day, 'EEEE', { locale: fr })}
            <div>{format(day, 'd')}</div>
          </div>
        ))}
        {rooms.map((room) => (
          <React.Fragment key={room._id}>
            <div className="font-bold">{room.name}</div>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={`border p-2 cursor-pointer ${
                  isReserved(room._id, day) 
                    ? 'bg-yellow-200 hover:bg-yellow-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCellClick(room._id, day)}
              >
                {isReserved(room._id, day) ? 'Réservé' : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <button 
        onClick={() => {
          setModalContent('createRoom');
          setIsModalOpen(true);
        }}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
      >
        + Ajouter une salle
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === 'createRoom' && (
          <CreateRoom onAddRoom={handleAddRoom} />
        )}
        {modalContent === 'makeReservation' && selectedCell && (
          <MakeReservation
            selectedDate={selectedCell.date}
            room={{
              id: selectedCell.roomId,
              nom: rooms.find(room => room._id === selectedCell.roomId)?.name || ''
            }}
            onClose={() => setIsModalOpen(false)}
            onReserve={handleReservation}
          />
        )}
        {error && <div className="text-red-500">{error}</div>}
      </Modal>
    </div>
  );
};

export default WeeklyCalendar;