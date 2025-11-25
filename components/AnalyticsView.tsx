import React from 'react';
import { UserProfile } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, TrendingUp, Activity, Target, Skull } from 'lucide-react';

interface AnalyticsViewProps {
  userProfile: UserProfile;
  onBack: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ userProfile, onBack }) => {
  const wins = userProfile.wins;
  const losses = userProfile.losses;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Mock Trend Data based on current wins
  const trendData = [
    { month: 'Jan', rating: 1000 },
    { month: 'Feb', rating: 1050 },
    { month: 'Mar', rating: 1020 },
    { month: 'Apr', rating: 1100 + (wins * 5) },
    { month: 'May', rating: 1150 + (wins * 8) - (losses * 5) },
    { month: 'Jun', rating: 1200 + (wins * 10) - (losses * 8) },
  ];

  // Mock Activity Data
  const activityData = [
    { day: 'Mon', matches: 2 },
    { day: 'Tue', matches: 4 },
    { day: 'Wed', matches: 1 },
    { day: 'Thu', matches: 5 },
    { day: 'Fri', matches: 8 }, // Waffle House Friday
    { day: 'Sat', matches: 12 },
    { day: 'Sun', matches: 3 },
  ];

  const pieData = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
  ];

  const COLORS = ['#E50914', '#2F2F2F'];

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-squabble-dark border-b border-gray-800">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white mr-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold tracking-wider uppercase">Fight Analytics</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-20"><TrendingUp size={40} className="text-green-500"/></div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Win Rate</div>
                <div className="text-3xl font-heading font-bold text-white">{winRate}%</div>
                <div className="text-xs text-green-500 font-bold mt-1">+2.4% this week</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-20"><Skull size={40} className="text-squabble-red"/></div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">KO Ratio</div>
                <div className="text-3xl font-heading font-bold text-white">{(winRate * 0.8).toFixed(0)}%</div>
                <div className="text-xs text-gray-500 font-bold mt-1">Est. Power</div>
            </div>
        </div>

        {/* Rating Trend Chart */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-squabble-red" />
                <h3 className="text-xs font-bold uppercase text-gray-300">Performance Rating (Elo)</h3>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <XAxis dataKey="month" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#E50914' }}
                        />
                        <Line type="monotone" dataKey="rating" stroke="#E50914" strokeWidth={3} dot={{r: 4, fill: '#E50914'}} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Win/Loss Split */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center">
                 <h3 className="text-xs font-bold uppercase text-gray-300 mb-2 w-full text-left">Outcome</h3>
                 <div className="h-32 w-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={55}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-lg font-bold font-heading">{total}</span>
                    </div>
                 </div>
                 <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase">
                     <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-squabble-red"></div>Wins</div>
                     <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-700"></div>Losses</div>
                 </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-squabble-red" />
                    <h3 className="text-xs font-bold uppercase text-gray-300">Activity</h3>
                </div>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <XAxis dataKey="day" stroke="#666" fontSize={8} tickLine={false} axisLine={false} interval={0} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px' }}
                            />
                            <Bar dataKey="matches" fill="#E50914" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-squabble-dark p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">AI Coach Insight</h3>
            <p className="text-sm text-white italic">
                "{winRate > 50 ? 'Your pressure is overwhelming opponents in the later rounds.' : 'You are gassing out too early. More cardio, less trash talk.'}"
            </p>
        </div>
      </div>
    </div>
  );
};