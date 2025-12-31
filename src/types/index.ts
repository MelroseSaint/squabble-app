
export interface FighterStats {
  strength: number;
  speed: number;
  anger: number;
  durability: number;
  crazy: number;
}

export interface Fighter {
  id: string;
  name: string;
  age: number;
  height: string;
  weight: string;
  weightClass: string; // e.g., "Featherweight", "Heavyweight"
  stance: 'Orthodox' | 'Southpaw' | 'Switch';
  experience: 'Novice' | 'Amateur' | 'Pro' | 'Street';
  bio: string;
  fightingStyle: string;
  location: string;
  stats: FighterStats;
  imageUrl: string;
  distance: number;
  wins: number;
  losses: number;
  winStreak: number;
  badges: string[]; // e.g., "Verified", "Gym Owner"
  compatibility?: number; // 0-100 score
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export interface Bet {
    id: string;
    fighterName: string;
    opponentName: string;
    amount: number;
    odds: string; // e.g. "+150"
    status: 'OPEN' | 'WON' | 'LOST';
    timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_WIN' | 'BET_LOSS';
  amount: number;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
}

export interface UserProfile {
  name: string;
  age: number;
  height: string;
  weight: string;
  weightClass: string;
  stance: string;
  experience: string;
  bio: string;
  fightingStyle: string;
  wins: number;
  losses: number;
  matches: number;
  isVerified: boolean;
  trustedContacts: TrustedContact[];
  balance: number;
  betHistory: Bet[];
  transactions: Transaction[];
}

export interface Message {
  id: string;
  sender: 'user' | 'fighter';
  text: string;
  timestamp: number;
}

export interface Match {
  id: string;
  fighter: Fighter;
  timestamp: number;
  lastMessage?: string;
  history: Message[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export enum View {
  SWIPE = 'SWIPE',
  MATCHES = 'MATCHES',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  ONLYFIGHTS = 'ONLYFIGHTS',
  STYLES = 'STYLES',
  MAP = 'MAP',
  SETTINGS = 'SETTINGS',
  ANALYTICS = 'ANALYTICS',
  FADE_DUEL = 'FADE_DUEL'
}
