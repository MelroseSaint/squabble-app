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

    const COLORS = ['#2D88FF', '#3A3B3C'];

    return (
        <div className="flex flex-col h-full bg-transparent text-fb-text">
            {/* Header */}
            <div className="flex items-center p-4 bg-fb-card border-b border-transparent rounded-t-lg">
                <button onClick={onBack} className="p-2 text-fb-text-secondary hover:text-fb-text mr-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold tracking-wider uppercase">Fight Analytics</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent relative overflow-hidden shadow-sm">
                        <div className="absolute top-2 right-2 opacity-20"><TrendingUp size={40} className="text-green-500" /></div>
                        <div className="text-[10px] text-fb-text-secondary uppercase font-bold mb-1">Win Rate</div>
                        <div className="text-3xl font-bold text-fb-text">{winRate}%</div>
                        <div className="text-xs text-green-500 font-bold mt-1">+2.4% this week</div>
                    </div>
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent relative overflow-hidden shadow-sm">
                        <div className="absolute top-2 right-2 opacity-20"><Skull size={40} className="text-fb-blue" /></div>
                        <div className="text-[10px] text-fb-text-secondary uppercase font-bold mb-1">KO Ratio</div>
                        <div className="text-3xl font-bold text-fb-text">{(winRate * 0.8).toFixed(0)}%</div>
                        <div className="text-xs text-fb-text-secondary font-bold mt-1">Est. Power</div>
                    </div>
                </div>

                {/* Rating Trend Chart */}
                <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-fb-blue" />
                        <h3 className="text-xs font-bold uppercase text-fb-text-secondary">Performance Rating (Elo)</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <XAxis dataKey="month" stroke="#B0B3B8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#242526', border: 'none', borderRadius: '8px', color: '#E4E6EB' }}
                                    itemStyle={{ color: '#2D88FF' }}
                                />
                                <Line type="monotone" dataKey="rating" stroke="#2D88FF" strokeWidth={3} dot={{ r: 4, fill: '#2D88FF' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win/Loss Split */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent flex flex-col items-center justify-center shadow-sm">
                        <h3 className="text-xs font-bold uppercase text-fb-text-secondary mb-2 w-full text-left">Outcome</h3>
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
                                <span className="text-lg font-bold text-fb-text">{total}</span>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-fb-blue"></div>Wins</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-fb-hover"></div>Losses</div>
                        </div>
                    </div>

                    {/* Weekly Activity */}
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Target size={16} className="text-fb-blue" />
                            <h3 className="text-xs font-bold uppercase text-fb-text-secondary">Activity</h3>
                        </div>
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData}>
                                    <XAxis dataKey="day" stroke="#B0B3B8" fontSize={8} tickLine={false} axisLine={false} interval={0} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#242526', border: 'none', borderRadius: '8px', color: '#E4E6EB' }}
                                    />
                                    <Bar dataKey="matches" fill="#2D88FF" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-fb-hover p-4 rounded-xl border border-transparent shadow-sm">
                    <h3 className="text-xs font-bold uppercase text-fb-text-secondary mb-1">AI Coach Insight</h3>
                    <p className="text-sm text-fb-text italic">
                        "{winRate > 50 ? 'Your pressure is overwhelming opponents in the later rounds.' : 'You are gassing out too early. More cardio, less trash talk.'}"
                    </p>
                </div>
            </div>
        </div>
    );
};