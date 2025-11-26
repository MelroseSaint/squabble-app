import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { 
  createMatch, 
  updateMatchMessages, 
  deleteMatch, 
  saveUserProfile, 
  signout 
} from '../services/db';

export const useDatabaseOperations = () => {
  const {
    updateMatch: updateMatchInStore,
    deleteMatch: deleteMatchFromStore,
    updateUserProfile,
    handleLogout
  } = useAppStore();

  const handleUpdateMatch = useCallback(async (matchId: string, history: any[], lastMessage: string) => {
    // Update in store first for optimistic UI
    updateMatchInStore(matchId, history, lastMessage);
    
    // Persist to database
    await updateMatchMessages(matchId, history, lastMessage);
  }, [updateMatchInStore]);

  const handleDeleteMatch = useCallback(async (matchId: string) => {
    // Update in store first for optimistic UI
    deleteMatchFromStore(matchId);
    
    // Delete from database
    await deleteMatch(matchId);
  }, [deleteMatchFromStore]);

  const handleSaveProfile = useCallback(async (profile: any) => {
    // Update in store first for optimistic UI
    updateUserProfile(profile);
    
    // Save to database
    await saveUserProfile(profile);
  }, [updateUserProfile]);

  const handleLogoutWithSignout = useCallback(async () => {
    await signout();
    handleLogout();
  }, [handleLogout]);

  return {
    handleUpdateMatch,
    handleDeleteMatch,
    handleSaveProfile,
    handleLogoutWithSignout
  };
};
