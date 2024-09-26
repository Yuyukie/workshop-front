import React, { useState } from 'react';
import { parse, isValid, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MakeReservationProps {
  selectedDate: string;  // Changé de Date à string
  room: { id: string; nom: string };
  onClose: () => void;
  onReserve: () => Promise<void>;
  onCancelReservation?: () => Promise<void>; // Rendu optionnel
}

const MakeReservation: React.FC<MakeReservationProps> = ({ selectedDate, room, onClose, onReserve, onCancelReservation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const parsedDate = parse(selectedDate, 'dd MM yyyy', new Date());

    if (!isValid(parsedDate)) {
      setError("Date sélectionnée invalide");
      setIsLoading(false);
      return;
    }

    try {
      await onReserve();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!onCancelReservation) {
      setError("La fonction d'annulation n'est pas disponible");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onCancelReservation();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'annulation de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = format(parse(selectedDate, 'dd MM yyyy', new Date()), 'dd MMMM yyyy', { locale: fr });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-[#25a8a6]">{room.nom}</h2>
      <p className="text-lg mb-6 text-gray-700">Date : {formattedDate}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            className="flex-1 bg-[#25a8a6] text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#25a8a6] focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Réservation en cours...' : 'Confirmer la réservation'}
          </button>
          {onCancelReservation && (
            <button
              type="button"
              onClick={handleCancelReservation}
              className="flex-1 bg-[#cf5e60] text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#cf5e60] focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Annulation en cours...' : 'Annuler la réservation'}
            </button>
          )}
        </div>
      </form>
      {error && <p className="text-[#cf5e60] text-sm mt-2">{error}</p>}
      <button
        onClick={onClose}
        className="mt-4 text-[#25a8a6] hover:text-[#efa872] transition duration-300"
      >
        Fermer
      </button>
    </div>
  );
};

export default MakeReservation;