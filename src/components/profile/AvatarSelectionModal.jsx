import React from 'react';
import { X } from 'lucide-react';
import { AVATAR_IDS } from '../../data/avatars';
import UserAvatar from '../ui/UserAvatar';

const AvatarSelectionModal = ({ isOpen, onClose, onSelect, currentAvatarId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200 border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Choose Your Persona</h3>
        <p className="text-gray-500 text-center text-sm mb-6">Select a face that matches your vibe.</p>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {AVATAR_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                currentAvatarId === id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' 
                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <UserAvatar avatarId={id} size="md" className="shadow-sm" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-indigo-600">
                {id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;
