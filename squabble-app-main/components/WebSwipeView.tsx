import React, { useState } from 'react';
import { View } from '../types';
import { useAppStore } from '../store/appStore';
import { FighterCard } from './FighterCard';
import { MatchPopup } from './MatchPopup';
import { X, Check, Flame, Wifi, WifiOff, RefreshCw, Filter, MapPin } from 'lucide-react';

export const WebSwipeView: React.FC = () => {
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

  const [showFilters, setShowFilters] = useState(false);

  const handleChat = () => {
    const { newMatch, setSelectedMatch, setNewMatch, setCurrentView } = useAppStore.getState();
    if (newMatch) {
      setSelectedMatch(newMatch);
      setNewMatch(null);
      setCurrentView(View.CHAT);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    } else if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === 'ArrowUp') {
      handleSuperLike();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, fighters]);

  return (
    <div className="flex flex-col h-full relative">
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
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/50 backdrop-blur-sm">
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

      {/* Header with controls */}
      <div className="bg-fb-card border-b border-gray-700 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold font-heading text-squabble-red">FIGHTERS NEARBY</h1>
            <div className="flex items-center space-x-2 text-sm text-fb-text-secondary">
              <MapPin size={16} />
              <span>Your Area</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              {isCloudStorage ? (
                <>
                  <Wifi className="text-green-400" size={16} />
                  <span className="text-green-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="text-yellow-400" size={16} />
                  <span className="text-yellow-400">Offline</span>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-fb-hover transition-colors"
              title="Filters"
            >
              <Filter size={20} />
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg hover:bg-fb-hover transition-colors"
              title="Refresh fighters"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-fb-bg rounded-lg border border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-fb-text-secondary mb-2">Distance</label>
                <select className="w-full bg-fb-card border border-gray-700 rounded p-2 text-sm text-fb-text">
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Within 25 miles</option>
                  <option>Within 50 miles</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-fb-text-secondary mb-2">Experience</label>
                <select className="w-full bg-fb-card border border-gray-700 rounded p-2 text-sm text-fb-text">
                  <option>Any</option>
                  <option>Novice</option>
                  <option>Amateur</option>
                  <option>Pro</option>
                  <option>Street</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-fb-text-secondary mb-2">Weight Class</label>
                <select className="w-full bg-fb-card border border-gray-700 rounded p-2 text-sm text-fb-text">
                  <option>Any</option>
                  <option>Featherweight</option>
                  <option>Lightweight</option>
                  <option>Welterweight</option>
                  <option>Heavyweight</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-squabble-red animate-pulse font-heading text-2xl">FINDING OPPONENTS...</p>
          </div>
        ) : currentIndex < fighters.length ? (
          <div className="relative w-full max-w-2xl" style={{ height: '600px' }}>
            {/* Render next cards below for stack effect */}
            {currentIndex + 2 < fighters.length && (
              <div className="absolute inset-0 transform scale-90 translate-y-8 opacity-30 z-0">
                <FighterCard fighter={fighters[currentIndex + 2]} active={false} onSuperLike={handleSuperLike} />
              </div>
            )}
            {currentIndex + 1 < fighters.length && (
              <div className="absolute inset-0 transform scale-95 translate-y-4 opacity-50 z-0">
                <FighterCard fighter={fighters[currentIndex + 1]} active={false} onSuperLike={handleSuperLike} />
              </div>
            )}
            {/* Active Card */}
            <div className="absolute inset-0 z-10">
              <FighterCard fighter={fighters[currentIndex]} active={true} onSuperLike={handleSuperLike} />
            </div>
          </div>
        ) : (
          <div className="text-center text-fb-text-secondary">
            <div className="mb-6">
              <X size={64} className="mx-auto text-gray-600 mb-4" />
              <h2 className="text-3xl font-heading font-bold mb-2">NO MORE FIGHTS</h2>
              <p className="text-sm mb-6">Check back later or expand your search area.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-squabble-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors uppercase"
              >
                Reload Area
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="ml-3 px-6 py-3 bg-fb-card text-fb-text rounded-lg font-bold hover:bg-fb-hover transition-colors uppercase border border-gray-700"
              >
                Adjust Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentIndex < fighters.length && !newMatch && fighters.length > 0 && (
        <div className="bg-fb-card border-t border-gray-700 p-6 rounded-b-lg">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleSwipe('left')}
                className="w-20 h-20 rounded-full bg-gray-900 border-2 border-gray-700 text-red-500 flex items-center justify-center hover:scale-110 hover:bg-red-900/20 transition-all shadow-lg shadow-red-900/10 group"
                title="Pass (Arrow Left)"
              >
                <X size={48} strokeWidth={3} className="group-hover:scale-110" />
              </button>
              <span className="text-xs text-fb-text-secondary uppercase font-bold">Pass</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleSuperLike}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-blue-900/30 group"
                title="Super Like (Arrow Up)"
              >
                <Flame size={32} className="group-hover:scale-110" />
              </button>
              <span className="text-xs text-fb-text-secondary uppercase font-bold">Super Like</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleSwipe('right')}
                className="w-20 h-20 rounded-full bg-gray-900 border-2 border-squabble-red text-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-900/20 transition-all shadow-lg shadow-green-900/10 group"
                title="Fight (Arrow Right)"
              >
                <Check size={48} strokeWidth={3} className="group-hover:scale-110" />
              </button>
              <span className="text-xs text-fb-text-secondary uppercase font-bold">Fight</span>
            </div>
          </div>

          {/* Keyboard hints */}
          <div className="mt-4 text-center">
            <p className="text-xs text-fb-text-secondary">
              Use <kbd className="px-2 py-1 bg-fb-bg rounded">←</kbd> Pass | 
              <kbd className="px-2 py-1 bg-fb-bg rounded mx-1">↑</kbd> Super Like | 
              <kbd className="px-2 py-1 bg-fb-bg rounded ml-1">→</kbd> Fight
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
