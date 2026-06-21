import type { User, UserRole } from '../types';

export interface AuthAccount extends User {
  password: string;
  description: string;
}

export const DEFAULT_DEMO_PASSWORD = 'demo123';

/** Pre-seeded accounts for all 4 system roles */
export const roleAccounts: AuthAccount[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.edu',
    role: 'super-admin',
    password: DEFAULT_DEMO_PASSWORD,
    description: 'Full system access · manage users, buses, routes & reports',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@school.edu',
    role: 'transportation-manager',
    password: DEFAULT_DEMO_PASSWORD,
    description: 'Manage routes, assignments, schedules & operations',
  },
  {
    id: '3',
    name: 'John Driver',
    email: 'driver@school.edu',
    role: 'bus-driver',
    password: DEFAULT_DEMO_PASSWORD,
    description: 'View routes, passengers, attendance & trip reports',
  },
  {
    id: '4',
    name: 'Mary Parent',
    email: 'parent@school.edu',
    role: 'parent-guardian',
    password: DEFAULT_DEMO_PASSWORD,
    description: 'Track children transport, schedules & boarding records',
  },
];

export const roleIcons: Record<UserRole, string> = {
  'super-admin': '👑',
  'transportation-manager': '📋',
  'bus-driver': '🚌',
  'parent-guardian': '👨‍👩‍👧',
};

export function toPublicUser(account: AuthAccount): User {
  const { password: _, description: __, ...user } = account;
  return user;
}

export function getAccountByRole(role: UserRole): AuthAccount | undefined {
  return roleAccounts.find((a) => a.role === role);
}

export function getAccountByEmail(email: string): AuthAccount | undefined {
  return roleAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function getPublicUsersFromAccounts(accounts: AuthAccount[]): User[] {
  return accounts.map(toPublicUser);
}
