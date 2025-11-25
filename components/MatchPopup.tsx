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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
      
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

      <div className="w-full max-w-sm bg-squabble-dark border-2 border-squabble-red rounded-2xl p-6 flex flex-col items-center shadow-2xl shadow-red-900/50 relative overflow-hidden">
        {/* Background animation effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" />

        <h2 className="text-5xl font-heading font-bold text-white italic transform -rotate-2 mb-2">IT'S A</h2>
        <h2 className="text-6xl font-heading font-bold text-squabble-red italic transform -rotate-2 mb-8 drop-shadow-lg">SQUABBLE!</h2>

        <div className="relative w-32 h-32 mb-6">
             <div className="absolute inset-0 bg-squabble-red rounded-full animate-ping opacity-20"></div>
             <img
                src={match.fighter.imageUrl}
                alt={match.fighter.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-squabble-red shadow-xl relative z-10"
             />
             <div className="absolute -bottom-2 -right-2 bg-white text-black font-bold px-2 py-1 rounded border-2 border-black transform rotate-6 z-20">
                VS YOU
             </div>
        </div>

        <p className="text-center text-gray-300 mb-8 px-4">
            You and <span className="font-bold text-white">{match.fighter.name}</span> both want to throw hands.
        </p>

        <div className="flex flex-col w-full gap-3 z-10">
            <button
                onClick={onChat}
                className="w-full py-4 bg-squabble-red hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-wider"
            >
                <MessageCircle size={20} />
                Talk Trash
            </button>
            <button
                onClick={onClose}
                className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold rounded-xl transition-colors uppercase tracking-wider"
            >
                Keep Swiping
            </button>
        </div>
      </div>
    </div>
  );
};