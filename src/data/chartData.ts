/** Chart datasets for Super Admin analytics */

export const weeklyTripsData = [
  { day: 'Mon', trips: 22, onTime: 20, delayed: 2 },
  { day: 'Tue', trips: 24, onTime: 23, delayed: 1 },
  { day: 'Wed', trips: 26, onTime: 24, delayed: 2 },
  { day: 'Thu', trips: 23, onTime: 22, delayed: 1 },
  { day: 'Fri', trips: 28, onTime: 25, delayed: 3 },
  { day: 'Sat', trips: 8, onTime: 8, delayed: 0 },
  { day: 'Sun', trips: 4, onTime: 4, delayed: 0 },
];

export const monthlyAttendanceData = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 94, absent: 6 },
  { month: 'Mar', present: 91, absent: 9 },
  { month: 'Apr', present: 95, absent: 5 },
  { month: 'May', present: 93, absent: 7 },
  { month: 'Jun', present: 97, absent: 3 },
];

export const busFleetStatusData = [
  { name: 'Active', value: 10, color: '#0d9488' },
  { name: 'Maintenance', value: 2, color: '#f59e0b' },
  { name: 'Inactive', value: 1, color: '#64748b' },
];

export const routeCapacityData = [
  { route: 'North', capacity: 45, passengers: 38, utilization: 84 },
  { route: 'South', capacity: 40, passengers: 35, utilization: 88 },
  { route: 'East', capacity: 45, passengers: 32, utilization: 71 },
  { route: 'West', capacity: 50, passengers: 44, utilization: 88 },
  { route: 'Central', capacity: 42, passengers: 28, utilization: 67 },
  { route: 'Rural', capacity: 35, passengers: 22, utilization: 63 },
];

export const usersByRoleData = [
  { role: 'Super Admin', count: 4, fill: '#475569' },
  { role: 'Managers', count: 12, fill: '#1d4ed8' },
  { role: 'Drivers', count: 28, fill: '#f59e0b' },
  { role: 'Parents', count: 112, fill: '#0d9488' },
];

export const hourlyActivityData = [
  { hour: '6AM', buses: 2, students: 45 },
  { hour: '7AM', buses: 12, students: 420 },
  { hour: '8AM', buses: 8, students: 280 },
  { hour: '12PM', buses: 4, students: 120 },
  { hour: '3PM', buses: 10, students: 380 },
  { hour: '4PM', buses: 6, students: 210 },
  { hour: '5PM', buses: 2, students: 60 },
];

export const systemHealthData = [
  { metric: 'On-Time', score: 94 },
  { metric: 'Safety', score: 98 },
  { metric: 'Capacity', score: 78 },
  { metric: 'Uptime', score: 99 },
  { metric: 'Satisfaction', score: 91 },
];

export const CHART_COLORS = {
  blue: '#1d4ed8',
  blueLight: '#3b82f6',
  slate: '#475569',
  amber: '#f59e0b',
  teal: '#0d9488',
  tealLight: '#14b8a6',
  red: '#dc2626',
  grid: '#e2e8f0',
};
