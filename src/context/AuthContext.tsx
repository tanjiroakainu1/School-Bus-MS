import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import {
  roleAccounts,
  toPublicUser,
  DEFAULT_DEMO_PASSWORD,
  type AuthAccount,
} from '../data/authAccounts';
import { getRoleDashboardPath } from '../config/roles';
import { readJson, writeJson } from '../utils/storage';

const USERS_STORAGE_KEY = 'sbms_registered_users';
const SESSION_STORAGE_KEY = 'sbms_user';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  registeredUsers: User[];
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string, confirmPassword: string, role: UserRole) => AuthResult;
  quickLoginAsRole: (role: UserRole) => AuthResult;
  quickLoginAsAccount: (account: AuthAccount) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getAccountForRole: (role: UserRole) => AuthAccount | undefined;
  getAllAccounts: () => AuthAccount[];
  addAccountByAdmin: (name: string, email: string, role: UserRole) => AuthResult;
  updateAccountRole: (id: string, role: UserRole) => void;
  deleteAccount: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadRegisteredAccounts(): AuthAccount[] {
  const saved = readJson<AuthAccount[]>(USERS_STORAGE_KEY);
  if (saved && saved.length > 0) return saved;
  writeJson(USERS_STORAGE_KEY, roleAccounts);
  return [...roleAccounts];
}

function loadSessionUser(): User | null {
  return readJson<User>(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => loadRegisteredAccounts());
  const [user, setUser] = useState<User | null>(() => loadSessionUser());
  const accountsHydratedRef = useRef(false);

  useEffect(() => {
    if (!accountsHydratedRef.current) {
      accountsHydratedRef.current = true;
      return;
    }
    writeJson(USERS_STORAGE_KEY, accounts);
  }, [accounts]);

  const registeredUsers = accounts.map(toPublicUser);

  const setSession = useCallback((sessionUser: User | null) => {
    setUser(sessionUser);
    if (sessionUser) {
      writeJson(SESSION_STORAGE_KEY, sessionUser);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const findAccount = useCallback(
    (email: string) => accounts.find((a) => a.email.toLowerCase() === email.toLowerCase()),
    [accounts]
  );

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      if (!email.trim() || !password) {
        return { success: false, error: 'Email and password are required.' };
      }

      const account = findAccount(email);
      if (!account) {
        return { success: false, error: 'No account found with this email.' };
      }
      if (account.password !== password) {
        return { success: false, error: 'Incorrect password. Try demo123 for seeded accounts.' };
      }

      setSession(toPublicUser(account));
      return { success: true, user: toPublicUser(account) };
    },
    [findAccount, setSession]
  );

  const register = useCallback(
    (name: string, email: string, password: string, confirmPassword: string, role: UserRole): AuthResult => {
      if (!name.trim() || !email.trim() || !password) {
        return { success: false, error: 'All fields are required.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' };
      }
      if (findAccount(email)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newAccount: AuthAccount = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        description: `Registered ${role.replace(/-/g, ' ')} account`,
      };

      const updated = [...accounts, newAccount];
      setAccounts(updated);
      setSession(toPublicUser(newAccount));
      return { success: true, user: toPublicUser(newAccount) };
    },
    [accounts, findAccount, setSession]
  );

  const quickLoginAsAccount = useCallback(
    (account: AuthAccount) => {
      setSession(toPublicUser(account));
    },
    [setSession]
  );

  const quickLoginAsRole = useCallback(
    (role: UserRole): AuthResult => {
      const account = accounts.find((a) => a.role === role);
      if (!account) {
        return { success: false, error: 'No account configured for this role.' };
      }
      quickLoginAsAccount(account);
      return { success: true, user: toPublicUser(account) };
    },
    [accounts, quickLoginAsAccount]
  );

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const getAccountForRole = useCallback(
    (role: UserRole) => accounts.find((a) => a.role === role),
    [accounts]
  );

  const getAllAccounts = useCallback(() => accounts, [accounts]);

  const addAccountByAdmin = useCallback(
    (name: string, email: string, role: UserRole): AuthResult => {
      if (!name.trim() || !email.trim()) {
        return { success: false, error: 'Name and email are required.' };
      }
      if (findAccount(email)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newAccount: AuthAccount = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: DEFAULT_DEMO_PASSWORD,
        role,
        description: `Managed ${role.replace(/-/g, ' ')} account`,
      };

      const updated = [...accounts, newAccount];
      setAccounts(updated);
      return { success: true, user: toPublicUser(newAccount) };
    },
    [accounts, findAccount]
  );

  const updateAccountRole = useCallback(
    (id: string, role: UserRole) => {
      const updated = accounts.map((a) => (a.id === id ? { ...a, role } : a));
      setAccounts(updated);
      if (user?.id === id) {
        const account = updated.find((a) => a.id === id);
        if (account) setSession(toPublicUser(account));
      }
    },
    [accounts, user, setSession]
  );

  const deleteAccount = useCallback(
    (id: string) => {
      const updated = accounts.filter((a) => a.id !== id);
      setAccounts(updated);
      if (user?.id === id) setSession(null);
    },
    [accounts, user, setSession]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUsers,
        login,
        register,
        quickLoginAsRole,
        quickLoginAsAccount,
        logout,
        isAuthenticated: !!user,
        getAccountForRole,
        getAllAccounts,
        addAccountByAdmin,
        updateAccountRole,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { getRoleDashboardPath };
