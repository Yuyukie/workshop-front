import React, { useState } from 'react';
import { parse, isValid } from 'date-fns';

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

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Réserver {room.nom}</h2>
      <p>Date : {selectedDate}</p> {/* selectedDate est déjà au format 'JJ MM YYYY' */}
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Réservation en cours...' : 'Confirmer la réservation'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={onClose}
        className="mt-2 text-gray-600"
        disabled={isLoading}
      >
        Fermer
      </button>
      {onCancelReservation && (
        <button
          onClick={handleCancelReservation}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
          disabled={isLoading}
        >
          {isLoading ? 'Annulation en cours...' : 'Annuler la réservation'}
        </button>
      )}
    </div>
  );
};

export default MakeReservation;