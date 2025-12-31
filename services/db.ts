import { Match, Message, UserProfile } from '../types';

// InstantDB is optional. If VITE_INSTANTDB_APP_ID is not provided, we fall back to LocalStorage.
const INSTANT_APP_ID = (import.meta as any).env?.VITE_INSTANTDB_APP_ID as string | undefined;

const LS_MATCHES_KEY = 'squabble_matches';
const LS_SESSION_KEY = 'squabble_auth_token';
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
  bio: 'Here for the smoke. Not the hospital bill.',
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

type StoredSession = {
  user: string;
};

const readJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getSession = (): StoredSession | null => {
  const raw = localStorage.getItem(LS_SESSION_KEY);
  if (!raw) return null;

  const parsed = readJson<StoredSession>(raw);
  if (parsed?.user) return parsed;

  // Backwards compatibility: older versions stored a raw token string.
  return { user: 'Guest' };
};

const setSession = (session: StoredSession | null) => {
  if (!session) {
    localStorage.removeItem(LS_SESSION_KEY);
    return;
  }
  localStorage.setItem(LS_SESSION_KEY, JSON.stringify(session));
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

let instant: any = null;
let useLocalStorage = false;
let isInitialized = false;

export const initDB = async (): Promise<boolean> => {
  if (isInitialized) return !useLocalStorage;

  if (!INSTANT_APP_ID) {
    useLocalStorage = true;
    isInitialized = true;
    return false;
  }

  try {
    const mod: any = await import('@instantdb/core');
    const init = mod.init ?? mod.default?.init;

    if (!init) {
      throw new Error('InstantDB init() export not found.');
    }

    instant = init({ appId: INSTANT_APP_ID });

    // If the app uses auth rules, guest auth keeps things working without a dedicated login flow.
    // This may fail when offline; ignore.
    instant.auth?.signInAsGuest?.().catch(() => undefined);

    useLocalStorage = false;
    isInitialized = true;
    return true;
  } catch (error) {
    console.warn('InstantDB initialization failed. Falling back to LocalStorage.', error);
    instant = null;
    useLocalStorage = true;
    isInitialized = true;
    return false;
  }
};

export const signup = async (user: string, pass: string): Promise<void> => {
  const users = getLocalUsers();
  if (users[user]) {
    throw new Error('Username already exists.');
  }

  users[user] = { password: pass };
  saveLocalUsers(users);
  setSession({ user });

  // Try to initialise InstantDB in the background (optional)
  if (!isInitialized) {
    initDB().catch(() => undefined);
  }
};

export const signin = async (user: string, pass: string): Promise<void> => {
  const users = getLocalUsers();
  if (!users[user] || users[user].password !== pass) {
    throw new Error('Invalid username or password.');
  }

  setSession({ user });

  if (!isInitialized) {
    initDB().catch(() => undefined);
  }
};

export const signout = async (): Promise<void> => {
  setSession(null);

  if (instant?.auth?.signOut) {
    try {
      await instant.auth.signOut();
    } catch {
      // ignore
    }
  }
};

export const isAuthenticated = (): boolean => {
  return !!getSession();
};

export const getMatches = async (): Promise<Match[]> => {
  if (!isInitialized) await initDB();

  const local = getLocalMatches();

  if (useLocalStorage || !instant) {
    return local;
  }

  try {
    const resp = await instant.queryOnce({ matches: {} });
    const remote = (resp?.data as any)?.matches;

    if (Array.isArray(remote)) {
      saveLocalMatches(remote as Match[]);
      return remote as Match[];
    }

    return local;
  } catch (error) {
    // queryOnce throws if offline / no active connection.
    return local;
  }
};

export const createMatch = async (match: Match): Promise<void> => {
  if (!isInitialized) await initDB();

  const currentLocal = getLocalMatches();
  saveLocalMatches([match, ...currentLocal]);

  if (!useLocalStorage && instant) {
    try {
      await instant.transact(instant.tx.matches[match.id].update(match));
    } catch (error) {
      console.warn('Failed to create match in InstantDB', error);
    }
  }
};

export const updateMatchMessages = async (matchId: string, history: Message[], lastMessage: string): Promise<void> => {
  if (!isInitialized) await initDB();

  const matches = getLocalMatches();
  const updatedMatches = matches.map(m => (m.id === matchId ? { ...m, history, lastMessage } : m));
  saveLocalMatches(updatedMatches);

  if (!useLocalStorage && instant) {
    try {
      await instant.transact(instant.tx.matches[matchId].update({ history, lastMessage }));
    } catch (error) {
      console.warn('Failed to update match in InstantDB', error);
    }
  }
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  if (!isInitialized) await initDB();

  const matches = getLocalMatches();
  saveLocalMatches(matches.filter(m => m.id !== matchId));

  if (!useLocalStorage && instant) {
    try {
      await instant.transact(instant.tx.matches[matchId].delete());
    } catch (error) {
      console.warn('Failed to delete match in InstantDB', error);
    }
  }
};

// --- User Profile Helpers ---

export const getUserProfile = async (): Promise<UserProfile> => {
  const localStored = localStorage.getItem(LS_PROFILE_KEY);
  const localProfile = localStored ? ({ ...DEFAULT_PROFILE, ...(readJson<UserProfile>(localStored) ?? {}) } as UserProfile) : DEFAULT_PROFILE;

  if (!isInitialized) await initDB();

  const session = getSession();
  if (useLocalStorage || !instant || !session?.user || session.user === 'Guest') {
    return localProfile;
  }

  try {
    const resp = await instant.queryOnce({ profiles: { $: { where: { id: session.user }, limit: 1 } } });
    const remote = (resp?.data as any)?.profiles?.[0];

    if (remote && typeof remote === 'object') {
      const merged = { ...DEFAULT_PROFILE, ...remote } as UserProfile;
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(merged));
      return merged;
    }

    return localProfile;
  } catch {
    return localProfile;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));

  if (!isInitialized) await initDB();

  const session = getSession();
  if (useLocalStorage || !instant || !session?.user || session.user === 'Guest') {
    return;
  }

  try {
    await instant.transact(instant.tx.profiles[session.user].update(profile));
  } catch (e) {
    console.warn('Failed to save profile to InstantDB', e);
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
