import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Search, MoreHorizontal, Video } from 'lucide-react';

export const SidebarRight: React.FC = () => {
    const { fighters, setSelectedFighter } = useAppStore();

    // Mock sponsored content
    const sponsored = [
        { id: 1, title: 'Best Boxing Gloves', url: 'fightgear.com', img: 'https://images.unsplash.com/photo-1549719386-74dfc441d82c?w=150&h=150&fit=crop' },
        { id: 2, title: 'Train Like a Pro', url: 'gymmaster.com', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop' },
    ];

    return (
        <div className="hidden xl:flex flex-col w-[360px] h-[calc(100vh-56px)] fixed right-0 top-14 pt-4 px-2 overflow-y-auto hover:overflow-y-scroll scrollbar-hide pb-4">
            {/* Sponsored */}
            <div className="mb-4">
                <h3 className="text-fb-text-secondary font-semibold text-[17px] mb-2 px-2">Sponsored</h3>
                {sponsored.map((ad) => (
                    <div key={ad.id} className="flex items-center gap-3 p-2 hover:bg-fb-hover rounded-lg cursor-pointer transition-colors">
                        <img src={ad.img} alt={ad.title} className="w-28 h-28 object-cover rounded-lg" />
                        <div className="flex flex-col justify-center">
                            <span className="text-fb-text font-medium text-[15px]">{ad.title}</span>
                            <span className="text-fb-text-secondary text-[13px]">{ad.url}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-700 my-2 mx-2"></div>

            {/* Contacts Header */}
            <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-fb-text-secondary font-semibold text-[17px]">Contacts</h3>
                <div className="flex gap-2 text-fb-text-secondary">
                    <Video className="w-5 h-5 cursor-pointer hover:text-fb-text" />
                    <Search className="w-5 h-5 cursor-pointer hover:text-fb-text" />
                    <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-fb-text" />
                </div>
            </div>

            {/* Contacts List (Fighters) */}
            {fighters.map((fighter) => (
                <div
                    key={fighter.id}
                    className="flex items-center gap-3 p-2 hover:bg-fb-hover rounded-lg cursor-pointer transition-colors"
                    onClick={() => setSelectedFighter(fighter)}
                >
                    <div className="relative">
                        <div className="w-9 h-9 bg-gray-600 rounded-full overflow-hidden">
                            <img src={fighter.imageUrl} alt={fighter.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-fb-card"></div>
                    </div>
                    <span className="text-fb-text font-medium text-[15px]">{fighter.name}</span>
                </div>
            ))}
        </div>
    );
};
