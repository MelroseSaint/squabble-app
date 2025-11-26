import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy } from 'lucide-react';
import { getLeaderboard } from '../services/db';
import { UserProfile } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [leaderboardData, setLeaderboardData] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboardData(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-squabble-dark border-b border-gray-800">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-white mr-2">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold tracking-wider uppercase text-yellow-500 italic">Leaderboard</h1>
            <p className="text-[10px] text-gray-500 uppercase">Top Squabblers</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {leaderboardData.length > 0 ? (
          leaderboardData.map((player, index) => (
            <div key={player.id} className="flex items-center bg-gray-900 p-3 rounded-lg border border-gray-800">
              <div className="w-12 text-center text-lg font-bold text-yellow-500">{index + 1}</div>
              <div className="flex-1">
                <div className="font-bold text-white">{player.name}</div>
                <div className="text-sm text-gray-400">{player.wins}-{player.losses}</div>
              </div>
              <div className="flex items-center">
                <Trophy size={16} className="text-yellow-500 mr-2" />
                <span className="font-bold text-white">{player.wins}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>The leaderboard is currently empty.</p>
            <p>Win some squabbles to get on the board!</p>
          </div>
        )}
      </div>
    </div>
  );
};
