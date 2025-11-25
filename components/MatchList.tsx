import React, { useState } from 'react';
import { Match } from '../types';
import { MessageSquare, Calendar, Trash2, AlertTriangle } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
}

export const MatchList: React.FC<MatchListProps> = ({ matches, onSelectMatch, onDeleteMatch }) => {
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);

  const confirmDelete = () => {
    if (matchToDelete) {
      onDeleteMatch(matchToDelete.id);
      setMatchToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 overflow-y-auto relative">
      <h2 className="text-3xl font-heading font-bold text-squabble-red mb-6 uppercase tracking-wider">Your Opponents</h2>
      
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
           <p>No fights scheduled yet.</p>
           <p className="text-sm">Swipe right to get aggressive.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
           {matches.map((match) => (
             <div 
                key={match.id} 
                onClick={() => onSelectMatch(match)}
                className="flex items-center gap-4 p-3 rounded-xl bg-squabble-gray border border-transparent hover:border-squabble-red transition-all cursor-pointer active:scale-95 group"
             >
                <div className="relative">
                  <img 
                    src={match.fighter.imageUrl} 
                    alt={match.fighter.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-squabble-red"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-heading uppercase">{match.fighter.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{match.lastMessage || "Start beef now..."}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setMatchToDelete(match);
                        }}
                        className="p-2 text-gray-600 hover:text-squabble-red hover:bg-gray-800 rounded-full transition-colors"
                        title="Cancel Fight"
                    >
                        <Trash2 size={18} />
                    </button>
                    <MessageSquare className="text-squabble-red group-hover:text-white transition-colors" size={20} />
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-squabble-dark border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-squabble-red" />
                    </div>
                    
                    <h3 className="text-2xl font-heading font-bold text-white uppercase mb-2">Cancel Fight?</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Are you sure you want to back out of your beef with <span className="font-bold text-white">{matchToDelete.fighter.name}</span>? 
                        <br/>
                        <span className="italic text-xs text-squabble-red mt-2 block">That's kinda weak, just saying.</span>
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setMatchToDelete(null)}
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-sm uppercase"
                        >
                            Nevermind, I'm Ready
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 py-3 bg-squabble-red hover:bg-red-700 text-white font-bold rounded-xl text-sm uppercase"
                        >
                            Yeah, I'm Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};