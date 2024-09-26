import React from 'react';
import Modal from './Modal';

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomName: string;
}

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({ isOpen, onClose, onConfirm, roomName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Supprimer la salle</h2>
        <p className="mb-6">Êtes-vous sûr de vouloir supprimer la salle "{roomName}" ?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition duration-300 mr-4"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRoomModal;