import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';

interface FightingStylesViewProps {
  currentStyle: string;
  onSelectStyle: (style: string) => void;
  onBack: () => void;
}

const STYLES = [
    {
        name: "Street Brawler",
        description: "No rules. Just hands. Good for parking lots.",
        color: "from-red-600 to-orange-600"
    },
    {
        name: "Waffle House Warrior",
        description: "Specializes in late-night chaos and chair throwing.",
        color: "from-yellow-500 to-orange-500"
    },
    {
        name: "Keyboard Gangster",
        description: "Talks trash online. Runs away offline.",
        color: "from-blue-500 to-indigo-500"
    },
    {
        name: "Karen-Fu",
        description: "Can summon a manager and shatter eardrums.",
        color: "from-pink-500 to-purple-500"
    },
    {
        name: "Gym Bro",
        description: "All biceps, no cardio. Protein shake weakness.",
        color: "from-green-500 to-emerald-700"
    },
    {
        name: "Drunken Master",
        description: "Unpredictable movement. High pain tolerance.",
        color: "from-amber-700 to-red-800"
    }
];

export const FightingStylesView: React.FC<FightingStylesViewProps> = ({ currentStyle, onSelectStyle, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-squabble-dark border-b border-gray-800">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white mr-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold tracking-wider uppercase">Choose Your Style</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-gray-400 text-sm mb-4">
            Pick how you want to handle your business. This will be shown on your profile so opponents know what they're walking into.
        </p>

        <div className="grid grid-cols-1 gap-4 pb-20">
            {STYLES.map((style) => {
                const isSelected = currentStyle === style.name;
                return (
                    <div 
                        key={style.name}
                        onClick={() => onSelectStyle(style.name)}
                        className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 overflow-hidden ${
                            isSelected 
                            ? 'border-white bg-gray-900 scale-[1.02]' 
                            : 'border-transparent bg-gray-900/50 hover:bg-gray-800'
                        }`}
                    >
                        {/* Background Gradient Accent */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${style.color} opacity-20 blur-2xl rounded-full -mr-10 -mt-10`}></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className={`font-heading text-2xl font-bold uppercase ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                    {style.name}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                    {style.description}
                                </p>
                            </div>
                            
                            {isSelected && (
                                <div className="bg-squabble-red text-white p-1 rounded-full">
                                    <Check size={20} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};