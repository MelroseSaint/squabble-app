
import React, { useState, useEffect, useCallback } from 'react';
import { Fighter, Match, View, Message, UserProfile, Notification, Transaction } from './types';
import { generateFighters } from './services/geminiService';
import { 
  initDB, 
  getMatches, 
  createMatch, 
  updateMatchMessages, 
  deleteMatch, 
  getUserProfile, 
  saveUserProfile, 
  getLegalStatus, 
  saveLegalStatus, 
  signout, 
  isAuthenticated 
} from './services/db';

// Components
import { Layout } from './components/Layout';
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

// Pages
import { LandingPage } from './pages/LandingPage';

// Icons
import { X, Check, Wifi, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  // App State
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
      const auth = isAuthenticated();
      setIsLoggedIn(auth);

      if (auth) {
        // Load Data
        const savedMatches = await getMatches();
        setMatches(savedMatches);

        const profile = await getUserProfile();
        setUserProfile(profile);
      }
    };
    initialize();
  }, []);

  // Load Fighters when API Key changes or on startup
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadFighters = async () => {
      setIsLoading(true);
      const data = await generateFighters(apiKey);
      setFighters(data);
      setIsLoading(false);
    };
    loadFighters();
  }, [apiKey, isLoggedIn]);

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ id: Date.now().toString(), message, type });
  };

  const handleAcceptLegal = () => {
    saveLegalStatus(true);
    setLegalAccepted(true);
  };

  const handleUpdateMatch = async (matchId: string, history: Message[], lastMessage: string) => {
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, history, lastMessage } : m
    ));

    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(prev => prev ? { ...prev, history, lastMessage } : null);
    }

    await updateMatchMessages(matchId, history, lastMessage);
  };

  const handleDeleteMatch = async (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(null);
    }
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

  const handleKeyUpdate = (key: string) => {
    setApiKey(key);
  };

  const handleLogout = async () => {
    await signout();
    setIsLoggedIn(false);
    setShowLogin(false);
    setCurrentView(View.SWIPE);
  };

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (currentIndex >= fighters.length) return;

    if (direction === 'left') {
      setShowDuck(true);
      setTimeout(() => setShowDuck(false), 1200);
    }

    if (direction === 'right') {
      const fighter = fighters[currentIndex];
      const isMatch = Math.random() > 0.2;

      if (isMatch) {
        const matchData: Match = {
          id: Date.now().toString(),
          fighter: fighter,
          timestamp: Date.now(),
          history: []
        };
        setMatches(prev => [matchData, ...prev]);
        setNewMatch(matchData);
        await createMatch(matchData);
      }
    }

    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, fighters]);

  // If user hasn't accepted terms, show modal
  if (!legalAccepted) {
    return <LegalModal onAccept={handleAcceptLegal} />;
  }

  // Not logged in: Show Landing Page or Login View
  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />
            <button 
              onClick={() => setShowLogin(false)}
              className="mt-4 text-gray-500 hover:text-white text-sm w-full text-center underline uppercase tracking-widest font-bold"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  // Logged in: Render the main app with Layout
  const renderContent = () => {
    switch (currentView) {
      case View.SWIPE:
        return (
          <div className="flex flex-col h-full relative max-w-xl mx-auto">
            {/* Header for Mobile only (Layout handles desktop) */}
            <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-black/50 backdrop-blur z-10">
              <h1 className="text-2xl font-heading font-bold text-squabble-red tracking-widest italic">SQUABBLE</h1>
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-gray-500">
                {isCloudStorage ? <Wifi size={10} className="text-green-500" /> : <WifiOff size={10} />}
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
                  <h2 className="text-4xl font-heading font-bold text-yellow-400 mt-2 text-stroke-black drop-shadow-lg animate-pulse uppercase italic">YOU DUCKED!</h2>
                </div>
              </div>
            )}

            {/* Card Deck */}
            <div className="flex-1 relative p-4 flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="text-squabble-red animate-pulse font-heading text-2xl uppercase italic">Finding Opponents...</div>
              ) : currentIndex < fighters.length ? (
                <div className="w-full h-full relative">
                  {currentIndex + 1 < fighters.length && (
                    <div className="absolute inset-0 transform scale-95 translate-y-4 opacity-50 z-0">
                      <FighterCard fighter={fighters[currentIndex + 1]} active={true} />
                    </div>
                  )}
                  <div className="absolute inset-0 z-10">
                    <FighterCard fighter={fighters[currentIndex]} active={true} />
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="font-heading text-2xl mb-2 uppercase italic">No More Fights In Your Area</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-squabble-red hover:text-white uppercase transition-all"
                  >
                    Reload Area
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {currentIndex < fighters.length && !newMatch && fighters.length > 0 && (
              <div className="h-28 flex items-center justify-center gap-12 z-20">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-20 h-20 rounded-full bg-gray-900 border-2 border-gray-700 text-red-500 flex items-center justify-center hover:scale-110 hover:bg-red-900/20 transition-all shadow-xl shadow-red-900/20 group"
                >
                  <X size={40} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="w-20 h-20 rounded-full bg-gray-900 border-2 border-squabble-red text-green-500 flex items-center justify-center hover:scale-110 hover:bg-green-900/20 transition-all shadow-xl shadow-green-900/20 group"
                >
                  <Check size={40} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
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
        ) : <div className="p-8 text-center animate-pulse">Loading Profile...</div>;

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
    <Layout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      onLogout={handleLogout}
      setShowSafetyCenter={setShowSafetyCenter}
      hasMatches={matches.length > 0}
    >
      {/* Global Notifications */}
      {notification && (
        <Toast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Map Selection Modal */}
      {selectedFighter && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-8 flex items-center justify-center" onClick={() => setSelectedFighter(null)}>
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

      {/* Main Page Content */}
      <div className="h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
