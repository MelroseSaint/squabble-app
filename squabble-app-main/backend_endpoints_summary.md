# Squabble App - Backend Endpoints & Services Summary

## Database Infrastructure

### Primary Database: SurrealDB
- **Endpoint**: `wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc`
- **Namespace**: `squabble`
- **Database**: `squabble_db`
- **Authentication Scope**: `allusers` (24h sessions)

### Database Schema

#### User Table (`user`)
```sql
- id: record ID
- username: string (unique)
- password: string (argon2 encrypted)
- balance: float (default: 100.0)
- created_at: datetime
```

#### Matches Table (`matches`)
```sql
- id: record ID
- fighter: Fighter object
- timestamp: number
- lastMessage: string (optional)
- history: Message[] array
```

#### Bet Table (`bet`)
```sql
- id: record ID
- user: record(user)
- fighterName: string
- opponentName: string
- amount: float
- odds: string
- status: 'OPEN' | 'WON' | 'LOST' (default: 'OPEN')
- created_at: datetime
```

#### Transaction Table (`transaction`)
```sql
- id: record ID
- user: record(user)
- type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_WIN' | 'BET_LOSS'
- amount: float
- status: 'COMPLETED' | 'PENDING' | 'FAILED' (default: 'COMPLETED')
- description: string
- created_at: datetime
```

## Service Layer Architecture

### 1. Database Service (`services/db.ts`)

#### Authentication Endpoints:
- `signin(user, pass)` - User authentication
- `signup(user, pass)` - User registration
- `signout()` - User logout
- `isAuthenticated()` - Check authentication status

#### Match Management:
- `getMatches()` - Retrieve all matches
- `createMatch(match)` - Create new match
- `updateMatchMessages(matchId, history, lastMessage)` - Update match chat
- `deleteMatch(matchId)` - Delete match

#### User Profile Management:
- `getUserProfile()` - Get user profile
- `saveUserProfile(profile)` - Save user profile

#### Betting & Transactions:
- `createBet(bet)` - Create new bet
- `getBetHistory()` - Get betting history
- `createTransaction(transaction)` - Create transaction
- `getLeaderboard()` - Get leaderboard data
- `updateUserBalance(userId, newBalance)` - Update user balance

#### Legal & Compliance:
- `getLegalStatus()` - Check legal acceptance
- `saveLegalStatus(accepted)` - Save legal acceptance

### 2. AI Service (`services/geminiService.ts`)

#### Google Gemini AI Integration:
- `generateFighters(apiKey)` - Generate AI fighter profiles
- `generateChatReply(apiKey, fighter, history, trashTalk)` - Generate AI chat responses
- `generateTrashTalk(apiKey, fighter, history)` - Generate trash talk messages

### 3. Wager Service (`services/wagerService.ts`)

#### Betting Logic:
- `processWager(bet, user)` - Process bet outcomes and update balances

### 4. Mock Generator (`services/mockGenerator.ts`)

#### Fallback Data Generation:
- `generateMockFighters(count)` - Generate mock fighter profiles when AI unavailable

## API Key Management

### Google Gemini AI:
- Stored in localStorage as `gemini_api_key`
- Used for fighter generation and chat responses
- Falls back to mock data when not provided

### Database Authentication:
- Token stored in localStorage as `squabble_auth_token`
- 24-hour session duration
- Automatic token refresh on successful login

## Error Handling & Fallbacks

### Database Connectivity:
- Primary: SurrealDB cloud instance
- Fallback: LocalStorage for offline functionality
- Graceful degradation with user notifications

### AI Services:
- Primary: Google Gemini API
- Fallback: Pre-defined mock data and responses
- Randomized responses for variety

## Security Considerations

### Authentication:
- Argon2 password hashing
- JWT-based session tokens
- Scope-based access control

### Data Permissions:
- User-specific data isolation
- Record-level access controls
- Session-based authentication

## Maintenance Checklist

### Database Health:
- [ ] Monitor SurrealDB connection status
- [ ] Verify namespace and database integrity
- [ ] Check authentication scope functionality
- [ ] Validate table schemas and permissions

### Service Health:
- [ ] Test AI service integration (Gemini API)
- [ ] Verify fallback data generation
- [ ] Check wager processing logic
- [ ] Validate transaction handling

### Security:
- [ ] Monitor authentication token expiration
- [ ] Verify password hashing security
- [ ] Check API key storage security
- [ ] Validate data access permissions

### Performance:
- [ ] Monitor database query performance
- [ ] Check AI service response times
- [ ] Verify localStorage fallback efficiency
- [ ] Test error handling responsiveness

## Integration Points

### Frontend Integration:
- Zustand state management store
- React hooks for data operations
- Component-level service calls
- Real-time data synchronization

### External Services:
- Google Gemini AI API
- SurrealDB cloud hosting
- Picsum Photos for fighter images
- Stripe (for payments - integrated but not fully implemented)

## Deployment Considerations

### Environment Variables:
- Database endpoint configuration
- Authentication tokens
- API key management
- Service endpoint URLs

### Monitoring:
- Database connection health
- API service availability
- Error rate tracking
- Performance metrics

This backend architecture provides a solid foundation for the Squabble app with proper data management, authentication, AI integration, and fallback mechanisms for reliable operation.
