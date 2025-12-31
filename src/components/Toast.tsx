import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Notification } from '../types';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const bgColors = {
    success: 'bg-green-900/90 border-green-500',
    error: 'bg-red-900/90 border-red-500',
    info: 'bg-blue-900/90 border-blue-500',
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <Info size={20} className="text-blue-400" />,
  };

  return (
    <div className={`fixed top-4 left-4 right-4 z-[999] flex items-center justify-between p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-top duration-300 ${bgColors[notification.type]}`}>
      <div className="flex items-center gap-3">
        {icons[notification.type]}
        <span className="text-sm font-bold text-white uppercase tracking-wide">{notification.message}</span>
      </div>
      <button onClick={onClose} className="text-white/50 hover:text-white">
        <X size={18} />
      </button>
    </div>
  );
};