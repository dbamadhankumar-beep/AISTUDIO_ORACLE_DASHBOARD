import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()} // Prevent click from closing modal
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};