
import { Match, UserProfile } from '../types';

// Constants
const DB_ENDPOINT = 'wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc';
const DB_NAMESPACE = 'squabble';
const DB_DATABASE = 'squabble_db';
const LS_KEY = 'squabble_matches';
const LS_LEGAL_KEY = 'squabble_legal_accepted';
const LS_PROFILE_KEY = 'squabble_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'New Fighter',
  age: 25,
  height: "5'10\"",
  weight: '170 lbs',
  fightingStyle: 'Street',
  stance: 'Orthodox',
  experience: 'Novice',
  bio: 'Ready to squabble!',
  wins: 0,
  losses: 0,
  balance: 100,
  isVerified: false,
  trustedContacts: [],
  transactions: [],
};



const LS_TOKEN_KEY = 'squabble_auth_token';

// Service State
let db: any = null;
let useLocalStorage = false;
let isInitialized = false;







let notifyCallback: (message: string, type: 'success' | 'error' | 'info') => void = () => {};

export const initDB = async (notify: (message: string, type: 'success' | 'error' | 'info') => void): Promise<boolean> => {
  if (isInitialized) return !useLocalStorage;

  try {

    // Dynamic import to prevent crash if module is missing or fails
    const SurrealMod: any = await import('surrealdb');

    // Handle ESM default vs named export differences
    const SurrealClass = SurrealMod.default || SurrealMod.Surreal;

    if (!SurrealClass) {
      throw new Error("SurrealDB class not found in module.");
    }

    db = new SurrealClass();


    notifyCallback = notify;
    await db.connect(DB_ENDPOINT);

    // Try to resume session
    const token = localStorage.getItem(LS_TOKEN_KEY);
    if (token) {
      try {
        await db.authenticate(token);

      } catch (e) {
        console.warn("Session invalid", e);
        localStorage.removeItem(LS_TOKEN_KEY);
      }
    } else {
      // If no token, we might need to sign in as guest or just stay connected for public endpoints
      // For now, we just stay connected.
    }
    await db.use({ ns: DB_NAMESPACE, db: DB_DATABASE });


    useLocalStorage = false;
    isInitialized = true;
    return true;

  } catch (error) {
    console.warn('SurrealDB initialization failed. Falling back to LocalStorage.', error);
    useLocalStorage = true;
    isInitialized = true;
    return false;
  }
};

export const signin = async (user: string, pass: string): Promise<void> => {
  if (!db) await initDB();
  if (useLocalStorage) throw new Error("Cannot login in offline mode.");

  try {
    const token = await db.signin({
      namespace: DB_NAMESPACE,
      database: DB_DATABASE,
      scope: 'allusers',
      user: user,
      pass: pass,
    });
    localStorage.setItem(LS_TOKEN_KEY, token);
  } catch (e) {
    console.error("Signin failed", e);
    throw e;
  }
};

export const signup = async (user: string, pass: string): Promise<void> => {
  if (!db) await initDB();
  if (useLocalStorage) throw new Error("Cannot signup in offline mode.");

  try {
    const token = await db.signup({
      namespace: DB_NAMESPACE,
      database: DB_DATABASE,
      scope: 'allusers',
      user: user,
      pass: pass,
    });
    localStorage.setItem(LS_TOKEN_KEY, token);
  } catch (e) {
    console.error("Signup failed", e);
    throw e;
  }
};

export const signout = async (): Promise<void> => {
  localStorage.removeItem(LS_TOKEN_KEY);
  if (db) await db.invalidate();
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(LS_TOKEN_KEY);
};


