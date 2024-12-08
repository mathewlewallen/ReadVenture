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
// src/services/firebase/storage.service.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config';

class StorageService {
  private storage = getStorage(app);
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async getImageUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }
}

export const storageService = StorageService.getInstance();
