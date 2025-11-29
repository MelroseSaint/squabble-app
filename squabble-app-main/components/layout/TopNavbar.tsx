import React from 'react';
import { useAppStore } from '../../store/appStore';
import { View } from '../../types';
import {
    Home,
    Users,
    Tv,
    Store,
    UsersRound,
    Search,
    Menu,
    MessageCircle,
    Bell,
    User
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
    const { currentView, setCurrentView, userProfile } = useAppStore();

    const navItems = [
        { view: View.SWIPE, icon: Home, label: 'Home' },
        { view: View.MATCHES, icon: Users, label: 'Friends' },
        { view: View.FADE_DUEL, icon: Tv, label: 'Watch' },
        { view: View.ONLYFIGHTS, icon: Store, label: 'Marketplace' },
        { view: View.LEADERBOARD, icon: UsersRound, label: 'Groups' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 h-14 bg-fb-header border-b border-gray-700 z-50 flex items-center justify-between px-4 shadow-sm">
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-squabble-red rounded-full flex items-center justify-center text-white font-bold text-2xl cursor-pointer" onClick={() => setCurrentView(View.SWIPE)}>
                    S
                </div>
                <div className="hidden md:flex items-center bg-fb-hover rounded-full px-3 py-2 w-64 ml-2">
                    <Search className="text-fb-text-secondary w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Squabble"
                        className="bg-transparent border-none outline-none text-fb-text ml-2 w-full placeholder-fb-text-secondary"
                    />
                </div>
                <div className="md:hidden w-10 h-10 bg-fb-hover rounded-full flex items-center justify-center ml-2">
                    <Search className="text-fb-text w-5 h-5" />
                </div>
            </div>

            {/* Center: Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 h-full max-w-xl mx-4">
                <div className="flex w-full justify-between h-full">
                    {navItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => setCurrentView(item.view)}
                            className={`flex-1 flex items-center justify-center cursor-pointer border-b-[3px] transition-colors relative group ${currentView === item.view
                                    ? 'border-fb-blue text-fb-blue'
                                    : 'border-transparent text-fb-text-secondary hover:bg-fb-hover rounded-lg my-1'
                                }`}
                        >
                            <item.icon className={`w-7 h-7 ${currentView === item.view ? 'fill-current' : ''}`} />
                            <div className="absolute bottom-[-45px] bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 justify-end">
                <div className="hidden xl:flex items-center gap-2 hover:bg-fb-hover p-1 rounded-full cursor-pointer pr-3" onClick={() => setCurrentView(View.PROFILE)}>
                    <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
                        {userProfile?.imageUrl ? (
                            <img src={userProfile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-1 text-white" />
                        )}
                    </div>
                    <span className="text-fb-text font-medium text-sm">{userProfile?.name || 'Profile'}</span>
                </div>

                <div className="w-10 h-10 bg-fb-hover rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                    <Menu className="text-fb-text w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-fb-hover rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => setCurrentView(View.MATCHES)}>
                    <MessageCircle className="text-fb-text w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-fb-hover rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                    <Bell className="text-fb-text w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-fb-hover rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors md:hidden" onClick={() => setCurrentView(View.PROFILE)}>
                    <User className="text-fb-text w-5 h-5" />
                </div>
            </div>
        </div>
    );
};
