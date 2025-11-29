import React, { Suspense } from 'react';
import { View } from './types';
import { useAppStore } from './store/appStore';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useDatabaseOperations } from './hooks/useDatabaseOperations';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Components - Core components loaded immediately
import { LoginView } from './components/LoginView';
import { WebSwipeView } from './components/WebSwipeView';
import { BottomNavigation } from './components/BottomNavigation';
import { GlobalModals } from './components/GlobalModals';
import { LegalModal } from './components/LegalModal';
import { WebLayout } from './components/WebLayout';

// Lazy loaded components for better performance
const MatchList = React.lazy(() => import('./components/MatchList').then(module => ({ default: module.MatchList })));
const ChatInterface = React.lazy(() => import('./components/ChatInterface').then(module => ({ default: module.ChatInterface })));
const ProfileView = React.lazy(() => import('./components/ProfileView').then(module => ({ default: module.ProfileView })));
const OnlyFightsPromo = React.lazy(() => import('./components/OnlyFightsPromo').then(module => ({ default: module.OnlyFightsPromo })));
const FightingStylesView = React.lazy(() => import('./components/FightingStylesView').then(module => ({ default: module.FightingStylesView })));
const MapView = React.lazy(() => import('./components/MapView').then(module => ({ default: module.MapView })));
const SettingsView = React.lazy(() => import('./components/SettingsView').then(module => ({ default: module.SettingsView })));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView').then(module => ({ default: module.AnalyticsView })));
const FadeDuelView = React.lazy(() => import('./components/FadeDuelView').then(module => ({ default: module.FadeDuelView })));
const Leaderboard = React.lazy(() => import('./components/Leaderboard').then(module => ({ default: module.Leaderboard })));



const App: React.FC = () => {
  // Initialize app data and side effects
  useAppInitialization();

  // Get database operations
  const { handleUpdateMatch, handleDeleteMatch, handleSaveProfile, handleLogoutWithSignout } = useDatabaseOperations();

  // Get state from store
  const {
    legalAccepted,
    isLoggedIn,
    userProfile,
    setSelectedMatch,
    setCurrentView,
    setApiKey,
    setShowPayment,
    notify,
    currentView,
    selectedMatch,
    matches,
    apiKey,
    deleteMatch,
    updateMatch,
    fighters,
    updateUserProfile,
    setSelectedFighter
  } = useAppStore();

  // Handle legal acceptance
  const handleAcceptLegal = () => {
    localStorage.setItem('legalAccepted', 'true');
    useAppStore.getState().setLegalAccepted(true);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    useAppStore.getState().setIsLoggedIn(true);
  };

  // If user hasn't accepted terms, show modal
  if (!legalAccepted) {
    return <LegalModal onAccept={handleAcceptLegal} />;
  }

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.SWIPE:
        return <WebSwipeView />;
      case View.MATCHES:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading matches..." />}>
            <MatchList matches={matches} onSelectMatch={setSelectedMatch} onDeleteMatch={deleteMatch} />
          </Suspense>
        );
      case View.CHAT:
        if (selectedMatch) {
          return (
            <Suspense fallback={<LoadingSpinner text="Loading chat..." />}>
              <ChatInterface 
                match={selectedMatch} 
                apiKey={apiKey}
                onBack={() => setCurrentView(View.MATCHES)} 
                onUpdateMatch={updateMatch}
                onUnmatch={deleteMatch}
                notify={notify}
              />
            </Suspense>
          );
        }
        return (
          <Suspense fallback={<LoadingSpinner text="Loading matches..." />}>
            <MatchList matches={matches} onSelectMatch={setSelectedMatch} onDeleteMatch={deleteMatch} />
          </Suspense>
        );
      case View.PROFILE:
        return userProfile ? (
          <Suspense fallback={<LoadingSpinner text="Loading profile..." />}>
            <ProfileView 
              userProfile={userProfile}
              onEditStyle={() => setCurrentView(View.STYLES)}
              onOpenSettings={() => setCurrentView(View.SETTINGS)}
              onViewAnalytics={() => setCurrentView(View.ANALYTICS)}
            />
          </Suspense>
        ) : null;
      case View.STYLES:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading styles..." />}>
            <FightingStylesView 
              currentStyle={userProfile?.fightingStyle || ''}
              onSelectStyle={(style) => {
                if (userProfile) {
                  updateUserProfile({...userProfile, fightingStyle: style});
                }
              }}
              onBack={() => setCurrentView(View.PROFILE)}
            />
          </Suspense>
        );
      case View.MAP:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading map..." />}>
            <MapView 
              fighters={fighters}
              onSelectFighter={(fighter) => {
                // Handle fighter selection from map
                setSelectedFighter(fighter);
                setCurrentView(View.SWIPE);
              }}
            />
          </Suspense>
        );
      case View.SETTINGS:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading settings..." />}>
            <SettingsView 
              onBack={() => setCurrentView(View.PROFILE)}
              onSaveKey={setApiKey}
              onTopUp={() => setShowPayment(true)}
              onLogout={handleLogoutWithSignout}
              notify={notify}
            />
          </Suspense>
        );
      case View.ANALYTICS:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading analytics..." />}>
            <AnalyticsView 
              userProfile={userProfile}
              onBack={() => setCurrentView(View.PROFILE)}
            />
          </Suspense>
        );
      case View.LEADERBOARD:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading leaderboard..." />}>
            <Leaderboard 
              onBack={() => setCurrentView(View.SWIPE)}
            />
          </Suspense>
        );
      case View.FADE_DUEL:
        return (
          <Suspense fallback={<LoadingSpinner text="Loading fade duel..." />}>
            <FadeDuelView 
              userProfile={userProfile}
              onUpdateProfile={updateUserProfile}
              onBack={() => setCurrentView(View.SWIPE)}
              onTopUp={() => setShowPayment(true)}
              notify={notify}
            />
          </Suspense>
        );
      default:
        return <WebSwipeView />;
    }
  };

  return (
    <ErrorBoundary>
      <WebLayout>
        {renderContent()}
      </WebLayout>
    </ErrorBoundary>
  );
};
export default App;
