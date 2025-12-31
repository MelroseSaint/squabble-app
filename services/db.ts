import { Match, Message, UserProfile } from '../types';

// Constants
const DB_ENDPOINT = 'wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc';
const DB_NAMESPACE = 'squabble';
const DB_DATABASE = 'squabble_db';

const LS_MATCHES_KEY = 'squabble_matches';
const LS_TOKEN_KEY = 'squabble_auth_token';
const LS_LOCAL_USERS_KEY = 'squabble_local_users';

const LS_PROFILE_KEY = 'squabble_user_profile';
const LS_LEGAL_KEY = 'squabble_legal_accepted';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Rookie',
  age: 21,
  height: "5'10\"",
  weight: '170 lbs',
  weightClass: 'Welterweight',
  stance: 'Orthodox',
  experience: 'Amateur',
  bio: "Here for the smoke. Not the hospital bill.",
  fightingStyle: 'Boxing',
  wins: 0,
  losses: 0,
  matches: 0,
  isVerified: false,
  trustedContacts: [],
  balance: 0,
  betHistory: [],
  transactions: []
};

type StoredAuth =
  | { mode: 'surreal'; token: string }
  | { mode: 'offline'; user: string; token?: string };

const readJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(LS_TOKEN_KEY);
  if (!raw) return null;

  const parsed = readJson<StoredAuth>(raw);
  if (parsed && (parsed as any).mode) return parsed;

  // Backwards compatibility: older versions stored the Surreal token directly.
  return { mode: 'surreal', token: raw };
};

const setStoredAuth = (auth: StoredAuth | null) => {
  if (!auth) {
    localStorage.removeItem(LS_TOKEN_KEY);
    return;
  }

  localStorage.setItem(LS_TOKEN_KEY, JSON.stringify(auth));
};

const getLocalMatches = (): Match[] => {
  const stored = localStorage.getItem(LS_MATCHES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Match[]) : [];
  } catch (e) {
    console.warn('Failed to parse local matches, resetting.', e);
    localStorage.removeItem(LS_MATCHES_KEY);
    return [];
  }
};

const saveLocalMatches = (matches: Match[]) => {
  localStorage.setItem(LS_MATCHES_KEY, JSON.stringify(matches));
};

const getLocalUsers = (): Record<string, { password: string }> => {
  return readJson<Record<string, { password: string }>>(localStorage.getItem(LS_LOCAL_USERS_KEY)) ?? {};
};

const saveLocalUsers = (users: Record<string, { password: string }>) => {
  localStorage.setItem(LS_LOCAL_USERS_KEY, JSON.stringify(users));
};

// Service State
let db: any = null;
let useLocalStorage = false;
let isInitialized = false;

export const initDB = async (): Promise<boolean> => {
  if (isInitialized) return !useLocalStorage;

  try {
    // Dynamic import to prevent crash if module is missing or fails
    const SurrealMod: any = await import('surrealdb');

    // Handle ESM default vs named export differences
    const SurrealClass = SurrealMod.default || SurrealMod.Surreal;
    if (!SurrealClass) {
      throw new Error('SurrealDB class not found in module.');
    }

    db = new SurrealClass();

    // Disable version check: Surreal client fetches /version via HTTP(S) which often fails behind proxies.
    await db.connect(DB_ENDPOINT, { versionCheck: false });

    // Try to resume session (Surreal tokens only)
    const auth = getStoredAuth();
    if (auth?.mode === 'surreal' && auth.token) {
      try {
        await db.authenticate(auth.token);
      } catch (e) {
        console.warn('Session invalid', e);
        setStoredAuth(null);
      }
    }

    await db.use({ namespace: DB_NAMESPACE, database: DB_DATABASE });

    useLocalStorage = false;
    isInitialized = true;
    return true;
  } catch (error) {
    console.warn('SurrealDB initialization failed. Falling back to LocalStorage.', error);
    useLocalStorage = true;
    isInitialized = true;
    db = null;
    return false;
  }
};

export const signin = async (user: string, pass: string): Promise<void> => {
  if (!isInitialized) await initDB();

  if (useLocalStorage || !db) {
    const users = getLocalUsers();
    if (!users[user] || users[user].password !== pass) {
      throw new Error('Invalid username or password (offline mode).');
    }
    setStoredAuth({ mode: 'offline', user });
    return;
  }

  const token = await db.signin({
    namespace: DB_NAMESPACE,
    database: DB_DATABASE,
    scope: 'allusers',
    username: user,
    password: pass
  });

  // Persist Surreal auth
  setStoredAuth({ mode: 'surreal', token });
};

export const signup = async (user: string, pass: string): Promise<void> => {
  if (!isInitialized) await initDB();

  if (useLocalStorage || !db) {
    const users = getLocalUsers();
    if (users[user]) {
      throw new Error('Username already exists (offline mode).');
    }

    users[user] = { password: pass };
    saveLocalUsers(users);
    setStoredAuth({ mode: 'offline', user });
    return;
  }

  const token = await db.signup({
    namespace: DB_NAMESPACE,
    database: DB_DATABASE,
    scope: 'allusers',
    username: user,
    password: pass
  });

  setStoredAuth({ mode: 'surreal', token });
};

export const signout = async (): Promise<void> => {
  setStoredAuth(null);

  if (db) {
    try {
      await db.invalidate();
    } catch (e) {
      // Ignore if connection is already gone
      console.warn('Failed to invalidate DB session', e);
    }
  }
};

export const isAuthenticated = (): boolean => {
  return !!getStoredAuth();
};

export const getMatches = async (): Promise<Match[]> => {
  if (!isInitialized) await initDB();

  if (useLocalStorage || !db) {
    return getLocalMatches();
  }

  try {
    const result = await db.select('matches');
    return result as Match[];
  } catch (error) {
    console.error('DB fetch failed, falling back to local', error);
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
  const updatedMatches = matches.map(m => (m.id === matchId ? { ...m, history, lastMessage } : m));
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
  const stored = localStorage.getItem(LS_PROFILE_KEY);
  if (!stored) return DEFAULT_PROFILE;

  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch (e) {
    console.error('Failed to load profile', e);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));

  // Optional: Save to DB if connected
  if (!useLocalStorage && db && isInitialized) {
    try {
      await db.merge('user:me', profile);
    } catch (e) {
      console.warn('Failed to save profile to DB', e);
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
  signin,
  signup,
  signout,
  isAuthenticated,
  getMatches,
  createMatch,
  updateMatchMessages,
  deleteMatch,
  getUserProfile,
  saveUserProfile,
  getLegalStatus,
  saveLegalStatus
};
