import { create } from 'zustand';
import { Fighter, Match, View, Message, UserProfile, Notification, Transaction } from '../types';

interface AppState {
  // App State
  legalAccepted: boolean;
  isLoggedIn: boolean;
  currentView: View;
  fighters: Fighter[];
  currentIndex: number;
  apiKey: string;
  isCloudStorage: boolean;
  
  // Matches
  matches: Match[];
  selectedMatch: Match | null;
  newMatch: Match | null;
  
  // User Profile
  userProfile: UserProfile | null;
  
  // UI State
  isLoading: boolean;
  showSafetyCenter: boolean;
  showDuck: boolean;
  showPayment: boolean;
  notification: Notification | null;
  selectedFighter: Fighter | null;
}

interface AppActions {
  // App Actions
  setLegalAccepted: (accepted: boolean) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentView: (view: View) => void;
  setFighters: (fighters: Fighter[]) => void;
  setCurrentIndex: (index: number) => void;
  setApiKey: (key: string) => void;
  setIsCloudStorage: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Match Actions
  setMatches: (matches: Match[]) => void;
  setSelectedMatch: (match: Match | null) => void;
  setNewMatch: (match: Match | null) => void;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, history: Message[], lastMessage: string) => void;
  deleteMatch: (matchId: string) => void;
  
  // User Profile Actions
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (profile: UserProfile) => void;
  
  // UI Actions
  setShowSafetyCenter: (show: boolean) => void;
  setShowDuck: (show: boolean) => void;
  setShowPayment: (show: boolean) => void;
  setNotification: (notification: Notification | null) => void;
  setSelectedFighter: (fighter: Fighter | null) => void;
  notify: (message: string, type: 'success' | 'error' | 'info') => void;
  
  // Complex Actions
  handleSwipe: (direction: 'left' | 'right') => void;
  handleSuperLike: () => void;
  handleLogout: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial State
  legalAccepted: false,
  isLoggedIn: false,
  currentView: View.SWIPE,
  fighters: [],
  currentIndex: 0,
  apiKey: localStorage.getItem('gemini_api_key') || '',
  isCloudStorage: false,
  matches: [],
  selectedMatch: null,
  newMatch: null,
  userProfile: null,
  isLoading: false,
  showSafetyCenter: false,
  showDuck: false,
  showPayment: false,
  notification: null,
  selectedFighter: null,

  // App Actions
  setLegalAccepted: (accepted) => set({ legalAccepted: accepted }),
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setCurrentView: (view) => set({ currentView: view }),
  setFighters: (fighters) => set({ fighters }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setApiKey: (key) => set({ apiKey: key }),
  setIsCloudStorage: (connected) => set({ isCloudStorage: connected }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Match Actions
  setMatches: (matches) => set({ matches }),
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  setNewMatch: (match) => set({ newMatch: match }),
  
  addMatch: (match) => set((state) => ({
    matches: [match, ...state.matches],
    newMatch: match
  })),
  
  updateMatch: (matchId, history, lastMessage) => set((state) => ({
    matches: state.matches.map(m =>
      m.id === matchId ? { ...m, history, lastMessage } : m
    ),
    selectedMatch: state.selectedMatch?.id === matchId 
      ? { ...state.selectedMatch, history, lastMessage } 
      : state.selectedMatch
  })),
  
  deleteMatch: (matchId) => set((state) => ({
    matches: state.matches.filter(m => m.id !== matchId),
    selectedMatch: state.selectedMatch?.id === matchId ? null : state.selectedMatch,
    newMatch: state.newMatch?.id === matchId ? null : state.newMatch
  })),

  // User Profile Actions
  setUserProfile: (profile) => set({ userProfile: profile }),
  updateUserProfile: (profile) => set({ userProfile: profile }),

  // UI Actions
  setShowSafetyCenter: (show) => set({ showSafetyCenter: show }),
  setShowDuck: (show) => set({ showDuck: show }),
  setShowPayment: (show) => set({ showPayment: show }),
  setNotification: (notification) => set({ notification }),
  setSelectedFighter: (fighter) => set({ selectedFighter: fighter }),
  
  notify: (message, type) => set({
    notification: { id: Date.now().toString(), message, type }
  }),

  // Complex Actions
  handleSwipe: (direction) => {
    const { currentIndex, fighters } = get();
    if (currentIndex >= fighters.length) return;

    if (direction === 'left') {
      set({ showDuck: true });
      setTimeout(() => set({ showDuck: false }), 1200);
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
        get().addMatch(matchData);
      }
    }

    set((state) => ({ currentIndex: state.currentIndex + 1 }));
  },

  handleSuperLike: () => {
    const { currentIndex, fighters } = get();
    if (currentIndex >= fighters.length) return;

    const fighter = fighters[currentIndex];
    const matchData: Match = {
      id: Date.now().toString(),
      fighter: fighter,
      timestamp: Date.now(),
      history: []
    };

    get().addMatch(matchData);
    set((state) => ({ currentIndex: state.currentIndex + 1 }));
    get().notify(`You SUPER LIKED ${fighter.name}! It's a match!`, 'success');
  },

  handleLogout: () => {
    set({
      isLoggedIn: false,
      currentView: View.SWIPE,
      selectedMatch: null,
      newMatch: null
    });
  }
}));
