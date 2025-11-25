
import React, { useState, useEffect, useCallback } from 'react';
import { Fighter, Match, View, Message, UserProfile, Notification, Transaction } from './types';
import { generateFighters } from './services/geminiService';
import { initDB, getMatches, createMatch, updateMatchMessages, deleteMatch, getUserProfile, saveUserProfile, getLegalStatus, saveLegalStatus, signout, isAuthenticated } from './services/db';
import { LoginView } from './components/LoginView';
import { FighterCard } from './components/FighterCard';
import { MatchList } from './components/MatchList';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { OnlyFightsPromo } from './components/OnlyFightsPromo';
import { MatchPopup } from './components/MatchPopup';
import { FightingStylesView } from './components/FightingStylesView';
import { LegalModal } from './components/LegalModal';
import { MapView } from './components/MapView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SafetyCenter } from './components/SafetyCenter';
import { FadeDuelView } from './components/FadeDuelView';
import { Toast } from './components/Toast';
import { PaymentModal } from './components/PaymentModal';
import { Flame, MessageCircle, User, X, Check, Wifi, WifiOff, Map as MapIcon, ShieldAlert, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  // App State
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.SWIPE);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');

  // State for matches
  const [matches, setMatches] = useState<Match[]>([]);
  const [isCloudStorage, setIsCloudStorage] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Safety State
  const [showSafetyCenter, setShowSafetyCenter] = useState(false);

  // Duck Animation State
  const [showDuck, setShowDuck] = useState(false);

  // Global Notification State
  const [notification, setNotification] = useState<Notification | null>(null);
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null); // For Map Selection

  // Payment State
  const [showPayment, setShowPayment] = useState(false);

  // Initialize DB, Legal Status, and Data
  useEffect(() => {
    const initialize = async () => {
      // Check Legal
      const hasAccepted = getLegalStatus();
      setLegalAccepted(hasAccepted);

      // Connect DB
      const connected = await initDB();
      setIsCloudStorage(connected);
      setIsLoggedIn(isAuthenticated());

      // Load Data
      const savedMatches = await getMatches();
      setMatches(savedMatches);

      const profile = await getUserProfile();
      setUserProfile(profile);
    };
    initialize();
  }, []);

  // Load Fighters when API Key changes or on startup
  useEffect(() => {
    const loadFighters = async () => {
      setIsLoading(true);
      const data = await generateFighters(apiKey);
      setFighters(data);
      setIsLoading(false);
    };
    loadFighters();
  }, [apiKey]);

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ id: Date.now().toString(), message, type });
  };

  const handleAcceptLegal = () => {
    saveLegalStatus(true);
    setLegalAccepted(true);
  };

  const handleUpdateMatch = async (matchId: string, history: Message[], lastMessage: string) => {
    // Optimistic update for UI
    setMatches(prev => prev.map(m =>
      m.id === matchId
        ? { ...m, history, lastMessage }
        : m
    ));

    // Update selected match if active
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => prev ? { ...prev, history, lastMessage } : null);
    }

    // Persist (Service handles DB vs LocalStorage)
    await updateMatchMessages(matchId, history, lastMessage);
  };

  const handleDeleteMatch = async (matchId: string) => {
    // Optimistic UI update
    setMatches(prev => prev.filter(m => m.id !== matchId));

    // Clear selected match if it was deleted
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(null);
    }

    // DB/Local Update
    await deleteMatch(matchId);
  };

  const handleSaveStyle = async (style: string) => {
    if (userProfile) {
      const updated = { ...userProfile, fightingStyle: style };
      setUserProfile(updated);
      await saveUserProfile(updated);
      setCurrentView(View.PROFILE);
      notify(`Fighting style updated to ${style}`, 'success');
    }
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    await saveUserProfile(updatedProfile);
  };

  const handleAddFunds = async (amount: number) => {
    if (userProfile) {
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'DEPOSIT',
        amount: amount,
        timestamp: Date.now(),
        status: 'COMPLETED',
        description: 'Wallet Top-Up via Stripe'
      };

      const updatedProfile = {
        ...userProfile,
        balance: userProfile.balance + amount,
        transactions: [newTx, ...(userProfile.transactions || [])]
      };

      setUserProfile(updatedProfile);
      await saveUserProfile(updatedProfile);
      notify(`$${amount} added to wallet successfully!`, 'success');
    }
  };

  // Callback when API key is updated from Settings
  const handleKeyUpdate = (key: string) => {
    setApiKey(key);
  };

  const handleLogout = async () => {
    await signout();
    setIsLoggedIn(false);
    setCurrentView(View.SWIPE);
  };

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (currentIndex >= fighters.length) return;

    if (direction === 'left') {
      // Show Duck Animation for "Ducking" the fight
      setShowDuck(true);
      setTimeout(() => setShowDuck(false), 1200);
    }

    if (direction === 'right') {
      const fighter = fighters[currentIndex];
      // 50% chance they swipe back immediately for demo purposes
      const isMatch = Math.random() > 0.2;

      if (isMatch) {
        const matchData: Match = {
          id: Date.now().toString(),
          fighter: fighter,
          timestamp: Date.now(),
          history: []
        };

        // Update State
        setMatches(prev => [matchData, ...prev]);
        setNewMatch(matchData);

        // Save (Service handles DB vs LocalStorage)
        await createMatch(matchData);
      }
    }

    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, fighters]);

  // If user hasn't accepted terms, show modal
  if (!legalAccepted) {
    return <LegalModal onAccept={handleAcceptLegal} />;
  }

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Render content based on view
  const renderContent = () => {
    switch (currentView) {
      case View.SWIPE:
        return (
          <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800 bg-black/50 backdrop-blur z-10 relative">
              <h1 className="text-3xl font-heading font-bold text-squabble-red tracking-widest italic">SQUABBLE</h1>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500">
                {isCloudStorage ? (
                  <>
                    <span className="text-green-500">Cloud</span>
                    <Wifi size={12} className="text-green-500" />
                  </>
                ) : (
                  <>
                    <span>Local</span>
                    <WifiOff size={12} />
                  </>
                )}
              </div>
            </div>

            {/* Match Popup Overlay */}
            {newMatch && (
              <MatchPopup
                match={newMatch}
                onClose={() => setNewMatch(null)}
                onChat={() => {
                  setSelectedMatch(newMatch);
                  setNewMatch(null);
                  setCurrentView(View.CHAT);
                }}
              />
            )}

            {/* Duck Animation Overlay */}
            {showDuck && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                  <img
                    src="https://media.tenor.com/On7j7xKzS4AAAAi/duck-run.gif"
                    alt="You Ducked"
                    className="w-64 h-64 object-contain drop-shadow-2xl rounded-2xl"
                  />
                  <h2 className="text-4xl font-heading font-bold text-yellow-400 mt-2 text-stroke-black drop-shadow-lg animate-pulse">YOU DUCKED!</h2>
                </div>
              </div>
            )}

            {/* Card Deck */}
            <div className="flex-1 relative p-4 flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="text-squabble-red animate-pulse font-heading text-2xl">FINDING OPPONENTS...</div>
              ) : currentIndex < fighters.length ? (
                <div className="w-full h-full max-w-md relative">
                  {/* Render next card below for stack effect */}
                  {currentIndex + 1 < fighters.length && (
                    <div className="absolute inset-0 transform scale-95 translate-y-4 opacity-50 z-0">
                      <FighterCard fighter={fighters[currentIndex + 1]} active={true} />
                    </div>
                  )}
                  {/* Active Card */}
                  <div className="absolute inset-0 z-10">
                    <FighterCard fighter={fighters[currentIndex]} active={true} />
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="font-heading text-2xl mb-2">NO MORE FIGHTS</p>
                  <p className="text-xs mb-4">Check back later or change your location.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gray-800 rounded-full text-sm text-white hover:bg-gray-700 uppercase font-bold"
                  >
                    Reload Area
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {currentIndex < fighters.length && !newMatch && fighters.length > 0 && (
              <div className="h-24 px-8 pb-6 flex items-center justify-center gap-8 z-20">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-700 text-red-500 flex items-center justify-center hover:scale-110 hover:bg-red-900/20 transition-all shadow-lg shadow-red-900/10"
                >
                  <X size={32} strokeWidth={3} />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="w-16 h-16 rounded-full bg-gray-900 border-2 border-squabble-red text-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-900/20 transition-all shadow-lg shadow-green-900/10"
                >
                  <Check size={32} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        );

      case View.MATCHES:
        return (
          <MatchList
            matches={matches}
            onSelectMatch={(m) => {
              setSelectedMatch(m);
              setCurrentView(View.CHAT);
            }}
            onDeleteMatch={handleDeleteMatch}
          />
        );

      case View.CHAT:
        if (!selectedMatch) return null;
        return (
          <ChatInterface
            match={selectedMatch}
            apiKey={apiKey}
            onBack={() => {
              setSelectedMatch(null);
              setCurrentView(View.MATCHES);
            }}
            onUpdateMatch={handleUpdateMatch}
            onUnmatch={handleDeleteMatch}
            notify={notify}
          />
        );

      case View.PROFILE:
        return userProfile ? (
          <ProfileView
            userProfile={userProfile}
            onEditStyle={() => setCurrentView(View.STYLES)}
            onOpenSettings={() => setCurrentView(View.SETTINGS)}
            onViewAnalytics={() => setCurrentView(View.ANALYTICS)}
          />
        ) : <div>Loading...</div>;

      case View.STYLES:
        return userProfile ? (
          <FightingStylesView
            currentStyle={userProfile.fightingStyle}
            onSelectStyle={handleSaveStyle}
            onBack={() => setCurrentView(View.PROFILE)}
          />
        ) : null;

      case View.SETTINGS:
        return (
          <SettingsView
            onBack={() => {
              // Reload profile to reflect changes
              getUserProfile().then(setUserProfile);
              setCurrentView(View.PROFILE);
            }}
            onSaveKey={handleKeyUpdate}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
            onLogout={handleLogout}
          />
        );

      case View.ANALYTICS:
        return userProfile ? (
          <AnalyticsView
            userProfile={userProfile}
            onBack={() => setCurrentView(View.PROFILE)}
          />
        ) : null;

      case View.ONLYFIGHTS:
        return <OnlyFightsPromo />;

      case View.MAP:
        return (
          <MapView
            fighters={fighters}
            onSelectFighter={(f) => setSelectedFighter(f)}
          />
        );

      case View.FADE_DUEL:
        return userProfile ? (
          <FadeDuelView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setCurrentView(View.SWIPE)}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
          />
        ) : null;
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden flex flex-col font-sans max-w-md mx-auto border-x border-gray-900 shadow-2xl relative">

      {/* Global Notifications */}
      {notification && (
        <Toast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Global Safety Shield */}
      <button
        onClick={() => setShowSafetyCenter(true)}
        className="absolute top-4 left-4 z-[60] bg-red-900/80 hover:bg-red-700 text-white p-2 rounded-full border border-red-500 shadow-lg shadow-red-900/50 backdrop-blur-sm transition-transform hover:scale-105"
        title="Emergency Safety Center"
      >
        <ShieldAlert size={20} className="animate-pulse" />
      </button>

      {/* Map Selection Modal */}
      {selectedFighter && (
        <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm p-8 flex items-center justify-center" onClick={() => setSelectedFighter(null)}>
          <div className="relative w-full aspect-[3/4] max-w-sm bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-squabble-red" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFighter(null)} className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1"><X size={24} /></button>
            <FighterCard fighter={selectedFighter} active={true} />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={handleAddFunds}
        />
      )}

      {/* Safety Modal */}
      {showSafetyCenter && <SafetyCenter onClose={() => setShowSafetyCenter(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      {(currentView !== View.CHAT && currentView !== View.STYLES && currentView !== View.SETTINGS && currentView !== View.ANALYTICS && currentView !== View.FADE_DUEL) && (
        <div className="h-16 bg-squabble-dark border-t border-gray-800 flex items-center justify-around px-2 z-50">
          <button
            onClick={() => setCurrentView(View.SWIPE)}
            className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.SWIPE ? 'text-squabble-red' : 'text-gray-500'}`}
          >
            <Flame size={20} />
          </button>
          <button
            onClick={() => setCurrentView(View.MAP)}
            className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.MAP ? 'text-squabble-red' : 'text-gray-500'}`}
          >
            <MapIcon size={20} />
          </button>

          {/* Fade Duel Button */}
          <button
            onClick={() => setCurrentView(View.FADE_DUEL)}
            className="flex flex-col items-center justify-center w-12 h-full text-gray-500 hover:text-green-500 transition-colors"
          >
            <DollarSign size={20} />
          </button>

          <button
            onClick={() => setCurrentView(View.MATCHES)}
            className={`flex flex-col items-center justify-center w-12 h-full relative ${currentView === View.MATCHES ? 'text-squabble-red' : 'text-gray-500'}`}
          >
            <MessageCircle size={20} />
            {matches.length > 0 && (
              <span className="absolute top-3 right-2 w-2 h-2 bg-squabble-red rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setCurrentView(View.PROFILE)}
            className={`flex flex-col items-center justify-center w-12 h-full ${currentView === View.PROFILE ? 'text-squabble-red' : 'text-gray-500'}`}
          >
            <User size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
