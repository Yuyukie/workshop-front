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
}

interface Reservation {
  _id: string;
  roomId: string;
  date: Date;
}

const WeeklyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ roomId: string, date: Date } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
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

  const fetchReservations = useCallback(async () => {
    if (rooms.length === 0) return;

    try {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      console.log('Fetching reservations for:', weekStart, 'to', weekEnd);
      const startParam = encodeURIComponent(weekStart.toISOString().split('T')[0]);
      const endParam = encodeURIComponent(weekEnd.toISOString().split('T')[0]);
      const response = await fetch(`http://localhost:1234/api/rooms/reservations?start=${startParam}&end=${endParam}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Received reservations:', data);
        const localReservations = data.map((res: { date: string; [key: string]: any }) => ({
          ...res,
          date: new Date(res.date)
        }));
        setReservations(localReservations);
      } else {
        const errorData = await response.json();
        console.error('Server responded with an error:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des réservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  }, [currentDate, rooms]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchReservations();
    }
  }, [currentDate, rooms, fetchReservations]);

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
      fetchReservations();
      setError(null);
    } catch (error) {
      console.error('Error adding room:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCellClick = (roomId: string, date: Date) => {
    setSelectedCell({ roomId, date });
    setModalContent('makeReservation');
    setIsModalOpen(true);
  };

  const handleReservation = async () => {
    if (!selectedCell) return;

    try {
      const reservationDate = new Date(selectedCell.date);
      reservationDate.setUTCHours(0, 0, 0, 0);

      const response = await fetch('http://localhost:1234/api/rooms/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          roomId: selectedCell.roomId,
          date: reservationDate.toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la réservation');
      }

      const data = await response.json();
      console.log('Réservation réussie:', data);
      fetchReservations();
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const isReserved = (roomId: string, date: Date) => {
    const checkDate = new Date(date);
    checkDate.setUTCHours(0, 0, 0, 0);
    return reservations.some(res => 
      res.roomId === roomId && 
      new Date(res.date).toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]
    );
  };

  const formatLocalDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
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
                {isReserved(room._id, day) ? (
                  <span title={formatLocalDate(reservations.find(res => res.roomId === room._id && res.date.toDateString() === day.toDateString())?.date || day)}>
                    Réservé
                  </span>
                ) : ''}
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
            onReserve={handleReservation}
          />
        )}
        {error && <div className="text-red-500">{error}</div>}
      </Modal>
    </div>
  );
};

export default WeeklyCalendar;