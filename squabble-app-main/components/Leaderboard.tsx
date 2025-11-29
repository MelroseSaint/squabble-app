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
    <div className="flex flex-col h-full bg-transparent text-fb-text">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-fb-card border-b border-transparent rounded-t-lg">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 text-fb-text-secondary hover:text-fb-text mr-2">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-fb-text">Groups</h1>
            <p className="text-[10px] text-fb-text-secondary uppercase">Top Communities</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {leaderboardData.length > 0 ? (
          leaderboardData.map((player, index) => (
            <div key={player.id} className="flex items-center bg-fb-card p-3 rounded-lg border border-transparent hover:bg-fb-hover transition-colors">
              <div className="w-12 text-center text-lg font-bold text-fb-blue">{index + 1}</div>
              <div className="flex-1">
                <div className="font-bold text-fb-text">{player.name}</div>
                <div className="text-sm text-fb-text-secondary">{player.wins} wins · {player.losses} losses</div>
              </div>
              <div className="flex items-center">
                <Trophy size={16} className="text-yellow-500 mr-2" />
                <span className="font-bold text-fb-text">{player.wins}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-fb-text-secondary py-10">
            <p>No groups found.</p>
            <p>Join a community to start squabbling!</p>
          </div>
        )}
      </div>
    </div>
  );
};
