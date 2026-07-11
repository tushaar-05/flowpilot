import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthUser, AuthSession } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils/storage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<AuthUser, 'createdAt' | 'avatar'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (email: string, newPassword: string) => Promise<boolean>;
  getUsers: () => AuthUser[];
  updateAuthUser: (name: string, email: string, avatar: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUsers(): AuthUser[] {
  return getFromStorage<AuthUser[]>(STORAGE_KEYS.USERS, []);
}

function saveUsers(users: AuthUser[]) {
  setToStorage(STORAGE_KEYS.USERS, users);
}

function getSession(): AuthSession | null {
  return getFromStorage<AuthSession | null>(STORAGE_KEYS.SESSION, null);
}

function saveSession(session: AuthSession | null) {
  if (session) {
    setToStorage(STORAGE_KEYS.SESSION, session);
  } else {
    removeFromStorage(STORAGE_KEYS.SESSION);
  }
}

async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      const users = getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === session.email.toLowerCase());
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = getStoredUsers();
    
    // Hash the incoming plaintext password to compare it with the stored hash
    const hashedPassword = await hashPassword(password);
    
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    setUser(found);
    saveSession({ email: found.email, rememberMe });
    return { success: true };
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 500));
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser: AuthUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    setUser(newUser);
    saveSession({ email: newUser.email, rememberMe: true });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const updatePassword = useCallback(async (email: string, newPassword: string) => {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) return false;

    // Hash the new password before updating it
    const hashedPassword = await hashPassword(newPassword);

    users[index] = { ...users[index], password: hashedPassword };
    saveUsers(users);
    if (user?.email.toLowerCase() === email.toLowerCase()) {
      setUser(users[index]);
    }
    return true;
  }, [user]);

  const getUsers = useCallback(() => getStoredUsers(), []);

  const updateAuthUser = useCallback((name: string, email: string, avatar: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, name, email, avatar };

      const users = getStoredUsers();
      const updatedUsers = users.map((u) =>
        u.email.toLowerCase() === prev.email.toLowerCase()
          ? { ...u, name, email, avatar }
          : u
      );
      saveUsers(updatedUsers);

      // If email changed, update the session email too
      const session = getSession();
      if (session && session.email.toLowerCase() === prev.email.toLowerCase()) {
        saveSession({ ...session, email });
      }

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updatePassword,
        getUsers,
        updateAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
