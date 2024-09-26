import React, { useState, useEffect, useCallback } from 'react';
import { format, addWeeks, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from './Modal';
import CreateRoom from './CreateRoom';
import MakeReservation from './MakeReservation';
import DeleteRoomModal from './DeleteRoomModal';

interface Room {
  _id: string;
  name: string;
  equipment: string;
  reservations: string[];
}

const WeeklyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ roomId: string, date: string } | null>(null);
  const [modalContent, setModalContent] = useState<'createRoom' | 'makeReservation' | null>(null);
  const [userGrade, setUserGrade] = useState<string>('visiteur');
  const [error, setError] = useState<string | null>(null);  // Ajout de cette ligne
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
      setError('Erreur lors de la récupération des salles');
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    // Récupérer le grade de l'utilisateur depuis le localStorage
    const grade = localStorage.getItem('userGrade') || 'visiteur';
    setUserGrade(grade);

    // Ajout du test pour vérifier le grade
    console.log('Grade de l\'utilisateur:', grade);
    switch(grade) {
      case 'visiteur':
        console.log('L\'utilisateur est un visiteur');
        break;
      case 'utilisateur':
        console.log('L\'utilisateur est un utilisateur standard');
        break;
      case 'admin':
        console.log('L\'utilisateur est un administrateur');
        break;
      default:
        console.log('Grade non reconnu');
    }
  }, [fetchRooms]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const changeWeek = (amount: number) => {
    setCurrentDate(addWeeks(currentDate, amount));
  };

  const handleCellClick = (roomId: string, date: Date) => {
    if (userGrade === 'visiteur') {
      // Les visiteurs ne peuvent pas interagir avec les cellules
      return;
    }
    const formattedDate = format(date, 'dd MM yyyy');
    setSelectedCell({ roomId, date: formattedDate });
    setModalContent('makeReservation');
    setIsModalOpen(true);
  };

  const makeReservation = async (roomId: string, date: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch('http://localhost:1234/api/rooms/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId, date })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }

      const data = await response.json();
      console.log('Réservation réussie:', data);
      await fetchRooms(); // Rafraîchir les données des salles
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError(
        error instanceof Error ? error.message : 'Erreur lors de la réservation'
      );
    }
  };

  const cancelReservation = async (roomId: string, date: string) => {
    try {
      const response = await fetch(`http://localhost:1234/api/rooms/${roomId}/reservations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      await fetchRooms(); // Rafraîchir les données des salles
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      setError('Erreur lors de l\'annulation de la réservation');
    }
  };

  const isReserved = (roomId: string, date: Date) => {
    const room = rooms.find(r => r._id === roomId);
    if (!room) return false;
    const dateString = format(date, 'dd MM yyyy');
    return room.reservations.includes(dateString);
  };

  const handleRoomClick = (room: Room) => {
    if (userGrade === 'admin') {
      setSelectedRoom(room);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteRoom = async () => {
    if (selectedRoom) {
      try {
        const response = await fetch(`http://localhost:1234/api/rooms/${selectedRoom._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          await fetchRooms(); // Rafraîchir la liste des salles
          setShowDeleteModal(false);
        } else {
          throw new Error('Erreur lors de la suppression de la salle');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la salle:', error);
        setError('Erreur lors de la suppression de la salle');
      }
    }
  };

  const handleAddRoom = async (room: { name: string; equipment: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch('http://localhost:1234/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(room)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la salle');
      }

      await fetchRooms(); // Rafraîchir la liste des salles
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de la salle');
    }
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
            <div 
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => handleRoomClick(room)}
            >
              {room.name}
            </div>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={`border p-2 ${
                  isReserved(room._id, day) 
                    ? 'bg-yellow-200' 
                    : userGrade !== 'visiteur' ? 'hover:bg-gray-100 cursor-pointer' : ''
                }`}
                onClick={() => handleCellClick(room._id, day)}
              >
                {isReserved(room._id, day) ? 'Réservé' : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {userGrade !== 'visiteur' && (
        <>
          {userGrade === 'admin' && (
            <button 
              onClick={() => {
                setModalContent('createRoom');
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
            >
              + Ajouter une salle
            </button>
          )}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {modalContent === 'createRoom' && userGrade === 'admin' && (
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
                onReserve={() => makeReservation(selectedCell.roomId, selectedCell.date)}
                onCancelReservation={() => cancelReservation(selectedCell.roomId, selectedCell.date)}
              />
            )}
          </Modal>
        </>
      )}
      <DeleteRoomModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRoom}
        roomName={selectedRoom?.name || ''}
      />
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default WeeklyCalendar;