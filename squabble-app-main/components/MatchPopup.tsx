import React from 'react';
import { Match } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface MatchPopupProps {
  match: Match;
  onClose: () => void;
  onChat: () => void;
}

export const MatchPopup: React.FC<MatchPopupProps> = ({ match, onClose, onChat }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-fb-bg/90 backdrop-blur-sm p-6 animate-in fade-in duration-300">

      {/* Hidden Music Player - Kendrick Lamar 'Squabble Up' */}
      <div className="hidden">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/NYH6Oa4PXlY?autoplay=1&start=0"
          title="Squabble Up"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      <div className="w-full max-w-sm bg-fb-card border border-transparent rounded-2xl p-6 flex flex-col items-center shadow-2xl relative overflow-hidden">
        {/* Background animation effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-fb-blue/10 to-transparent pointer-events-none" />

        <h2 className="text-4xl font-bold text-fb-text mb-2">You're Friends!</h2>
        <h2 className="text-lg font-bold text-fb-text-secondary mb-8">You and {match.fighter.name} are connected.</h2>

        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-fb-blue rounded-full animate-ping opacity-20"></div>
          <img
            src={match.fighter.imageUrl}
            alt={match.fighter.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-fb-blue shadow-xl relative z-10"
          />
          <div className="absolute -bottom-2 -right-2 bg-fb-card text-fb-blue font-bold px-2 py-1 rounded border border-fb-blue transform rotate-6 z-20 text-xs">
            CONNECTED
          </div>
        </div>

        <p className="text-center text-fb-text-secondary mb-8 px-4 text-sm">
          You can now message each other and see updates.
        </p>

        <div className="flex flex-col w-full gap-3 z-10">
          <button
            onClick={onChat}
            className="w-full py-3 bg-fb-blue hover:bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
          >
            <MessageCircle size={20} />
            Send Message
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-fb-hover hover:bg-gray-600 text-fb-text font-bold rounded-lg transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
};