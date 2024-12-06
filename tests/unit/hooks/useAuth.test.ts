// src/__tests__/hooks/useAuth.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/firebase/auth.service';

jest.mock('../../services/firebase/auth.service');

describe('useAuth', () => {
  it('should return user and loading state', () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    (authService.onAuthStateChange as jest.Mock).mockImplementation(cb => {
      cb(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBeFalsy();
  });
});
