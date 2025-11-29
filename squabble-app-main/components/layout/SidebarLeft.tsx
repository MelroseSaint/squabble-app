import React from 'react';
import { useAppStore } from '../../store/appStore';
import { View } from '../../types';
import {
    User,
    Users,
    Tv,
    UsersRound,
    Clock,
    Bookmark,
    ChevronDown,
    ShieldAlert
} from 'lucide-react';

export const SidebarLeft: React.FC = () => {
    const { userProfile, setCurrentView, setShowSafetyCenter } = useAppStore();

    const menuItems = [
        { icon: Users, label: 'Friends', view: View.MATCHES, color: 'text-blue-400' },
        { icon: UsersRound, label: 'Groups', view: View.LEADERBOARD, color: 'text-blue-400' },
        { icon: Tv, label: 'Watch', view: View.FADE_DUEL, color: 'text-blue-400' },
        { icon: Clock, label: 'Memories', view: View.ANALYTICS, color: 'text-blue-400' },
        { icon: Bookmark, label: 'Saved', view: View.SETTINGS, color: 'text-purple-500' },
        { icon: ShieldAlert, label: 'Safety Center', action: () => setShowSafetyCenter(true), color: 'text-red-500' },
    ];

    return (
        <div className="hidden lg:flex flex-col w-[360px] h-[calc(100vh-56px)] fixed left-0 top-14 pt-4 px-2 overflow-y-auto hover:overflow-y-scroll scrollbar-hide pb-4">
            {/* Profile Link */}
            <div
                className="flex items-center gap-3 p-2 hover:bg-fb-hover rounded-lg cursor-pointer transition-colors"
                onClick={() => setCurrentView(View.PROFILE)}
            >
                <div className="w-9 h-9 bg-gray-600 rounded-full overflow-hidden">
                    {userProfile?.imageUrl ? (
                        <img src={userProfile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-full h-full p-1 text-white" />
                    )}
                </div>
                <span className="text-fb-text font-medium text-[15px]">{userProfile?.name || 'User Profile'}</span>
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => (
                <div
                    key={item.label}
                    className="flex items-center gap-3 p-2 hover:bg-fb-hover rounded-lg cursor-pointer transition-colors"
                    onClick={() => item.action ? item.action() : item.view && setCurrentView(item.view)}
                >
                    <item.icon className={`w-8 h-8 p-1 ${item.color}`} />
                    <span className="text-fb-text font-medium text-[15px]">{item.label}</span>
                </div>
            ))}

            <div className="flex items-center gap-3 p-2 hover:bg-fb-hover rounded-lg cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-fb-hover rounded-full flex items-center justify-center">
                    <ChevronDown className="text-fb-text w-5 h-5" />
                </div>
                <span className="text-fb-text font-medium text-[15px]">See more</span>
            </div>

            <div className="border-t border-gray-700 my-2 mx-2"></div>

            <div className="px-2 text-gray-500 text-xs">
                <p>Privacy  · Terms  · Advertising  · Ad Choices   · Cookies  · More · Meta © 2024</p>
            </div>
        </div>
    );
};
