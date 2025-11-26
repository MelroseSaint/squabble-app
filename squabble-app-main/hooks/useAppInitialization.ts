import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { generateFighters } from '../services/geminiService';
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
} from '../services/db';

export const useAppInitialization = () => {
  const {
    setLegalAccepted,
    setIsCloudStorage,
    setIsLoggedIn,
    setMatches,
    setUserProfile,
    setFighters,
    setIsLoading,
    apiKey
  } = useAppStore();

  // Initialize DB, Legal Status, and Data
  useEffect(() => {
    const initialize = async () => {
      // Check Legal
      const hasAccepted = getLegalStatus();
      setLegalAccepted(hasAccepted);

      // Connect DB
      const connected = await initDB(useAppStore.getState().notify);
      setIsCloudStorage(connected);
      setIsLoggedIn(isAuthenticated());

      // Load Data
      const savedMatches = await getMatches();
      setMatches(savedMatches);

      const profile = await getUserProfile();
      setUserProfile(profile);
    };
    initialize();
  }, [setLegalAccepted, setIsCloudStorage, setIsLoggedIn, setMatches, setUserProfile]);

  // Load Fighters when API Key changes or on startup
  useEffect(() => {
    const loadFighters = async () => {
      setIsLoading(true);
      const data = await generateFighters(apiKey);
      setFighters(data);
      setIsLoading(false);
    };
    loadFighters();
  }, [apiKey, setFighters, setIsLoading]);
};
