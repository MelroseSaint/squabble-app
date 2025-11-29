import React, { memo } from 'react';
import { useAppStore } from '../store/appStore';
import { View } from '../types';
import { Flame, MessageCircle, User, Map as MapIcon, ShieldAlert, DollarSign, Trophy } from 'lucide-react';

export const BottomNavigation: React.FC = memo(() => {
  const { currentView, matches, setCurrentView, setShowSafetyCenter } = useAppStore();

  // Don't show navigation on certain views
  if (currentView === View.CHAT ||
    currentView === View.STYLES ||
    currentView === View.SETTINGS ||
    currentView === View.ANALYTICS) {
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-fb-header border-t border-gray-700 flex items-center justify-around px-2 z-50">
        <button
          onClick={() => setCurrentView(View.SWIPE)}
          className={`flex flex-col items-center justify-center w-full h-full ${currentView === View.SWIPE ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <Flame size={24} className={currentView === View.SWIPE ? 'fill-current' : ''} />
        </button>
        <button
          onClick={() => setCurrentView(View.MAP)}
          className={`flex flex-col items-center justify-center w-full h-full ${currentView === View.MAP ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <MapIcon size={24} className={currentView === View.MAP ? 'fill-current' : ''} />
        </button>

        {/* Fade Duel Button */}
        <button
          onClick={() => setCurrentView(View.FADE_DUEL)}
          className={`flex flex-col items-center justify-center w-full h-full ${currentView === View.FADE_DUEL ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <DollarSign size={24} className={currentView === View.FADE_DUEL ? 'fill-current' : ''} />
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={() => setCurrentView(View.LEADERBOARD)}
          className={`flex flex-col items-center justify-center w-full h-full ${currentView === View.LEADERBOARD ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <Trophy size={24} className={currentView === View.LEADERBOARD ? 'fill-current' : ''} />
        </button>

        <button
          onClick={() => setCurrentView(View.MATCHES)}
          className={`flex flex-col items-center justify-center w-full h-full relative ${currentView === View.MATCHES ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <MessageCircle size={24} className={currentView === View.MATCHES ? 'fill-current' : ''} />
          {matches.length > 0 && (
            <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-fb-header"></span>
          )}
        </button>
        <button
          onClick={() => setCurrentView(View.PROFILE)}
          className={`flex flex-col items-center justify-center w-full h-full ${currentView === View.PROFILE ? 'text-fb-blue' : 'text-fb-text-secondary'}`}
        >
          <User size={24} className={currentView === View.PROFILE ? 'fill-current' : ''} />
        </button>
      </div>
    </>
  );
});
