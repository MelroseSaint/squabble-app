import React from 'react';
import { Home, Users, Video, MessageSquare, Bell, User, Swords, Settings, BarChart3, Map, Trophy } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { View } from '../types';

interface WebLayoutProps {
    children: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
    const { setCurrentView, currentView } = useAppStore();

    const navigationItems = [
        { icon: Home, label: 'Home', view: View.SWIPE },
        { icon: Users, label: 'Matches', view: View.MATCHES },
        { icon: MessageSquare, label: 'Chat', view: View.CHAT },
        { icon: User, label: 'Profile', view: View.PROFILE },
        { icon: Swords, label: 'Fighting Styles', view: View.STYLES },
        { icon: Map, label: 'Map', view: View.MAP },
        { icon: Trophy, label: 'Leaderboard', view: View.LEADERBOARD },
        { icon: BarChart3, label: 'Analytics', view: View.ANALYTICS },
        { icon: Settings, label: 'Settings', view: View.SETTINGS },
    ];

    return (
        <div className="bg-fb-bg min-h-screen text-fb-text">
            {/* Header */}
            <header className="bg-fb-header border-b border-gray-700 h-16 flex items-center justify-between px-6 fixed w-full top-0 z-50 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-squabble-red rounded-lg flex items-center justify-center">
                            <Swords className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold font-heading text-white">SQUABBLE</span>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search fighters, matches, or locations..." 
                            className="bg-fb-hover text-fb-text rounded-lg px-4 py-2 pl-10 w-96 focus:outline-none focus:ring-2 focus:ring-squabble-red transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 text-fb-text-secondary" size={20} />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                        {navigationItems.slice(0, 4).map((item) => (
                            <button
                                key={item.view}
                                onClick={() => setCurrentView(item.view)}
                                className={`p-2 rounded-lg transition-all hover:bg-fb-hover ${
                                    currentView === item.view 
                                        ? 'text-squabble-red bg-fb-hover' 
                                        : 'text-fb-text-secondary hover:text-fb-text'
                                }`}
                                title={item.label}
                            >
                                <item.icon size={24} />
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-700">
                        <button className="relative p-2 rounded-lg hover:bg-fb-hover transition-all">
                            <MessageSquare className="text-fb-text-secondary" size={20} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-squabble-red rounded-full text-xs text-white flex items-center justify-center">3</span>
                        </button>
                        <button className="relative p-2 rounded-lg hover:bg-fb-hover transition-all">
                            <Bell className="text-fb-text-secondary" size={20} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-squabble-red rounded-full text-xs text-white flex items-center justify-center">5</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-squabble-red to-red-700 rounded-full cursor-pointer hover:ring-2 hover:ring-squabble-red transition-all"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex pt-16">
                {/* Left Sidebar */}
                <aside className="w-64 bg-fb-header border-r border-gray-700 min-h-screen fixed left-0 top-16">
                    <nav className="p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => setCurrentView(item.view)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                                        currentView === item.view 
                                            ? 'bg-squabble-red text-white shadow-lg' 
                                            : 'text-fb-text-secondary hover:bg-fb-hover hover:text-fb-text'
                                    }`}
                                >
                                    <Icon size={20} className={currentView === item.view ? 'text-white' : 'group-hover:text-squabble-red'} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Quick Stats */}
                    <div className="p-4 mt-8 border-t border-gray-700">
                        <h3 className="text-sm font-bold text-fb-text-secondary mb-3">QUICK STATS</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-fb-text-secondary">Win Rate</span>
                                <span className="text-sm font-bold text-green-400">67%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-fb-text-secondary">Total Fights</span>
                                <span className="text-sm font-bold text-fb-text">142</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-fb-text-secondary">Rank</span>
                                <span className="text-sm font-bold text-squabble-red">#12</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 ml-64">
                    <div className="max-w-6xl mx-auto p-6">
                        {children}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="w-80 bg-fb-header border-l border-gray-700 min-h-screen fixed right-0 top-16">
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-fb-text-secondary mb-4">TRENDING FIGHTERS</h3>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-fb-hover transition-all cursor-pointer">
                                    <div className="w-10 h-10 bg-gradient-to-br from-squabble-red to-red-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-fb-text">Fighter {i}</p>
                                        <p className="text-xs text-fb-text-secondary">Win Rate: {75 + i}%</p>
                                    </div>
                                    <span className="text-xs text-squabble-red font-bold">#{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 mt-6 border-t border-gray-700">
                        <h3 className="text-sm font-bold text-fb-text-secondary mb-4">UPCOMING MATCHES</h3>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-fb-card rounded-lg p-3 border border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-fb-text-secondary">In {i * 15} min</span>
                                        <span className="text-xs px-2 py-1 bg-squabble-red text-white rounded-full">LIVE</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm text-fb-text">vs</span>
                                        <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

// Add Search import
import { Search } from 'lucide-react';
