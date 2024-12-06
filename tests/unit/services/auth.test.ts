// src/__tests__/services/auth.test.ts
import { authService } from '../../services/firebase/auth.service';

describe('AuthService', () => {
  const mockCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('should login successfully', async () => {
    const result = await authService.login(mockCredentials);
    expect(result).toBeDefined();
  });
});
