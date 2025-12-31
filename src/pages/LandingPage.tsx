
import React from 'react';
import { Flame, Shield, Zap, Swords, Trophy, Users } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-squabble-red selection:text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-squabble-red tracking-widest italic">SQUABBLE</h1>
        <button 
          onClick={onLogin}
          className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-squabble-red hover:text-white transition-all transform hover:scale-105"
        >
          Enter Arena
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            alt="Fighters"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-heading font-bold mb-6 tracking-tighter leading-none italic uppercase">
            The <span className="text-squabble-red">First Rule</span> of Squabble...
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 font-light max-w-2xl mx-auto">
            The world's premier platform for local street matches. Find opponents, place bets, and settle the score.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onLogin}
              className="w-full md:w-auto bg-squabble-red text-white px-10 py-4 rounded-full font-bold uppercase text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-900/40 transform hover:-translate-y-1"
            >
              Start Swiping
            </button>
            <button className="w-full md:w-auto border border-gray-700 hover:border-white px-10 py-4 rounded-full font-bold uppercase text-lg transition-all">
              Watch Replays
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <FeatureCard 
            icon={<Flame className="text-squabble-red" size={40} />}
            title="Local Heat"
            description="Our radar map shows every angry person in a 5-mile radius looking for a fight."
          />
          <FeatureCard 
            icon={<Shield className="text-blue-500" size={40} />}
            title="Verified Records"
            description="Our blockchain-backed fight record system ensures no one pads their stats."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-500" size={40} />}
            title="AI Trash Talk"
            description="Powered by Gemini, our fighters roast you before they toast you."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-squabble-dark py-20 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox number="1.2M" label="Registered Squabblers" />
          <StatBox number="450K" label="Knockouts" />
          <StatBox number="89" label="Countries" />
          <StatBox number="$14M" label="Payouts Distributed" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-5xl font-heading font-bold mb-8 uppercase italic">Ready to take the <span className="text-squabble-red underline decoration-wavy">fade</span>?</h2>
        <button 
          onClick={onLogin}
          className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase text-xl hover:bg-squabble-red hover:text-white transition-all transform hover:scale-110 shadow-2xl"
        >
          Join OnlyFights Today
        </button>
      </section>

      {/* Footer */}
      <footer className="p-12 border-t border-gray-900 text-center text-gray-500 text-xs">
        <p className="mb-4">SQUABBLE IS FOR ENTERTAINMENT PURPOSES ONLY. WE DO NOT CONDONE UNLAWFUL VIOLENCE. USE AT YOUR OWN RISK.</p>
        <p>&copy; 2024 Squabble Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex flex-col items-center p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-gray-600 transition-all">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-heading font-bold mb-4 uppercase tracking-wider">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const StatBox = ({ number, label }: { number: string, label: string }) => (
  <div className="text-center">
    <div className="text-4xl font-heading font-bold text-white mb-2 italic">{number}</div>
    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</div>
  </div>
);
