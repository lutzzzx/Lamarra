import React from 'react';
import { User } from '../types';
import { AuthForm } from './AuthForm';
import { X, Briefcase } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  defaultTab = 'login'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative text-left overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Badge Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Briefcase className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-zinc-900 dark:text-white">Lamarra</span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Job Tracker</span>
          </div>
        </div>

        {/* Unified Auth Form */}
        <AuthForm
          initialMode={defaultTab}
          isModal={true}
          onSuccess={(user, token) => {
            onSuccess(user, token);
            onClose();
          }}
        />

      </div>
    </div>
  );
};
