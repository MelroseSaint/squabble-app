import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Fighter } from '../types';

interface VideoCallModalProps {
  fighter: Fighter;
  onEndCall: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ fighter, onEndCall }) => {
  const [status, setStatus] = useState('Connecting...');
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStatus('Ringing...'), 1000));
    timers.push(setTimeout(() => setStatus('Connecting secure line...'), 2500));
    timers.push(setTimeout(() => setStatus('Opponent unavailable (Probably scared)'), 5000));
    
    // Auto close after failed connection
    timers.push(setTimeout(() => onEndCall(), 7000));

    return () => timers.forEach(clearTimeout);
  }, [onEndCall]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Remote Video (Mock) */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
        <img src={fighter.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl" alt="" />
        <div className="relative z-10 flex flex-col items-center animate-pulse">
            <img src={fighter.imageUrl} className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover mb-4 shadow-2xl" alt="" />
            <h2 className="text-2xl font-heading font-bold text-white uppercase">{fighter.name}</h2>
            <p className="text-squabble-red font-bold animate-pulse mt-2">{status}</p>
        </div>
      </div>

      {/* Local Controls */}
      <div className="h-32 bg-squabble-dark rounded-t-3xl border-t border-gray-800 flex items-center justify-evenly pb-6">
         <button 
            onClick={() => setVideoOff(!videoOff)}
            className={`p-4 rounded-full ${videoOff ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
         >
             {videoOff ? <VideoOff size={24} /> : <Video size={24} />}
         </button>
         
         <button 
            onClick={onEndCall}
            className="p-6 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg shadow-red-900/50 transform hover:scale-110 transition-all"
         >
             <PhoneOff size={32} />
         </button>
         
         <button 
            onClick={() => setMuted(!muted)}
            className={`p-4 rounded-full ${muted ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
         >
             {muted ? <MicOff size={24} /> : <Mic size={24} />}
         </button>
      </div>
    </div>
  );
};