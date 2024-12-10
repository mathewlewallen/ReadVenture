# ReadVenture

An intelligent React Native application for interactive reading and learning, leveraging TypeScript, Firebase, and voice recognition technology to help children improve their reading skills through real-time feedback.

## 🚀 Overview

ReadVenture creates an engaging educational experience through:

- Voice-based reading validation using React Native Voice
- Real-time accuracy assessment with Jaro-Winkler algorithm
- Progress tracking and analytics via Firebase
- Parent monitoring dashboard
- Offline reading capabilities

## ⚙️ Technical Stack

- **Frontend**: React Native 0.72+, TypeScript 5.0
- **State Management**: Redux, Context API
- **Backend**: Firebase Cloud Functions
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **Voice Processing**: @react-native-voice/voice
- **Testing**: Jest, React Native Testing Library
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
readventure/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/       # Route-based screen components
│   │   ├── main/      # Main app screens
│   │   └── reading/   # Reading functionality
│   ├── hooks/         # Custom React hooks
│   ├── navigation/    # Navigation configuration
│   ├── services/      # API & business logic
│   ├── store/         # Redux state management
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── backend-firebase/  # Firebase Cloud Functions
├── ios/              # iOS native code
├── android/          # Android native code
├── docs/             # Documentation
└── config/           # App configuration
```

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+
- Xcode 14+ (iOS)
- Android Studio (Android)
- [React Native Environment](https://reactnative.dev/docs/environment-setup)

### Installation

1. **Clone & Dependencies**

   ```bash
   git clone https://github.com/your-username/readventure.git
   cd readventure
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```properties
   FIREBASE_API_KEY=your_api_key
   FIREBASE_PROJECT_ID=your_project_id
   API_URL=https://api.readventure.app
   ```

3. **Development**
   ```bash
   npm start         # Metro bundler
   npm run ios       # iOS simulator
   npm run android   # Android emulator
   ```

### Essential Commands

| Command                    | Purpose                          |
| -------------------------- | -------------------------------- |
| `npm start`                | Metro bundler with type checking |
| `npm test`                 | Jest tests with coverage         |
| `npm run lint:fix`         | ESLint + Prettier fixes          |
| `npm run lint`             | Code linting                     |
| `npm run format`           | Code formatting                  |
| `npm run build:ios`        | iOS release build                |
| `npm run build:android`    | Android release APK              |
| `npm run generate-barrels` | Update barrel exports            |

### Development Tools

- Hot Reload: <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> (iOS), Double <kbd>R</kbd> (Android)
- Dev Menu: <kbd>Cmd ⌘</kbd> + <kbd>D</kbd> (iOS), <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (Android)

## 🧪 Testing

- Unit tests for utilities
- Integration tests for services
- E2E tests for critical flows
- Minimum 80% coverage required

## 📚 Key Features

### Reading Features

- Voice recognition for reading validation
- Real-time accuracy assessment
- Progress tracking
- Offline support
- Adaptive difficulty

### Technical Features

- Error boundary implementation
- Firebase Functions integration
- Offline data sync
- Analytics tracking
- TypeScript type safety

## 📖 Documentation

- [Setup Guide](docs/setup.md)
- [Testing Guide](docs/testing.md)
- [API Reference](docs/api.md)
- [Component Library](docs/components.md)

## 🤝 Contributing

1. Fork and clone
2. Create feature branch
3. Follow style guide
4. Add tests (80% coverage required)
5. Submit PR against `main`

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## 💬 Support

- Issues: [GitHub Issues](https://github.com/org/readventure/issues)
- Chat: [Discord Community](https://discord.gg/readventure)

## 📄 License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

## 👥 Authors

Mathew Lewallen - Initial work - mathewlewallen
