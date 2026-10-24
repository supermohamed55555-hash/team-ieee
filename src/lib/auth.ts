import { useState, useEffect } from 'react';

export interface UserSession {
  name: string;
  email: string;
  phone?: string;
  role?: 'customer' | 'admin';
  provider?: string;
  loginTime?: string;
}

export const AUTH_STORAGE_KEY = 'yuzersef_user_session';

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUserSession(user: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('yuzersef-auth-changed', { detail: user }));
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('yuzersef-auth-changed', { detail: null }));
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(getUserSession);

  useEffect(() => {
    // Sync initial state
    setUser(getUserSession());

    const handleAuthChange = (e: any) => {
      setUser(e.detail !== undefined ? e.detail : getUserSession());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        setUser(getUserSession());
      }
    };

    window.addEventListener('yuzersef-auth-changed', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('yuzersef-auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    login: setUserSession,
    logout: clearUserSession,
  };
}
