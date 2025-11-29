# Squabble App - API Endpoints Documentation

## Base Configuration

### Database Connection
```
Endpoint: wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc
Namespace: squabble
Database: squabble_db
Authentication Scope: allusers
Session Duration: 24 hours
```

## Authentication Endpoints

### POST /signin
**Description**: Authenticate user with credentials
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: 
- Success: JWT token (stored in localStorage)
- Error: Authentication failure message

### POST /signup
**Description**: Register new user account
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: 
- Success: JWT token for new user
- Error: Registration failure message

### POST /signout
**Description**: Logout user and invalidate session
**Response**: Session cleared

### GET /isAuthenticated
**Description**: Check if user is currently authenticated
**Response**: 
```json
{
  "authenticated": boolean
}
```

## User Management Endpoints

### GET /user/profile
**Description**: Get current user profile
**Response**: 
```json
{
  "id": "string",
  "name": "string",
  "age": number,
  "height": "string",
  "weight": "string",
  "weightClass": "string",
  "stance": "string",
  "experience": "string",
  "bio": "string",
  "fightingStyle": "string",
  "wins": number,
  "losses": number,
  "matches": number,
  "isVerified": boolean,
  "trustedContacts": Array,
  "balance": number,
  "betHistory": Array,
  "transactions": Array
}
```

### PUT /user/profile
**Description**: Update user profile
**Request Body**: UserProfile object
**Response**: Updated user profile

### PUT /user/balance
**Description**: Update user balance
**Request Body**:
```json
{
  "userId": "string",
  "newBalance": number
}
```
**Response**: Success confirmation

## Match Management Endpoints

### GET /matches
**Description**: Get all user matches
**Response**: 
```json
[
  {
    "id": "string",
    "fighter": Fighter,
    "timestamp": number,
    "lastMessage": "string",
    "history": [Message]
  }
]
```

### POST /matches
**Description**: Create new match
**Request Body**:
```json
{
  "id": "string",
  "fighter": Fighter,
  "timestamp": number,
  "history": []
}
```
**Response**: Created match object

### PUT /matches/{matchId}/messages
**Description**: Update match messages
**Request Body**:
```json
{
  "history": [Message],
  "lastMessage": "string"
}
```
**Response**: Updated match

### DELETE /matches/{matchId}
**Description**: Delete a match
**Response**: Success confirmation

## Betting Endpoints

### GET /bets
**Description**: Get user betting history
**Response**: 
```json
[
  {
    "id": "string",
    "user": "string",
    "fighterName": "string",
    "opponentName": "string",
    "amount": number,
    "odds": "string",
    "status": "OPEN|WON|LOST",
    "timestamp": number
  }
]
```

### POST /bets
**Description**: Place new bet
**Request Body**:
```json
{
  "id": "string",
  "user": "string",
  "fighterName": "string",
  "opponentName": "string",
  "amount": number,
  "odds": "string"
}
```
**Response**: Created bet object

### POST /bets/process
**Description**: Process bet outcome
**Request Body**:
```json
{
  "bet": Bet,
  "user": UserProfile
}
```
**Response**: Processed bet with updated balance

## Transaction Endpoints

### GET /transactions
**Description**: Get user transaction history
**Response**: 
```json
[
  {
    "id": "string",
    "user": "string",
    "type": "DEPOSIT|WITHDRAWAL|BET_WIN|BET_LOSS",
    "amount": number,
    "timestamp": number,
    "status": "COMPLETED|PENDING|FAILED",
    "description": "string"
  }
]
```

### POST /transactions
**Description**: Create new transaction
**Request Body**:
```json
{
  "id": "string",
  "user": "string",
  "type": "string",
  "amount": number,
  "description": "string"
}
```
**Response**: Created transaction object

## Leaderboard Endpoints

### GET /leaderboard
**Description**: Get top 10 users by wins
**Response**: 
```json
[
  {
    "id": "string",
    "name": "string",
    "wins": number,
    "losses": number,
    "balance": number
  }
]
```

## AI Service Endpoints

### POST /ai/generate/fighters
**Description**: Generate AI fighter profiles
**Request Body**:
```json
{
  "apiKey": "string",
  "count": number (optional, default: 5)
}
```
**Response**: 
```json
[
  {
    "id": "string",
    "name": "string",
    "age": number,
    "height": "string",
    "weight": "string",
    "weightClass": "string",
    "stance": "Orthodox|Southpaw|Switch",
    "experience": "Novice|Amateur|Pro|Street",
    "bio": "string",
    "fightingStyle": "string",
    "location": "string",
    "stats": {
      "strength": number,
      "speed": number,
      "anger": number,
      "durability": number,
      "crazy": number
    },
    "imageUrl": "string",
    "wins": number,
    "losses": number,
    "winStreak": number,
    "badges": [string],
    "compatibility": number
  }
]
```

### POST /ai/generate/chat
**Description**: Generate AI chat response
**Request Body**:
```json
{
  "apiKey": "string",
  "fighter": Fighter,
  "history": [Message],
  "trashTalk": boolean (optional, default: false)
}
```
**Response**: 
```json
{
  "message": "string"
}
```

## Legal & Compliance Endpoints

### GET /legal/status
**Description**: Check legal acceptance status
**Response**: 
```json
{
  "accepted": boolean
}
```

### POST /legal/accept
**Description**: Accept legal terms
**Request Body**:
```json
{
  "accepted": boolean
}
```
**Response**: Success confirmation

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string"
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED` - Authentication required
- `AUTH_FAILED` - Authentication failed
- `USER_NOT_FOUND` - User not found
- `INVALID_INPUT` - Invalid input data
- `DATABASE_ERROR` - Database operation failed
- `AI_SERVICE_ERROR` - AI service unavailable
- `INSUFFICIENT_BALANCE` - Insufficient balance for operation

## Rate Limiting

### Authentication Endpoints
- Signin: 5 attempts per minute
- Signup: 3 attempts per minute

### AI Endpoints
- Fighter Generation: 10 requests per minute
- Chat Generation: 30 requests per minute

### Data Endpoints
- Profile Updates: 20 requests per minute
- Bet Placement: 50 requests per minute

## Security Headers

All API responses should include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Data Validation Rules

### User Registration
- Username: 3-20 characters, alphanumeric + underscores
- Password: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number

### Betting
- Minimum bet: $1.00
- Maximum bet: User's current balance
- Bet amount must be multiple of $0.50

### Profile Updates
- Name: 2-50 characters
- Age: 18-100 years
- Bio: Maximum 500 characters

## Monitoring & Logging

### Required Logs
- All authentication attempts (success/failure)
- Database connection status
- API response times
- Error rates by endpoint
- User activity patterns

### Health Check Endpoints

### GET /health
**Description**: Overall system health
**Response**: 
```json
{
  "status": "healthy|degraded|unhealthy",
  "database": "connected|disconnected",
  "ai_service": "available|unavailable",
  "timestamp": number
}
```

### GET /health/database
**Description**: Database connection health
**Response**: 
```json
{
  "status": "connected|disconnected",
  "response_time": number,
  "last_check": number
}
```

This documentation provides a comprehensive overview of all backend endpoints and their specifications for maintenance and development purposes.
