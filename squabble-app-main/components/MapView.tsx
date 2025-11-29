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
      ctx.strokeStyle = '#3A3B3C';
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
      ctx.strokeStyle = 'rgba(45, 136, 255, 0.2)';
      ctx.fillStyle = 'rgba(45, 136, 255, 0.1)';
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
        ctx.fillStyle = '#2D88FF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#2D88FF';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Name Label
        ctx.fillStyle = '#E4E6EB';
        ctx.font = '10px sans-serif';
        ctx.fillText(fighter.name.split(' ')[0], x + 10, y + 3);
      });

      // Draw Self
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#42B72A';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#42B72A';
      ctx.fill();
    };

    drawRadar();

    // Handle resize
    window.addEventListener('resize', drawRadar);
    return () => window.removeEventListener('resize', drawRadar);
  }, [fighters]);

  return (
    <div className="flex flex-col h-full bg-transparent text-fb-text relative">
      <div className="absolute inset-0 bg-fb-bg opacity-80 pointer-events-none"></div>

      {/* HUD Header */}
      <div className="p-4 bg-fb-card border-b border-transparent z-10 flex justify-between items-center rounded-t-lg shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-fb-text tracking-widest uppercase">Nearby Friends</h2>
          <p className="text-[10px] text-fb-text-secondary uppercase">Scanning local area...</p>
        </div>
        <div className="animate-pulse">
          <Crosshair className="text-fb-blue" />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden bg-fb-bg">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Map Legend overlay */}
        <div className="absolute bottom-4 left-4 p-2 bg-fb-card border border-transparent rounded text-[10px] uppercase font-bold text-fb-text-secondary shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow shadow-green-500"></div>
            <span>You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fb-blue shadow shadow-fb-blue"></div>
            <span>Friend</span>
          </div>
        </div>
      </div>

      {/* Nearby List */}
      <div className="h-1/3 bg-fb-card border-t border-transparent overflow-y-auto z-10 rounded-b-lg">
        <div className="p-3">
          <h3 className="text-xs font-bold text-fb-text-secondary uppercase tracking-widest mb-2">Detected Nearby</h3>
          <div className="space-y-2">
            {fighters.map(f => (
              <div
                key={f.id}
                onClick={() => onSelectFighter(f)}
                className="flex items-center justify-between p-2 bg-fb-bg rounded border border-transparent hover:bg-fb-hover cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <img src={f.imageUrl} className="w-8 h-8 rounded-full bg-gray-700 object-cover" alt="" />
                  <div>
                    <div className="text-sm font-bold text-fb-text group-hover:text-fb-blue transition-colors">{f.name}</div>
                    <div className="text-[10px] text-fb-text-secondary flex items-center gap-1">
                      <MapPin size={10} /> {f.location}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-xs font-bold text-fb-text">{f.distance}mi</div>
                    <div className="text-[10px] text-fb-text-secondary">{f.fightingStyle}</div>
                  </div>
                  <Eye size={16} className="text-fb-text-secondary group-hover:text-fb-text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};