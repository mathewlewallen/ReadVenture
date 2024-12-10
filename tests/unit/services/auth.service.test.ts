// src/__tests__/services/auth.service.test.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { authService } from '../../services/firebase/auth.service';

jest.mock('../../firebaseConfig', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('AuthService', () => {
  const mockCredentials = {
    email: 'test@test.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login user successfully', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    const result = await authService.login(mockCredentials);
    expect(result.uid).toBe(mockUser.uid);
  });

  it('should register user successfully', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    const result = await authService.register({
      ...mockCredentials,
    });
    expect(result.uid).toBe(mockUser.uid);
  });
});
