import React from 'react';
import { StatsChart } from './StatsChart';
import { FighterStats, UserProfile } from '../types';
import { Camera, Settings, Edit2, Shield, BarChart2 } from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  onEditStyle: () => void;
  onOpenSettings: () => void;
  onViewAnalytics: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onEditStyle, onOpenSettings, onViewAnalytics }) => {
  // Mock stats visualization for the radar chart (could be added to settings later)
  const userStats: FighterStats = {
    strength: 65,
    speed: 70,
    anger: 40,
    durability: 80,
    crazy: 50
  };

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto">
      <div className="relative h-64 bg-gray-900">
        <img src="https://picsum.photos/500/300?grayscale" alt="Cover" className="w-full h-full object-cover opacity-50" />
        <div className="absolute -bottom-10 left-6">
            <div className="relative">
                <img src={`https://picsum.photos/seed/${userProfile.name}/200`} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-black object-cover" />
                <div className="absolute bottom-0 right-0 bg-squabble-red p-1 rounded-full border-2 border-black">
                    <Camera size={14} />
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12 px-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-heading font-bold uppercase">{userProfile.name} 
                    <span className="text-xl text-gray-500 ml-2 font-normal">{userProfile.age}</span>
                </h1>
                <div className="flex gap-2 text-[10px] uppercase font-bold text-gray-400 mt-1">
                    <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">{userProfile.weightClass}</span>
                    <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">{userProfile.experience}</span>
                    <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">{userProfile.stance}</span>
                </div>
                <p className="text-gray-300 text-sm mt-3 italic border-l-2 border-squabble-red pl-3">
                    "{userProfile.bio}"
                </p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={onViewAnalytics}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-squabble-red"
                    title="View Analytics"
                >
                    <BarChart2 size={20} />
                </button>
                <button 
                    onClick={onOpenSettings}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    title="Settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>

        {/* Fighting Style Section */}
        <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs uppercase font-bold text-gray-500 tracking-widest">Fighting Style</h3>
                <button 
                    onClick={onEditStyle}
                    className="text-squabble-red text-xs font-bold uppercase flex items-center gap-1 hover:text-white transition-colors"
                >
                    <Edit2 size={12} /> Change
                </button>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between shadow-lg">
                 <span className="font-heading text-2xl text-white uppercase tracking-wide">{userProfile.fightingStyle}</span>
                 <Shield size={24} className="text-gray-700" />
            </div>
        </div>

        <div className="mt-8 bg-squabble-dark rounded-2xl p-4 border border-gray-800">
            <h3 className="text-sm uppercase font-bold text-gray-500 mb-2 tracking-widest text-center">Your Battle Stats</h3>
            <StatsChart stats={userStats} />
        </div>

        <div className="mt-6 space-y-3 pb-8">
             <div className="p-4 bg-gray-900 rounded-xl flex justify-between items-center border-l-4 border-squabble-red">
                <span className="font-bold text-sm uppercase text-gray-400">Total Fights</span>
                <span className="font-heading text-2xl text-white">{userProfile.wins + userProfile.losses}</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 bg-gray-900 rounded-xl flex flex-col items-center border border-green-900/30">
                    <span className="font-bold text-[10px] uppercase text-green-500 mb-1">Wins</span>
                    <span className="font-heading text-3xl text-white">{userProfile.wins}</span>
                 </div>
                 <div className="p-4 bg-gray-900 rounded-xl flex flex-col items-center border border-red-900/30">
                    <span className="font-bold text-[10px] uppercase text-red-500 mb-1">Losses</span>
                    <span className="font-heading text-3xl text-white">{userProfile.losses}</span>
                 </div>
             </div>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
};