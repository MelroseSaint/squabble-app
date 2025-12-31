import React, { useEffect, useRef } from 'react';
import { Fighter } from '../types';
import { Crosshair, MapPin, Eye } from 'lucide-react';

interface MapViewProps {
  fighters: Fighter[];
  onSelectFighter: (fighter: Fighter) => void;
}

export const MapView: React.FC<MapViewProps> = ({ fighters, onSelectFighter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;

    const drawRadar = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Circles
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Draw Scanning Line (Animation would go here, simplified for static render)
      ctx.strokeStyle = 'rgba(229, 9, 20, 0.2)';
      ctx.fillStyle = 'rgba(229, 9, 20, 0.1)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, -Math.PI / 4, 0);
      ctx.fill();

      // Draw Fighters
      fighters.forEach((fighter) => {
        // Mocking coordinates based on pseudo-randomness of ID
        const angle = (parseInt(fighter.id) * 137.5) * (Math.PI / 180); 
        const distance = Math.min(fighter.distance * 20, maxRadius); // Scale distance
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Draw Blip
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#E50914';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#E50914';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Name Label
        ctx.fillStyle = '#FFF';
        ctx.font = '10px sans-serif';
        ctx.fillText(fighter.name.split(' ')[0], x + 10, y + 3);
      });

      // Draw Self
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00FF00';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FF00';
      ctx.fill();
    };

    drawRadar();
    
    // Handle resize
    window.addEventListener('resize', drawRadar);
    return () => window.removeEventListener('resize', drawRadar);
  }, [fighters]);

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 pointer-events-none"></div>
      
      {/* HUD Header */}
      <div className="p-4 bg-black/50 backdrop-blur border-b border-gray-800 z-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-squabble-red tracking-widest uppercase">Tactical Map</h2>
          <p className="text-[10px] text-gray-500 uppercase">Scanning local hostiles...</p>
        </div>
        <div className="animate-pulse">
            <Crosshair className="text-squabble-red" />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Map Legend overlay */}
        <div className="absolute bottom-4 left-4 p-2 bg-black/60 border border-gray-800 rounded text-[10px] uppercase font-bold text-gray-400">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow shadow-green-500"></div>
                <span>You</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-squabble-red shadow shadow-squabble-red"></div>
                <span>Opponent</span>
            </div>
        </div>
      </div>

      {/* Nearby List */}
      <div className="h-1/3 bg-squabble-dark border-t border-gray-800 overflow-y-auto z-10">
         <div className="p-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detected Nearby</h3>
            <div className="space-y-2">
                {fighters.map(f => (
                    <div 
                        key={f.id} 
                        onClick={() => onSelectFighter(f)}
                        className="flex items-center justify-between p-2 bg-gray-900 rounded border border-gray-800 hover:border-squabble-red cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            <img src={f.imageUrl} className="w-8 h-8 rounded bg-gray-700 object-cover" alt="" />
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-squabble-red transition-colors">{f.name}</div>
                                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <MapPin size={10} /> {f.location}
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                             <div>
                                <div className="text-xs font-bold text-white">{f.distance}mi</div>
                                <div className="text-[10px] text-gray-500">{f.fightingStyle}</div>
                             </div>
                             <Eye size={16} className="text-gray-600 group-hover:text-white" />
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};