# InstantDB Setup Guide for Squabble

This guide explains how to set up and configure InstantDB for the Squabble web application.

## Overview

InstantDB provides real-time data syncing and authentication for Squabble. The app uses InstantDB for:

- User authentication (email/password)
- Real-time match updates
- Profile management
- Chat message syncing
- Legal status tracking

## Configuration

### 1. Environment Variables

Set up your `.env.local` file with InstantDB credentials:

```env
NEXT_PUBLIC_INSTANTDB_APP_ID=your_app_id
NEXT_PUBLIC_INSTANTDB_TOKEN=your_token
```

### 2. Client Configuration

The InstantDB client is configured in `lib/instant/client.ts`:

```typescript
const appId = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || 'squabble'
const token = process.env.NEXT_PUBLIC_INSTANTDB_TOKEN || ''

const instant = createClient({
  appId: appId,
  token: token,
  sync: {
    enabled: true,
    collections: ['matches', 'users', 'profiles', 'messages']
  }
})
```

### 3. Schema Definition

The database schema is defined in `db/schema.ts`:

- **matches**: Stores fighter matches and chat history
- **users**: User authentication data
- **profiles**: User profile information
- **messages**: Chat messages
- **legal**: Legal consent tracking

### 4. Access Rules

Security rules are defined in `db/rules.ts`:

- Only authenticated users can create/update/delete their own data
- Strict access control for user profiles
- Rule-based permissions for all operations

## React Hooks

The `lib/instant/hooks.ts` file provides React hooks for InstantDB:

```typescript
export const useInstant = () => {
  // Returns all InstantDB operations
  // - isReady: Connection status
  // - user: Current authenticated user
  // - isAuthenticated: Auth check
  // - getLegalStatus/saveLegalStatus: Legal consent
  // - getMatches/createMatch/updateMatchMessages/deleteMatch: Match operations
  // - getUserProfile/saveUserProfile: Profile operations
  // - signin/signup/signout: Authentication
}
```

## Usage in Components

### Basic Usage

```typescript
import { useInstant } from '../../lib/instant/hooks'

const MyComponent = () => {
  const { isReady, user, getMatches, createMatch } = useInstant()
  
  // Use InstantDB methods
  const loadMatches = async () => {
    const matches = await getMatches()
    // ...
  }
  
  // ...
}
```

### Real-time Updates

InstantDB automatically syncs data in real-time. When data changes in the database, your React components will automatically re-render with the latest data.

## Authentication Flow

1. **Signup**: `signup(email, password)`
2. **Signin**: `signin(email, password)`
3. **Signout**: `signout()`
4. **Check Auth**: `isAuthenticated()`

## Data Operations

### Matches

```typescript
// Get all matches for current user
const matches = await getMatches()

// Create a new match
await createMatch(matchData)

// Update match messages
await updateMatchMessages(matchId, history, lastMessage)

// Delete a match
await deleteMatch(matchId)
```

### Profiles

```typescript
// Get user profile
const profile = await getUserProfile()

// Save user profile
await saveUserProfile(profileData)
```

### Legal Status

```typescript
// Get legal consent status
const accepted = await getLegalStatus()

// Save legal consent
await saveLegalStatus(true)
```

## Deployment

### Local Development

The app will work with InstantDB in development mode without additional configuration.

### Production

1. Create an InstantDB account
2. Create a new app in the InstantDB dashboard
3. Copy your app ID and token
4. Update your `.env.local` file
5. Deploy your Next.js app

## Troubleshooting

### Connection Issues

- Check your environment variables
- Verify your InstantDB app ID and token
- Check browser console for errors

### Authentication Problems

- Ensure users are properly signed up before signing in
- Check InstantDB dashboard for user records
- Verify email/password combinations

### Data Sync Issues

- Check InstantDB dashboard for data
- Verify real-time sync is enabled in client config
- Check browser network tab for WebSocket connections

## Best Practices

1. **Security**: Never expose InstantDB tokens in client-side code in production
2. **Error Handling**: Always handle errors gracefully
3. **Loading States**: Show loading indicators during data operations
4. **Optimistic Updates**: Update UI optimistically, then sync with database
5. **Data Validation**: Validate data before sending to InstantDB