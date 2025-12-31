
import React from 'react';
import { Flame, Map as MapIcon, MessageCircle, User, DollarSign, ShieldAlert, LogOut, Settings, BarChart2 } from 'lucide-react';
import { View } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  setShowSafetyCenter: (show: boolean) => void;
  hasMatches: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setCurrentView, 
  onLogout, 
  setShowSafetyCenter,
  hasMatches
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-squabble-dark border-r border-gray-800 flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-3xl font-heading font-bold text-squabble-red tracking-widest italic">SQUABBLE</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Swipe. Match. Fight.</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<Flame size={20} />} 
            label="Fight Swipe" 
            active={currentView === View.SWIPE} 
            onClick={() => setCurrentView(View.SWIPE)} 
          />
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Radar Map" 
            active={currentView === View.MAP} 
            onClick={() => setCurrentView(View.MAP)} 
          />
          <NavItem 
            icon={<DollarSign size={20} />} 
            label="Fade Duel" 
            active={currentView === View.FADE_DUEL} 
            onClick={() => setCurrentView(View.FADE_DUEL)} 
          />
          <NavItem 
            icon={<MessageCircle size={20} />} 
            label="Messages" 
            active={currentView === View.MATCHES || currentView === View.CHAT} 
            onClick={() => setCurrentView(View.MATCHES)} 
            badge={hasMatches}
          />
          <NavItem 
            icon={<User size={20} />} 
            label="My Profile" 
            active={currentView === View.PROFILE || currentView === View.ANALYTICS} 
            onClick={() => setCurrentView(View.PROFILE)} 
          />
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button 
            onClick={() => setShowSafetyCenter(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-950/30 rounded-xl transition-all group"
          >
            <ShieldAlert size={20} className="group-hover:animate-pulse" />
            <span className="font-bold uppercase text-xs tracking-wider">Safety Center</span>
          </button>
          <button 
            onClick={() => setCurrentView(View.SETTINGS)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          >
            <Settings size={20} />
            <span className="font-bold uppercase text-xs tracking-wider">Settings</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-950/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold uppercase text-xs tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-20 md:pb-0">
          {children}
        </div>

        {/* Bottom Nav for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-squabble-dark border-t border-gray-800 flex items-center justify-around px-2 z-50">
          <MobileNavItem 
            icon={<Flame size={20} />} 
            active={currentView === View.SWIPE} 
            onClick={() => setCurrentView(View.SWIPE)} 
          />
          <MobileNavItem 
            icon={<MapIcon size={20} />} 
            active={currentView === View.MAP} 
            onClick={() => setCurrentView(View.MAP)} 
          />
          <MobileNavItem 
            icon={<DollarSign size={20} />} 
            active={currentView === View.FADE_DUEL} 
            onClick={() => setCurrentView(View.FADE_DUEL)} 
          />
          <MobileNavItem 
            icon={<MessageCircle size={20} />} 
            active={currentView === View.MATCHES} 
            onClick={() => setCurrentView(View.MATCHES)} 
            badge={hasMatches}
          />
          <MobileNavItem 
            icon={<User size={20} />} 
            active={currentView === View.PROFILE} 
            onClick={() => setCurrentView(View.PROFILE)} 
          />
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-squabble-red text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-bold uppercase text-xs tracking-widest">{label}</span>
    </div>
    {badge && !active && <div className="w-2 h-2 bg-squabble-red rounded-full animate-pulse" />}
  </button>
);

interface MobileNavItemProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: boolean;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-full relative ${
      active ? 'text-squabble-red' : 'text-gray-500'
    }`}
  >
    {icon}
    {badge && !active && <span className="absolute top-3 right-2 w-2 h-2 bg-squabble-red rounded-full animate-pulse" />}
  </button>
);
