// InstantDB Client Configuration
import { createClient } from '@instantdb/react';

// Initialize InstantDB client
const appId = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || 'squabble';
const token = process.env.NEXT_PUBLIC_INSTANTDB_TOKEN || '';

// Create InstantDB client
const instant = createClient({
  appId: appId,
  token: token,
  // Enable real-time sync
  sync: {
    enabled: true,
    // Sync all collections by default
    collections: ['matches', 'users', 'profiles', 'messages']
  }
});

export default instant;