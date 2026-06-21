import type {
  AttendanceRecord,
  Bus,
  Driver,
  MaintenanceRecord,
  Notification,
  Route,
  Student,
  TransportationRequest,
  TripReport,
  User,
  VehicleIssue,
} from '../types';
import { getPublicUsersFromAccounts, roleAccounts } from './authAccounts';

export const mockUsers: User[] = getPublicUsersFromAccounts(roleAccounts);

export const mockBuses: Bus[] = [
  { id: 'b1', plateNumber: 'SB-001', capacity: 45, status: 'active', driverId: 'd1', routeId: 'r1' },
  { id: 'b2', plateNumber: 'SB-002', capacity: 40, status: 'active', driverId: 'd2', routeId: 'r2' },
  { id: 'b3', plateNumber: 'SB-003', capacity: 50, status: 'maintenance' },
  { id: 'b4', plateNumber: 'SB-004', capacity: 45, status: 'active', driverId: 'd3', routeId: 'r3' },
];

export const mockDrivers: Driver[] = [
  { id: 'd1', userId: '3', name: 'John Driver', licenseNumber: 'DL-12345', phone: '555-0101', status: 'on-route', busId: 'b1' },
  { id: 'd2', name: 'Mike Wilson', licenseNumber: 'DL-12346', phone: '555-0102', status: 'on-route', busId: 'b2' },
  { id: 'd3', name: 'Lisa Brown', licenseNumber: 'DL-12347', phone: '555-0103', status: 'available', busId: 'b4' },
  { id: 'd4', name: 'Tom Garcia', licenseNumber: 'DL-12348', phone: '555-0104', status: 'off-duty' },
];

export const mockRoutes: Route[] = [
  { id: 'r1', name: 'North Route', startPoint: 'Main Campus', endPoint: 'North District', stops: ['Oak St', 'Pine Ave', 'Maple Rd'], schedule: '7:00 AM - 8:30 AM', busId: 'b1', driverId: 'd1' },
  { id: 'r2', name: 'South Route', startPoint: 'Main Campus', endPoint: 'South District', stops: ['Elm St', 'Cedar Ln', 'Birch Way'], schedule: '7:15 AM - 8:45 AM', busId: 'b2', driverId: 'd2' },
  { id: 'r3', name: 'East Route', startPoint: 'Main Campus', endPoint: 'East District', stops: ['Willow Dr', 'Ash Blvd', 'Poplar Ct'], schedule: '7:30 AM - 9:00 AM', busId: 'b4', driverId: 'd3' },
];

export const mockStudents: Student[] = [
  { id: 's1', name: 'Emma Parent', grade: '5th', parentId: '4', routeId: 'r1', busId: 'b1', pickupPoint: 'Oak St', dropOffPoint: 'Main Campus' },
  { id: 's2', name: 'Liam Parent', grade: '3rd', parentId: '4', routeId: 'r1', busId: 'b1', pickupPoint: 'Pine Ave', dropOffPoint: 'Main Campus' },
  { id: 's3', name: 'Sophia Lee', grade: '7th', parentId: '5', routeId: 'r2', busId: 'b2', pickupPoint: 'Elm St', dropOffPoint: 'Main Campus' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: 's1', studentName: 'Emma Parent', date: '2026-06-21', type: 'boarding', status: 'present', time: '7:15 AM' },
  { id: 'a2', studentId: 's2', studentName: 'Liam Parent', date: '2026-06-21', type: 'boarding', status: 'present', time: '7:20 AM' },
  { id: 'a3', studentId: 's1', studentName: 'Emma Parent', date: '2026-06-20', type: 'drop-off', status: 'present', time: '3:30 PM' },
];

export const mockRequests: TransportationRequest[] = [
  { id: 'req1', studentId: 's1', studentName: 'Emma Parent', requestType: 'change-route', status: 'pending', submittedAt: '2026-06-20', notes: 'Need pickup at new address on Oak St' },
  { id: 'req2', studentId: 's3', studentName: 'Sophia Lee', requestType: 'new-route', status: 'approved', submittedAt: '2026-06-18', notes: 'New student enrollment' },
];

export const mockTripReports: TripReport[] = [
  { id: 'tr1', driverId: 'd1', routeId: 'r1', date: '2026-06-21', status: 'completed', notes: 'Smooth trip, all students boarded', passengersCount: 38 },
  { id: 'tr2', driverId: 'd1', routeId: 'r1', date: '2026-06-20', status: 'delayed', notes: 'Traffic delay on Maple Rd', passengersCount: 35 },
];

export const mockVehicleIssues: VehicleIssue[] = [
  { id: 'vi1', busId: 'b3', driverId: 'd4', description: 'Brake warning light on dashboard', severity: 'high', status: 'in-progress', reportedAt: '2026-06-19' },
  { id: 'vi2', busId: 'b1', driverId: 'd1', description: 'Minor scratch on left side mirror', severity: 'low', status: 'open', reportedAt: '2026-06-21' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Bus Arriving', message: 'Bus SB-001 is 5 minutes away from Oak St', type: 'info', read: false, createdAt: '2026-06-21 7:10 AM' },
  { id: 'n2', title: 'Route Update', message: 'North Route schedule changed to 7:05 AM', type: 'warning', read: false, createdAt: '2026-06-20 6:00 PM' },
  { id: 'n3', title: 'Emergency Alert', message: 'Weather delay - all buses running 15 min late', type: 'emergency', read: true, createdAt: '2026-06-19 6:30 AM' },
];

export const mockMaintenance: MaintenanceRecord[] = [
  { id: 'm1', busId: 'b3', type: 'Brake Inspection', scheduledDate: '2026-06-22', status: 'scheduled', notes: 'Annual brake system check' },
  { id: 'm2', busId: 'b1', type: 'Oil Change', scheduledDate: '2026-06-15', status: 'completed', notes: 'Regular maintenance' },
];

export const dashboardStats = {
  superAdmin: { totalUsers: 156, totalBuses: 12, activeRoutes: 8, todayTrips: 24 },
  transportationManager: { activeBuses: 10, onRouteDrivers: 8, pendingRequests: 5, capacityUsed: 78 },
  busDriver: { assignedRoute: 'North Route', passengersToday: 38, tripStatus: 'In Progress', notifications: 3 },
  parentGuardian: { childrenCount: 2, nextBusTime: '7:00 AM', lastBoarding: '7:15 AM', unreadNotifications: 2 },
};
