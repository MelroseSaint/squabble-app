# Squabble Web Architecture

This document describes the architecture of the Squabble web application built with Next.js and InstantDB.

## High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Client (Browser)                                │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────────┐  │
│  │   Next.js   │    │  InstantDB  │    │            UI Components            │  │
│  │   App Router│    │   Client    │    │  (React + Tailwind + Lucide)        │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────────────┘  │
│          │                  │                          │                      │  │
│          ▼                  ▼                          ▼                      ▼  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  Pages/     │    │  Real-time  │    │  State      │    │  Services   │  │
│  │  Routes     │    │  Data Sync  │    │  Management│    │  (DB, AI,   │  │
│  └─────────────┘    └─────────────┘    │  (React     │    │   Payments) │  │
│                                    │  Hooks)     │    └─────────────┘  │
│                                    └─────────────┘                      │  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
                                                                               │
                                                                               ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Server (Cloud)                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        InstantDB Backend                                │  │
│  │                                                                         │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐  │  │
│  │  │  Database   │    │  Auth       │    │  Real-time Engine           │  │  │
│  │  │  (Schema +  │    │  Service    │    │  (WebSocket + Pub/Sub)      │  │  │
│  │  │   Rules)    │    └─────────────┘    └─────────────────────────────┘  │  │
│  │  └─────────────┘                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Web-First Approach

- **No mobile frameworks**: Pure web application using Next.js
- **Responsive design**: Works on desktop and mobile browsers
- **URL routing**: Uses Next.js App Router instead of app screens
- **SEO friendly**: Next.js provides server-side rendering capabilities

### 2. Real-time Data with InstantDB

- **WebSocket connections**: InstantDB maintains persistent connections
- **Automatic sync**: Data changes propagate instantly across all clients
- **Offline support**: InstantDB handles reconnection automatically
- **Conflict resolution**: Built-in conflict resolution strategies

### 3. Authentication Strategy

- **InstantDB Auth**: Built-in email/password authentication
- **Session management**: Secure token-based sessions
- **Rule-based access**: Fine-grained permissions via InstantDB rules
- **No Firebase**: Clean separation from mobile frameworks

### 4. State Management

- **InstantDB as source of truth**: All app state comes from InstantDB
- **React hooks**: Custom hooks for data access (`useInstant`)
- **Optimistic UI**: Local state updates with async database sync
- **No Redux/MobX**: Simplified architecture using InstantDB subscriptions

## Data Flow

### User Authentication

```
1. User submits login form
2. InstantDB client calls signIn()
3. InstantDB auth service validates credentials
4. Returns auth token to client
5. Client stores token and updates UI
6. Real-time subscriptions activate
```

### Match Creation

```
1. User swipes right on fighter
2. Local state updates optimistically
3. createMatch() called with match data
4. InstantDB creates record with userId
5. Real-time sync propagates to all user's devices
6. Match appears in match list automatically
```

### Chat Messages

```
1. User sends message
2. Local state updates immediately
3. updateMatchMessages() called
4. InstantDB updates match record
5. All subscribed clients receive update
6. Chat interfaces update in real-time
```

## Component Architecture

### Page Structure

```
App Layout
├── ToastProvider
│   ├── Navigation
│   ├── Current View (based on route)
│   │   ├── SwipeView
│   │   ├── MatchList
│   │   ├── ChatInterface
│   │   ├── ProfileView
│   │   ├── MapView
│   │   ├── SettingsView
│   │   ├── AnalyticsView
│   │   ├── FadeDuelView
│   │   └── SafetyCenter
│   └── BottomNavigation
└── Modals (Payment, Safety, etc.)
```

### Data Flow in Components

```typescript
// 1. Import InstantDB hook
import { useInstant } from '../../lib/instant/hooks'

// 2. Get data operations
const { getMatches, createMatch, userProfile } = useInstant()

// 3. Load data (automatic real-time updates)
const matches = await getMatches()

// 4. Update data
await createMatch(newMatch)

// 5. UI automatically updates via InstantDB subscriptions
```

## Performance Considerations

### Optimizations

- **Code splitting**: Next.js automatic code splitting
- **Lazy loading**: Dynamic imports for heavy components
- **Real-time throttling**: InstantDB batch updates
- **Caching**: Next.js built-in caching
- **Image optimization**: Next.js Image component

### Scaling

- **InstantDB scaling**: Automatic scaling with usage
- **Next.js scaling**: Vercel/Node.js horizontal scaling
- **Database sharding**: InstantDB handles partitioning
- **CDN caching**: Next.js static content caching

## Security

### Authentication

- **Token-based**: JWT tokens for authentication
- **Secure storage**: HTTP-only cookies for tokens
- **Session management**: InstantDB session handling

### Authorization

- **Rule-based**: InstantDB schema rules
- **Data-level**: Fine-grained record access
- **User context**: All queries include user context

### Data Protection

- **Encryption**: HTTPS for all communications
- **Input validation**: Both client and server-side
- **Rate limiting**: InstantDB built-in protection

## Deployment Architecture

### Development

```
Local Next.js dev server
│
└──> InstantDB cloud (dev mode)
```

### Production

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Vercel/Node.js Hosting                           │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────────┐  │
│  │  Next.js    │    │  Static     │    │  API Routes (if needed)           │  │
│  │  App Router │    │  Assets     │    │  (Edge Functions)                  │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────────────┘  │
│          │                          │                      │                      │  │
│          ▼                          ▼                      ▼                      ▼  │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        InstantDB Cloud Service                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Migration from Vite/React to Next.js/InstantDB

### Key Changes

1. **Framework**: Vite → Next.js
2. **Database**: SurrealDB → InstantDB
3. **Routing**: Single-page app → URL routing
4. **State**: Local state → InstantDB real-time
5. **Auth**: Custom → InstantDB auth

### Benefits

- **Better SEO**: Next.js server-side rendering
- **Real-time**: InstantDB WebSocket sync
- **Simpler auth**: Built-in InstantDB authentication
- **Scalability**: Next.js + InstantDB cloud
- **Maintainability**: Cleaner architecture

## Future Architecture Evolution

### Potential Enhancements

1. **Microservices**: Split into separate services
2. **GraphQL**: Add GraphQL layer for complex queries
3. **WebAssembly**: Performance-critical components
4. **Edge Functions**: Move logic to edge
5. **Multi-region**: Global InstantDB deployment

### Scaling Strategies

- **Database**: InstantDB automatic scaling
- **Frontend**: Next.js static generation
- **API**: Edge functions for low-latency
- **Cache**: Redis for frequent queries

## Conclusion

This architecture provides a solid foundation for a scalable, real-time web application using modern web technologies. The combination of Next.js for the frontend and InstantDB for real-time data creates a powerful, maintainable platform that works across all modern browsers.