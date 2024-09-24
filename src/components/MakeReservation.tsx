import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MakeReservationProps {
  selectedDate: Date;
  onReserve: () => void;
}

const MakeReservation: React.FC<MakeReservationProps> = ({ selectedDate, onReserve }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Réserver une salle</h2>
      <p>Voulez-vous réserver cette salle pour le {format(selectedDate, 'dd/MM/yyyy', { locale: fr })} ?</p>
      <button 
        onClick={onReserve}
        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 mt-4"
      >
        Confirmer la réservation
      </button>
    </div>
  );
};

export default MakeReservation;