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
        <div className="flex flex-col h-full bg-transparent text-fb-text overflow-y-auto">
            <div className="relative h-64 bg-fb-card">
                <img src="https://picsum.photos/500/300?grayscale" alt="Cover" className="w-full h-full object-cover opacity-50" />
                <div className="absolute -bottom-10 left-6">
                    <div className="relative">
                        <img src={`https://picsum.photos/seed/${userProfile.name}/200`} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-fb-bg object-cover" />
                        <div className="absolute bottom-0 right-0 bg-fb-hover p-1 rounded-full border-2 border-fb-bg">
                            <Camera size={14} className="text-fb-text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 px-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-fb-text">{userProfile.name}
                            <span className="text-xl text-fb-text-secondary ml-2 font-normal">{userProfile.age}</span>
                        </h1>
                        <div className="flex gap-2 text-[10px] uppercase font-bold text-fb-text-secondary mt-1">
                            <span className="bg-fb-hover px-2 py-1 rounded border border-transparent">{userProfile.weightClass}</span>
                            <span className="bg-fb-hover px-2 py-1 rounded border border-transparent">{userProfile.experience}</span>
                            <span className="bg-fb-hover px-2 py-1 rounded border border-transparent">{userProfile.stance}</span>
                        </div>
                        <p className="text-fb-text text-sm mt-3 italic border-l-2 border-fb-blue pl-3">
                            "{userProfile.bio}"
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onViewAnalytics}
                            className="p-2 bg-fb-hover rounded-full hover:bg-gray-600 transition-colors text-fb-text"
                            title="View Analytics"
                        >
                            <BarChart2 size={20} />
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className="p-2 bg-fb-hover rounded-full hover:bg-gray-600 transition-colors text-fb-text"
                            title="Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Fighting Style Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs uppercase font-bold text-fb-text-secondary tracking-widest">Fighting Style</h3>
                        <button
                            onClick={onEditStyle}
                            className="text-fb-blue text-xs font-bold uppercase flex items-center gap-1 hover:text-white transition-colors"
                        >
                            <Edit2 size={12} /> Change
                        </button>
                    </div>
                    <div className="p-4 bg-fb-card rounded-xl border border-transparent flex items-center justify-between shadow-sm">
                        <span className="font-bold text-2xl text-fb-text uppercase tracking-wide">{userProfile.fightingStyle}</span>
                        <Shield size={24} className="text-fb-text-secondary" />
                    </div>
                </div>

                <div className="mt-8 bg-fb-card rounded-2xl p-4 border border-transparent">
                    <h3 className="text-sm uppercase font-bold text-fb-text-secondary mb-2 tracking-widest text-center">Your Battle Stats</h3>
                    <StatsChart stats={userStats} />
                </div>

                <div className="mt-6 space-y-3 pb-8">
                    <div className="p-4 bg-fb-card rounded-xl flex justify-between items-center border-l-4 border-fb-blue">
                        <span className="font-bold text-sm uppercase text-fb-text-secondary">Total Fights</span>
                        <span className="font-bold text-2xl text-fb-text">{userProfile.wins + userProfile.losses}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-fb-card rounded-xl flex flex-col items-center border border-transparent">
                            <span className="font-bold text-[10px] uppercase text-green-500 mb-1">Wins</span>
                            <span className="font-bold text-3xl text-fb-text">{userProfile.wins}</span>
                        </div>
                        <div className="p-4 bg-fb-card rounded-xl flex flex-col items-center border border-transparent">
                            <span className="font-bold text-[10px] uppercase text-red-500 mb-1">Losses</span>
                            <span className="font-bold text-3xl text-fb-text">{userProfile.losses}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-24"></div>
        </div>
    );
};