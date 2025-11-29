import React from 'react';
import { Home, Users, Video, MessageSquare, Bell, User, Swords } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { View } from '../types';

interface FacebookLayoutProps {
    children: React.ReactNode;
}

export const FacebookLayout: React.FC<FacebookLayoutProps> = ({ children }) => {
    const { setCurrentView } = useAppStore();

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-md h-14 flex items-center justify-between px-4 fixed w-full z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                    <input type="text" placeholder="Search Squabble" className="bg-gray-100 rounded-full px-4 py-2 focus:outline-none hidden md:block" />
                </div>
                <div className="flex items-center space-x-8">
                    <Home className="text-gray-600 hover:text-blue-600 cursor-pointer" size={28} onClick={() => setCurrentView(View.SWIPE)} />
                    <Users className="text-gray-600 hover:text-blue-600 cursor-pointer" size={28} onClick={() => setCurrentView(View.MATCHES)} />
                    <User className="text-gray-600 hover:text-blue-600 cursor-pointer" size={28} onClick={() => setCurrentView(View.PROFILE)} />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                        <MessageSquare className="text-black" size={20} />
                    </div>
                    <div className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                        <Bell className="text-black" size={20} />
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"></div>
                </div>
            </header>

            {/* Body */}
            <main className="flex pt-20">
                {/* Left Sidebar */}
                <div className="w-1/4 p-4 hidden md:block">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView(View.SWIPE)}>
                            <Swords className="text-blue-500" size={28} />
                            <span>Swipe</span>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView(View.MATCHES)}>
                            <Users className="text-blue-500" size={28} />
                            <span>Matches</span>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView(View.PROFILE)}>
                            <User className="text-blue-500" size={28} />
                            <span>Profile</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-1/2 px-4">
                    {children}
                </div>

                {/* Right Sidebar */}
                <div className="w-1/4 p-4 hidden md:block">
                    <h3 className="font-bold text-gray-600 mb-4">Contacts</h3>
                    <div className="space-y-4">
                        <p className="text-gray-500">No contacts available</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
