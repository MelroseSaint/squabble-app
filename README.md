# Squabble - Web Fighting App

A Next.js + InstantDB web application for finding fighters, chatting, and competing in real-time.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: InstantDB (real-time backend)
- **UI**: Tailwind CSS + Lucide Icons
- **Authentication**: InstantDB Auth
- **AI**: Google Gemini Integration
- **Payments**: Stripe Integration

## Features

- Real-time fighter matching and chat
- Profile management with fighting stats
- Location-based fighter discovery
- AI-powered trash talk generation
- Wallet and betting system
- Safety center with emergency features
- Responsive web design (desktop + mobile browsers)

## Project Structure

```
/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # UI Components
├── lib/                  # Core libraries
│   └── instant/          # InstantDB client & hooks
│       ├── client.ts     # InstantDB client config
│       └── hooks.ts      # React hooks for InstantDB
├── db/                   # Database schema & rules
│   ├── schema.ts         # InstantDB schema definition
│   └── rules.ts          # Access control rules
├── services/             # Business logic
│   ├── db.ts             # Database service (InstantDB)
│   └── geminiService.ts  # AI service
├── public/               # Static assets
│   └── favicon.ico       # App icon
├── styles/               # Global styles
│   ├── tailwind.config.cjs # Tailwind config
│   └── postcss.config.js  # PostCSS config
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js config
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- InstantDB account (for production)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/squabble.git
cd squabble
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Set up environment variables:

Create a `.env.local` file:

```env
NEXT_PUBLIC_INSTANTDB_APP_ID=your_app_id
NEXT_PUBLIC_INSTANTDB_TOKEN=your_token
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
```

4. Run the development server:

```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## InstantDB Setup

The app uses InstantDB for real-time data syncing. The schema and rules are defined in:

- `db/schema.ts` - Database schema definition
- `db/rules.ts` - Access control rules
- `lib/instant/client.ts` - InstantDB client configuration
- `lib/instant/hooks.ts` - React hooks for InstantDB

## Authentication

The app uses InstantDB's built-in authentication system:

- Email/password authentication
- Session management
- Rule-based access control

## Testing

The project includes test examples using Vitest and React Testing Library.

### Running Tests

```bash
npm test
# or
yarn test
```

### Test Structure

- Unit tests for components
- Integration tests for InstantDB operations
- Utility function tests
- End-to-end test examples

### Test Files Location

- `tests/` - Main test directory
- Component tests alongside components
- Utility tests in relevant directories

## Deployment

The app is ready for deployment to any Next.js compatible hosting:

- Vercel (recommended)
- Netlify
- AWS
- Any Node.js hosting

```bash
npm run build
npm start
```

## Development Notes

- This is a web-first application, not a mobile app
- Uses URL routing instead of app screens
- Real-time updates via InstantDB subscriptions
- Responsive design for desktop and mobile browsers
- No mobile frameworks (React Native, Expo, etc.)

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a pull request

## Support

For issues, questions, or feature requests:

- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the architecture guide in `docs/ARCHITECTURE.md`
- Consult the InstantDB setup guide in `docs/INSTANTDB_SETUP.md`