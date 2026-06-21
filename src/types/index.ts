export type UserRole =
  | 'super-admin'
  | 'transportation-manager'
  | 'bus-driver'
  | 'parent-guardian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  driverId?: string;
  routeId?: string;
}

export interface Driver {
  id: string;
  userId?: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'available' | 'on-route' | 'off-duty';
  busId?: string;
}

export interface ScheduleEntry {
  routeId: string;
  routeName: string;
  morningPickup: string;
  morningDropoff: string;
  afternoonPickup: string;
  afternoonDropoff: string;
}

export interface TransportationSettings {
  schoolName: string;
  maxBusCapacity: number;
  notificationEnabled: boolean;
  emergencyContact: string;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  autoBackup: boolean;
}

export interface BackupLog {
  id: string;
  date: string;
  type: 'backup' | 'restore';
  status: 'success' | 'failed';
  size: string;
}

export type TripStatusType = 'not-started' | 'in-progress' | 'completed' | 'delayed';

export interface TripStatusRecord {
  driverId: string;
  routeId: string;
  routeName: string;
  status: TripStatusType;
  delayReason: string;
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  schedule: string;
  busId?: string;
  driverId?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  routeId?: string;
  busId?: string;
  pickupPoint: string;
  dropOffPoint: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: 'boarding' | 'drop-off';
  status: 'present' | 'absent';
  time: string;
}

export interface TransportationRequest {
  id: string;
  studentId: string;
  studentName: string;
  requestType: 'new-route' | 'change-route' | 'temporary-change';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes: string;
}

export interface TripReport {
  id: string;
  driverId: string;
  routeId: string;
  date: string;
  status: 'completed' | 'delayed' | 'cancelled';
  notes: string;
  passengersCount: number;
}

export interface VehicleIssue {
  id: string;
  busId: string;
  driverId: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  reportedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  read: boolean;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  busId: string;
  type: string;
  scheduledDate: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes: string;
}

export type NavIconName =
  | 'dashboard'
  | 'users'
  | 'settings'
  | 'bus'
  | 'records'
  | 'reports'
  | 'backup'
  | 'routes'
  | 'assignments'
  | 'schedules'
  | 'operations'
  | 'capacity'
  | 'requests'
  | 'passengers'
  | 'attendance'
  | 'trip-status'
  | 'issues'
  | 'notifications'
  | 'trip-reports'
  | 'transport'
  | 'boarding'
  | 'student'
  | 'history'
  | 'logout'
  | 'chevron-left'
  | 'chevron-right'
  | 'close';

export interface NavItem {
  label: string;
  path: string;
  icon: NavIconName;
}

export interface RoleConfig {
  role: UserRole;
  title: string;
  basePath: string;
  color: string;
  gradient: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  navActive: string;
  navItems: NavItem[];
}