const getLocalMatches = (): Match[] => {
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalMatches = (matches: Match[]): void => {
  localStorage.setItem(LS_KEY, JSON.stringify(matches));
};

export const getMatches = async (): Promise<Match[]> => {
  // Ensure we are initialized (lazy init fallback)
  if (!isInitialized) await initDB();

  if (useLocalStorage || !db) {
    return getLocalMatches();
  }

  try {
    const result = await db.select('matches');
    return result as Match[];
  } catch (error) {
    console.warn('DB fetch failed, falling back to local');
    notifyCallback('Could not connect to the database. Using local storage.', 'info');
    return getLocalMatches();
  }
};

export const createMatch = async (match: Match): Promise<void> => {
  if (!isInitialized) await initDB();

  // Always save to local storage as backup/sync
  const currentLocal = getLocalMatches();
  saveLocalMatches([match, ...currentLocal]);

  if (!useLocalStorage && db) {
    try {
      await db.create(`matches:${match.id}`, match);
    } catch (error) {
      console.error('Failed to create match in DB', error);
    }
  }
};

export const updateMatchMessages = async (matchId: string, history: Message[], lastMessage: string): Promise<void> => {
  if (!isInitialized) await initDB();

  // Update Local
  const matches = getLocalMatches();
  const updatedMatches = matches.map(m =>
    m.id === matchId ? { ...m, history, lastMessage } : m
  );
  saveLocalMatches(updatedMatches);

  // Update DB
  if (!useLocalStorage && db) {
    try {
      await db.merge(`matches:${matchId}`, {
        history,
        lastMessage
      });
    } catch (error) {
      console.error('Failed to update match in DB', error);
    }
  }
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  if (!isInitialized) await initDB();

  // Update Local
  const matches = getLocalMatches();
  const updatedMatches = matches.filter(m => m.id !== matchId);
  saveLocalMatches(updatedMatches);

  // Update DB
  if (!useLocalStorage && db) {
    try {
      await db.delete(`matches:${matchId}`);
    } catch (error) {
      console.error('Failed to delete match in DB', error);
    }
  }
};

// --- User Profile Helpers ---

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const stored = localStorage.getItem(LS_PROFILE_KEY);
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load profile", e);
  }
  return DEFAULT_PROFILE;
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));

  // Optional: Save to DB if connected
  if (!useLocalStorage && db && isInitialized) {
    try {
      // Check if user exists or create
      // Simplified for this demo
      await db.merge('user:me', profile);
    } catch (e) {
      console.warn("Failed to save profile to DB", e);
    }
  }
};

// --- Legal Helpers ---

export const getLegalStatus = (): boolean => {
  return localStorage.getItem(LS_LEGAL_KEY) === 'true';
};

export const saveLegalStatus = (accepted: boolean): void => {
  localStorage.setItem(LS_LEGAL_KEY, accepted ? 'true' : 'false');
};

export default {
  initDB,
  getMatches,
  createMatch,
  updateMatchMessages,
  deleteMatch,
  getUserProfile,
  saveUserProfile,
  getLegalStatus,
  saveLegalStatus
};

export const createBet = async (bet: Bet): Promise<void> => {
  if (!isInitialized) await initDB();

  if (!useLocalStorage && db) {
    try {
      await db.create(`bet:${bet.id}`, bet);
    } catch (error) {
      console.error('Failed to create bet in DB', error);
    }
  }
};

export const getBetHistory = async (): Promise<Bet[]> => {
  if (!isInitialized) await initDB();

  if (useLocalStorage || !db) {
    return [];
  }

  try {
    const result = await db.select('bet');
    return result as Bet[];
  } catch (error) {
    console.warn('DB fetch failed, falling back to local');
    notifyCallback('Could not connect to the database. Using local storage.', 'info');
    return [];
  }
};

export const createTransaction = async (transaction: Transaction): Promise<void> => {
  if (!isInitialized) await initDB();

  if (!useLocalStorage && db) {
    try {
      await db.create(`transaction:${transaction.id}`, transaction);
    } catch (error) {
      console.error('Failed to create transaction in DB', error);
    }
  }
};

export const getLeaderboard = async (): Promise<UserProfile[]> => {
  if (useLocalStorage || !db) {
    return [];
  }

  try {
    const result = await db.select('user');
    const profiles = result as UserProfile[];
    return profiles.sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 10);
  } catch (error) {
    console.warn('DB fetch failed, falling back to local');
    notifyCallback('Could not connect to the database. Using local storage.', 'info');
    return [];
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  if (!isInitialized) await initDB();

  if (!useLocalStorage && db) {
    try {
      await db.merge(`user:${userId}`, { balance: newBalance });
    } catch (error) {
      console.error('Failed to update user balance in DB', error);
    }
  }
};
