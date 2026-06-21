import type { RoleConfig, UserRole } from '../types';
import { THEME } from './theme';

export const roleConfigs: Record<UserRole, RoleConfig> = {
  'super-admin': {
    role: 'super-admin',
    title: 'Super Admin',
    basePath: '/super-admin',
    color: THEME.superAdmin.solid,
    gradient: THEME.superAdmin.gradient,
    accent: THEME.superAdmin.accent,
    accentBg: THEME.superAdmin.accentBg,
    accentBorder: THEME.superAdmin.accentBorder,
    navActive: THEME.superAdmin.navActive,
    navItems: [
      { label: 'Dashboard', path: '/super-admin', icon: 'dashboard' },
      { label: 'Users & Roles', path: '/super-admin/users', icon: 'users' },
      { label: 'Settings', path: '/super-admin/settings', icon: 'settings' },
      { label: 'Buses & Routes', path: '/super-admin/buses-routes', icon: 'bus' },
      { label: 'Records', path: '/super-admin/records', icon: 'records' },
      { label: 'Reports', path: '/super-admin/reports', icon: 'reports' },
      { label: 'Backup', path: '/super-admin/backup', icon: 'backup' },
    ],
  },
  'transportation-manager': {
    role: 'transportation-manager',
    title: 'Transportation Manager',
    basePath: '/transportation-manager',
    color: THEME.manager.solid,
    gradient: THEME.manager.gradient,
    accent: THEME.manager.accent,
    accentBg: THEME.manager.accentBg,
    accentBorder: THEME.manager.accentBorder,
    navActive: THEME.manager.navActive,
    navItems: [
      { label: 'Dashboard', path: '/transportation-manager', icon: 'dashboard' },
      { label: 'Routes', path: '/transportation-manager/routes', icon: 'routes' },
      { label: 'Assignments', path: '/transportation-manager/assignments', icon: 'assignments' },
      { label: 'Schedules', path: '/transportation-manager/schedules', icon: 'schedules' },
      { label: 'Operations', path: '/transportation-manager/operations', icon: 'operations' },
      { label: 'Capacity', path: '/transportation-manager/capacity', icon: 'capacity' },
      { label: 'Reports', path: '/transportation-manager/reports', icon: 'reports' },
      { label: 'Requests', path: '/transportation-manager/requests', icon: 'requests' },
    ],
  },
  'bus-driver': {
    role: 'bus-driver',
    title: 'Bus Driver',
    basePath: '/bus-driver',
    color: THEME.driver.solid,
    gradient: THEME.driver.gradient,
    accent: THEME.driver.accent,
    accentBg: THEME.driver.accentBg,
    accentBorder: THEME.driver.accentBorder,
    navActive: THEME.driver.navActive,
    navItems: [
      { label: 'Dashboard', path: '/bus-driver', icon: 'dashboard' },
      { label: 'My Routes', path: '/bus-driver/routes', icon: 'routes' },
      { label: 'Passengers', path: '/bus-driver/passengers', icon: 'passengers' },
      { label: 'Attendance', path: '/bus-driver/attendance', icon: 'attendance' },
      { label: 'Trip Status', path: '/bus-driver/trip-status', icon: 'trip-status' },
      { label: 'Issues', path: '/bus-driver/issues', icon: 'issues' },
      { label: 'Notifications', path: '/bus-driver/notifications', icon: 'notifications' },
      { label: 'Trip Reports', path: '/bus-driver/trip-reports', icon: 'trip-reports' },
    ],
  },
  'parent-guardian': {
    role: 'parent-guardian',
    title: 'Parent / Guardian',
    basePath: '/parent-guardian',
    color: THEME.parent.solid,
    gradient: THEME.parent.gradient,
    accent: THEME.parent.accent,
    accentBg: THEME.parent.accentBg,
    accentBorder: THEME.parent.accentBorder,
    navActive: THEME.parent.navActive,
    navItems: [
      { label: 'Dashboard', path: '/parent-guardian', icon: 'dashboard' },
      { label: 'Transport Details', path: '/parent-guardian/transport-details', icon: 'transport' },
      { label: 'Schedules', path: '/parent-guardian/schedules', icon: 'schedules' },
      { label: 'Boarding', path: '/parent-guardian/boarding', icon: 'boarding' },
      { label: 'Notifications', path: '/parent-guardian/notifications', icon: 'notifications' },
      { label: 'Requests', path: '/parent-guardian/requests', icon: 'requests' },
      { label: 'Student Info', path: '/parent-guardian/student-info', icon: 'student' },
      { label: 'History', path: '/parent-guardian/history', icon: 'history' },
    ],
  },
};

export function getRoleDashboardPath(role: UserRole): string {
  return roleConfigs[role].basePath;
}

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role];
}
