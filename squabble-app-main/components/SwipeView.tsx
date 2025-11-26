import React from 'react';
import { View } from '../types';
import { useAppStore } from '../store/appStore';
import { FighterCard } from './FighterCard';
import { MatchPopup } from './MatchPopup';
import { X, Check, Flame, Wifi, WifiOff } from 'lucide-react';

export const SwipeView: React.FC = () => {
  const {
    fighters,
    currentIndex,
    isLoading,
    newMatch,
    showDuck,
    isCloudStorage,
    setNewMatch,
    setSelectedMatch,
    setCurrentView,
    handleSwipe,
    handleSuperLike
  } = useAppStore();

  const handleChat = () => {
    const { newMatch, setSelectedMatch, setNewMatch, setCurrentView } = useAppStore.getState();
    if (newMatch) {
      setSelectedMatch(newMatch);
      setNewMatch(null);
      setCurrentView(View.CHAT);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800 bg-black/50 backdrop-blur z-10 relative">
        <h1 className="text-3xl font-heading font-bold text-squabble-red tracking-widest italic animate-laser-pulse text-shadow-laser">SQUABBLE</h1>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500">
          {isCloudStorage ? (
            <>
              <span className="text-green-500">Cloud</span>
              <Wifi size={12} className="text-green-500" />
            </>
          ) : (
            <>
              <span>Local</span>
              <WifiOff size={12} />
            </>
          )}
        </div>
      </div>

      {/* Match Popup Overlay */}
      {newMatch && (
        <MatchPopup
          match={newMatch}
          onClose={() => setNewMatch(null)}
          onChat={handleChat}
        />
      )}

      {/* Duck Animation Overlay */}
      {showDuck && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="animate-in zoom-in duration-300 flex flex-col items-center">
            <img
              src="https://media.tenor.com/On7j7xKzS4AAAAi/duck-run.gif"
              alt="You Ducked"
              className="w-64 h-64 object-contain drop-shadow-2xl rounded-2xl"
            />
            <h2 className="text-4xl font-heading font-bold text-yellow-400 mt-2 text-stroke-black drop-shadow-lg animate-pulse">YOU DUCKED!</h2>
          </div>
        </div>
      )}

      {/* Card Deck */}
      <div className="flex-1 relative p-4 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="text-squabble-red animate-pulse font-heading text-2xl">FINDING OPPONENTS...</div>
        ) : currentIndex < fighters.length ? (
          <div className="w-full h-full max-w-md relative">
            {/* Render next card below for stack effect */}
            {currentIndex + 1 < fighters.length && (
              <div className="absolute inset-0 transform scale-95 translate-y-4 opacity-50 z-0">
                <FighterCard fighter={fighters[currentIndex + 1]} active={true} onSuperLike={handleSuperLike} />
              </div>
            )}
            {/* Active Card */}
            <div className="absolute inset-0 z-10">
              <FighterCard fighter={fighters[currentIndex]} active={true} onSuperLike={handleSuperLike} />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="font-heading text-2xl mb-2">NO MORE FIGHTS</p>
            <p className="text-xs mb-4">Check back later or change your location.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-800 rounded-full text-sm text-white hover:bg-gray-700 uppercase font-bold"
            >
              Reload Area
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {currentIndex < fighters.length && !newMatch && fighters.length > 0 && (
        <div className="h-24 px-8 pb-6 flex items-center justify-center gap-8 z-20">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-700 text-red-500 flex items-center justify-center hover:scale-110 hover:bg-red-900/20 transition-all shadow-lg shadow-red-900/10"
          >
            <X size={32} strokeWidth={3} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-gray-900 border-2 border-squabble-red text-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-900/20 transition-all shadow-lg shadow-green-900/10"
          >
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};
