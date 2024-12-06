// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/firebase/auth.service';
import { AuthUser } from '../types/firebase.types';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
