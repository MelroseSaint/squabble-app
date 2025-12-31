import React from 'react';
import { Lock, DollarSign } from 'lucide-react';

export const OnlyFightsPromo: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-black items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Lock size={48} className="text-white" />
        </div>
        <h1 className="text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            OnlyFights
        </h1>
        <p className="text-gray-300 mb-8 max-w-xs text-sm leading-relaxed">
            Upload your street fights. Get paid. <br/>
            Premium content for premium violence.
            <br/><br/>
            <span className="text-xs text-gray-500">Coming soon to an app store near you.</span>
        </p>

        <button className="bg-white text-black font-bold uppercase py-4 px-10 rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
            <DollarSign size={20} />
            Join Waitlist
        </button>
    </div>
  );
};