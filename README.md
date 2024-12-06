# ReadVenture

A modern React Native application for interactive reading and learning, using TypeScript and Firebase.

## Quick Start

> **Note**: Requires Node.js 18+, Xcode 14+ (iOS), and Android Studio (Android)

1. **Environment Setup**
   ```bash
   npm install # Install dependencies with package-lock.json
   cp .env.example .env # Configure environment
   ```

2. **Development Server**
   ```bash
   npm start # Start Metro bundler with type checking
   ```

3. **Run Application**
   ```bash
   npm run ios # iOS simulator
   npm run android # Android emulator
   ```

## Development Guide

### Prerequisites

- Node.js 18+
- Xcode 14+ (iOS)
- Android Studio (Android)
- [React Native Environment](https://reactnative.dev/docs/environment-setup)

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Required variables:
   ```properties
   FIREBASE_API_KEY=your_api_key
   FIREBASE_PROJECT_ID=your_project_id
   API_URL=https://api.readventure.app
   ```

### Essential Commands

| Command | Purpose |
|---------|----------|
| `npm start` | Metro bundler with type checking |
| `npm test` | Jest tests with coverage |
| `npm run lint:fix` | ESLint + Prettier fixes |
| `npm run build:ios` | iOS release build |
| `npm run build:android` | Android release APK |

### Development Tools

- Hot Reload: <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> (iOS), Double <kbd>R</kbd> (Android)
- Dev Menu: <kbd>Cmd ⌘</kbd> + <kbd>D</kbd> (iOS), <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (Android)

## Project Architecture

```
src/
├── components/    # Atomic design components
├── screens/      # Route-based screens
├── services/     # Business logic + API
├── utils/        # Pure functions
├── store/        # Redux state
└── types/        # TypeScript definitions
```

## Contributing

1. Fork and clone
2. Create feature branch
3. Follow style guide
4. Add tests (80% coverage required)
5. Submit PR against `main`

## Documentation

- [Setup Guide](docs/setup.md)
- [Testing Guide](docs/testing.md)
- [API Reference](docs/api.md)
- [Component Library](docs/components.md)

## Support

- Issues: [GitHub Issues](https://github.com/org/readventure/issues)
- Chat: [Discord Community](https://discord.gg/readventure)
