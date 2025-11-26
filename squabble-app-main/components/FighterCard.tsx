import React, { useState } from 'react';
import { Fighter } from '../types';
import { MapPin, Trophy, Flame, Shield, Activity, Scale, Swords, Zap, Dumbbell, Star } from 'lucide-react';

interface FighterCardProps {
  fighter: Fighter;
  active: boolean;
  onSuperLike: () => void; // Callback for super like
}

export const FighterCard: React.FC<FighterCardProps> = ({ fighter, active, onSuperLike }) => {
  const [isSuperLiking, setIsSuperLiking] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isGlowing, setIsGlowing] = useState(false);

  if (!active) return null;

  const handleSuperLike = () => {
    setIsSuperLiking(true);
    onSuperLike();
    setTimeout(() => setIsSuperLiking(false), 1000); // Reset animation
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowPosition({ x, y });
    setIsGlowing(true);
  };

  const handleMouseLeave = () => {
    setIsGlowing(false);
  };

  // Determine card logic
  const wins = fighter.wins || 0;
  const losses = fighter.losses || 0;
  const streak = fighter.winStreak || 0;
  
  let borderColor = 'border-green-500'; // Default / Equal
  let recordColor = 'text-green-500';

  if (wins > losses) {
    borderColor = 'border-squabble-red';
    recordColor = 'text-squabble-red';
  } else if (losses > wins) {
    borderColor = 'border-blue-600';
    recordColor = 'text-blue-500';
  }

  // Determine if on a hot streak (e.g. 3 or more consecutive wins)
  const isHotStreak = streak >= 3;
  const compatibility = fighter.compatibility || 75;

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--glow-x': `${glowPosition.x}px`,
        '--glow-y': `${glowPosition.y}px`,
      } as React.CSSProperties}
      className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-squabble-dark border-4 ${borderColor} select-none transition-colors duration-300 animate-in fade-in fighter-card`}>
      {isGlowing && <div className="glow-effect" />}
      <div className="relative h-full w-full">
        {/* Image */}
        <img 
          src={fighter.imageUrl} 
          alt={fighter.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {fighter.badges && fighter.badges.map((badge, idx) => (
                <div key={idx} className="bg-black/60 backdrop-blur border border-gray-600 px-2 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                    <Shield size={10} className="text-yellow-500" />
                    {badge}
                </div>
            ))}
        </div>

        {/* Compatibility & Record */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
            {/* AI Match Score */}
            <div className="bg-squabble-dark/80 backdrop-blur-md px-3 py-1 rounded-full border border-squabble-red flex items-center gap-2 shadow-lg shadow-red-900/20 animate-laser-pulse text-shadow-laser">
                <Activity size={14} className="text-squabble-red animate-pulse" />
                <span className="font-heading font-bold text-lg text-white">
                    {compatibility}% MATCH
                </span>
            </div>

            <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700 flex items-center gap-2 animate-laser-pulse text-shadow-laser">
                <Trophy size={14} className={recordColor} />
                <span className={`font-bold font-heading text-lg ${recordColor}`}>
                    {wins} - {losses}
                </span>
            </div>

            {/* Streak Indicator */}
            {isHotStreak && (
                <div className="bg-orange-500/90 backdrop-blur-md px-3 py-1 rounded-full border border-orange-400 flex items-center gap-1 animate-pulse shadow-lg shadow-orange-500/50 animate-laser-pulse text-shadow-laser">
                    <Flame size={14} className="text-white fill-current" />
                    <span className="font-bold font-heading text-lg text-white">
                        {streak} WINS
                    </span>
                </div>
            )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 pb-24">
          
          <div className="absolute inset-0 flex items-center justify-center">
            {isSuperLiking && (
              <Star size={128} className="text-yellow-400 animate-ping" />
            )}
          </div>

          <div className="flex justify-between items-end">
             <div>
                <h2 className="text-4xl font-heading font-bold text-white uppercase tracking-wide leading-none shadow-black drop-shadow-md">
                  {fighter.name} <span className="text-2xl font-sans font-normal text-gray-300">{fighter.age}</span>
                </h2>
                <div className="flex items-center text-squabble-red font-bold uppercase text-sm mt-1">
                  <MapPin size={16} className="mr-1" />
                  {fighter.distance} miles away • {fighter.location}
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={handleSuperLike} className="bg-yellow-400 text-black p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                    <Star size={24} />
                </button>
                <div className="flex flex-col items-center justify-center bg-squabble-red text-white p-2 rounded-lg min-w-[60px] shadow-lg shadow-red-900/40">
                    <span className="text-xs font-bold">ANGER</span>
                    <span className="text-xl font-heading font-bold">{fighter.stats.anger}</span>
                </div>
             </div>
          </div>

          {/* Tale of the Tape Grid */}
          <div className="grid grid-cols-3 gap-2 mt-2">
             <div className="bg-gray-900/80 p-2 rounded border border-gray-700 flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Class</span>
                <span className="text-xs font-bold text-white">{fighter.weightClass || 'Open'}</span>
             </div>
             <div className="bg-gray-900/80 p-2 rounded border border-gray-700 flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Stance</span>
                <span className="text-xs font-bold text-white">{fighter.stance || 'Orthodox'}</span>
             </div>
             <div className="bg-gray-900/80 p-2 rounded border border-gray-700 flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Exp</span>
                <span className="text-xs font-bold text-white">{fighter.experience || 'Street'}</span>
             </div>
          </div>

          {/* Detailed Stats Bars */}
          <div className="flex gap-3 mt-1 px-1">
             <div className="flex-1">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                    <span className="flex items-center gap-1"><Dumbbell size={10} /> STR</span>
                    <span className="text-white">{fighter.stats.strength}</span>
                 </div>
                 <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${fighter.stats.strength}%` }}></div>
                 </div>
             </div>
             <div className="flex-1">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                    <span className="flex items-center gap-1"><Zap size={10} /> SPD</span>
                    <span className="text-white">{fighter.stats.speed}</span>
                 </div>
                 <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${fighter.stats.speed}%` }}></div>
                 </div>
             </div>
             <div className="flex-1">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                    <span className="flex items-center gap-1"><Shield size={10} /> DUR</span>
                    <span className="text-white">{fighter.stats.durability}</span>
                 </div>
                 <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${fighter.stats.durability}%` }}></div>
                 </div>
             </div>
          </div>

          <div className="flex gap-2 mt-2 text-xs text-gray-300">
             <span className="px-2 py-1 bg-gray-800 rounded border border-gray-700 flex items-center gap-1">
                 <Scale size={10} /> {fighter.height} / {fighter.weight}
             </span>
             <span className="px-2 py-1 bg-gray-800 rounded border border-gray-700 uppercase flex items-center gap-1">
                 <Swords size={10} /> {fighter.fightingStyle}
             </span>
          </div>

          <p className="text-gray-200 text-sm mt-2 line-clamp-2 italic drop-shadow-md">
            "{fighter.bio}"
          </p>

          <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
             <div 
                className="h-full bg-squabble-red" 
                style={{ width: `${fighter.stats.crazy}%` }}
             ></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            <span>Sanity</span>
            <span>Crazy Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};