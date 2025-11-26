import React from 'react';
import { View } from './types';
import { useAppStore } from './store/appStore';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useDatabaseOperations } from './hooks/useDatabaseOperations';

// Components
import { LoginView } from './components/LoginView';
import { SwipeView } from './components/SwipeView';
import { BottomNavigation } from './components/BottomNavigation';
import { GlobalModals } from './components/GlobalModals';
import { MatchList } from './components/MatchList';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { OnlyFightsPromo } from './components/OnlyFightsPromo';
import { FightingStylesView } from './components/FightingStylesView';
import { LegalModal } from './components/LegalModal';
import { MapView } from './components/MapView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { FadeDuelView } from './components/FadeDuelView';
import { Leaderboard } from './components/Leaderboard';
import { saveLegalStatus, getUserProfile } from './services/db';

const App: React.FC = () => {
  // Initialize app data and side effects
  useAppInitialization();
  
  // Get database operations
  const { handleUpdateMatch, handleDeleteMatch, handleSaveProfile, handleLogoutWithSignout } = useDatabaseOperations();
  
  // Get state from store
  const {
    legalAccepted,
    isLoggedIn,
    currentView,
    selectedMatch,
    userProfile,
    apiKey,
    fighters,
    setSelectedMatch,
    setCurrentView,
    setApiKey,
    setShowPayment,
    notify
  } = useAppStore();

  // Handle legal acceptance
  const handleAcceptLegal = () => {
    saveLegalStatus(true);
    useAppStore.getState().setLegalAccepted(true);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    useAppStore.getState().setIsLoggedIn(true);
  };

  // Handle saving fighting style
  const handleSaveStyle = async (style: string) => {
    if (userProfile) {
      const updated = { ...userProfile, fightingStyle: style };
      await handleSaveProfile(updated);
      setCurrentView(View.PROFILE);
      notify(`Fighting style updated to ${style}`, 'success');
    }
  };

  // Handle API key update
  const handleKeyUpdate = (key: string) => {
    setApiKey(key);
  };

  // Handle adding funds
  const handleAddFunds = async (amount: number) => {
    if (userProfile) {
      const newTx = {
        id: Date.now().toString(),
        type: 'DEPOSIT' as const,
        amount: amount,
        timestamp: Date.now(),
        status: 'COMPLETED' as const,
        description: 'Wallet Top-Up via Stripe'
      };

      const updatedProfile = {
        ...userProfile,
        balance: userProfile.balance + amount,
        transactions: [newTx, ...(userProfile.transactions || [])]
      };

      await handleSaveProfile(updatedProfile);
      notify(`$${amount} added to wallet successfully!`, 'success');
    }
  };

  // If user hasn't accepted terms, show modal
  if (!legalAccepted) {
    return <LegalModal onAccept={handleAcceptLegal} />;
  }

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Render content based on view
  const renderContent = () => {
    switch (currentView) {
      case View.SWIPE:
        return <SwipeView />;

      case View.MATCHES:
        return (
          <MatchList
            matches={useAppStore.getState().matches}
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
              getUserProfile().then(useAppStore.getState().setUserProfile);
              setCurrentView(View.PROFILE);
            }}
            onSaveKey={handleKeyUpdate}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
            onLogout={handleLogoutWithSignout}
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
            onSelectFighter={useAppStore.getState().setSelectedFighter}
          />
        );

      case View.FADE_DUEL:
        return userProfile ? (
          <FadeDuelView
            userProfile={userProfile}
            onUpdateProfile={handleSaveProfile}
            onBack={() => setCurrentView(View.SWIPE)}
            notify={notify}
            onTopUp={() => setShowPayment(true)}
          />
        ) : null;

      case View.LEADERBOARD:
        return <Leaderboard onBack={() => setCurrentView(View.SWIPE)} />;

      default:
        return <SwipeView />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-4">
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Global Modals */}
        <GlobalModals />
      </div>
    </div>
  );
};

export default App;
