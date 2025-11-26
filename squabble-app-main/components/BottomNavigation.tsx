import React from 'react';
import { useAppStore } from '../store/appStore';
import { View } from '../types';
import { Flame, MessageCircle, User, Map as MapIcon, ShieldAlert, DollarSign, Trophy } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentView, matches, setCurrentView, setShowSafetyCenter } = useAppStore();

  // Don't show navigation on certain views
  if (currentView === View.CHAT || 
      currentView === View.STYLES || 
      currentView === View.SETTINGS || 
      currentView === View.ANALYTICS || 
      currentView === View.FADE_DUEL) {
    return null;
  }

  return (
    <>
      {/* Global Safety Shield */}
      <button
        onClick={() => setShowSafetyCenter(true)}
        className="absolute top-4 left-4 z-[60] bg-red-900/80 hover:bg-red-700 text-white p-2 rounded-full border border-red-500 shadow-lg shadow-red-900/50 backdrop-blur-sm transition-transform hover:scale-105"
        title="Emergency Safety Center"
      >
        <ShieldAlert size={20} className="animate-pulse" />
      </button>

      {/* Bottom Navigation */}
      <div className="h-16 bg-squabble-dark border-t border-gray-800 flex items-center justify-around px-2 z-50 mt-6 rounded-lg">
        <button
          onClick={() => setCurrentView(View.SWIPE)}
          className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.SWIPE ? 'text-squabble-red' : 'text-gray-500'}`}
        >
          <Flame size={20} />
        </button>
        <button
          onClick={() => setCurrentView(View.MAP)}
          className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.MAP ? 'text-squabble-red' : 'text-gray-500'}`}
        >
          <MapIcon size={20} />
        </button>

        {/* Fade Duel Button */}
        <button
          onClick={() => setCurrentView(View.FADE_DUEL)}
          className="flex flex-col items-center justify-center w-12 h-full text-gray-500 hover:text-green-500 transition-colors"
        >
          <DollarSign size={20} />
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={() => setCurrentView(View.LEADERBOARD)}
          className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.LEADERBOARD ? 'text-squabble-red' : 'text-gray-500'}`}
        >
          <Trophy size={20} />
        </button>

        <button
          onClick={() => setCurrentView(View.MATCHES)}
          className={`flex flex-col items-center justify-center w-12 h-full relative ${currentView === View.MATCHES ? 'text-squabble-red' : 'text-gray-500'}`}
        >
          <MessageCircle size={20} />
          {matches.length > 0 && (
            <span className="absolute top-3 right-2 w-2 h-2 bg-squabble-red rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setCurrentView(View.PROFILE)}
          className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.PROFILE ? 'text-squabble-red' : 'text-gray-500'}`}
        >
          <User size={20} />
        </button>
      </div>
    </>
  );
};
