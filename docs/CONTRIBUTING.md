# Contributing to ReadVenture

## Getting Started

Before contributing, please ensure you have:

- Node.js 18+
- Git
- React Native development environment

## Development Setup

```bash
git clone https://github.com/your-username/readventure.git
cd readventure
npm install
```

## Project Standards

### Code Style

- TypeScript for type safety
- ESLint and Prettier for formatting
- 80 character line limit
- Functional components with hooks

### Git Workflow

1. Create feature branch from `main`
2. Commit using conventional commits
3. Submit PR against `main`

### Testing Requirements

- Unit tests for utility functions
- Integration tests for services
- E2E tests for critical flows
- Minimum 80% coverage

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Pass CI checks
4. Get 2 code reviews

## Development Guidelines

### Components
- Use TypeScript Props interface
- Implement error boundaries
- Add accessibility features
- Document prop types

### State Management
- Use Redux for global state
- Context for component state
- Async storage for persistence

### API Integration
- Implement retry logic
- Handle network errors
- Validate responses
- Use TypeScript interfaces

## Questions?

Open an issue or contact maintainers.
