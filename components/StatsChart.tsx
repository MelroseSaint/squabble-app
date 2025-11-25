import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { FighterStats } from '../types';

interface StatsChartProps {
  stats: FighterStats;
}

export const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  const data = [
    { subject: 'STR', A: stats.strength, fullMark: 100 },
    { subject: 'SPD', A: stats.speed, fullMark: 100 },
    { subject: 'RAGE', A: stats.anger, fullMark: 100 },
    { subject: 'HP', A: stats.durability, fullMark: 100 },
    { subject: 'CRAZY', A: stats.crazy, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 10, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#E50914"
            strokeWidth={2}
            fill="#E50914"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};