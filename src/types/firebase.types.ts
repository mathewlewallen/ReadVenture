/*
Generate a complete implementation for this file that:
1. Follows the project's React Native / TypeScript patterns
2. Uses proper imports and type definitions
3. Implements error handling and loading states
4. Includes JSDoc documentation
5. Follows project ESLint/Prettier rules
6. Integrates with existing app architecture
7. Includes proper testing considerations
8. Uses project's defined components and utilities
9. Handles proper memory management/cleanup
10. Follows accessibility guidelines

File requirements:
- Must integrate with Redux store
- Must use React hooks appropriately
- Must handle mobile-specific considerations
- Must maintain type safety
- Must have proper error boundaries
- Must follow project folder structure
- Must use existing shared components
- Must handle navigation properly
- Must scale well as app grows
- Must follow security best practices
*/
// src/types/firebase.types.ts
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isParent?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends LoginCredentials {
  displayName: string;
  isParent: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  ageRange: number[];
  createdAt: Date;
}

export interface ReadingProgress {
  userId: string;
  storyId: string;
  wordsRead: number;
  accuracy: number;
  completedAt?: Date;
}
