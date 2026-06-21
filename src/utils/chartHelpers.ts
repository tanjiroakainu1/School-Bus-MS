import type { AttendanceRecord, Bus, Route, Student, TransportationRequest, TripReport } from '../types';
import { routeCapacityData, busFleetStatusData, weeklyTripsData, CHART_COLORS } from '../data/chartData';

export interface FleetSlice {
  name: string;
  value: number;
  color: string;
}

export interface RouteCapacityRow {
  route: string;
  capacity: number;
  passengers: number;
  utilization: number;
}

export interface TripReportRow {
  label: string;
  passengers: number;
  completed: number;
  delayed: number;
}

export interface AttendanceWeekRow {
  day: string;
  present: number;
  absent: number;
}

export function buildFleetStatusFromBuses(buses: Bus[]): FleetSlice[] {
  const slices: FleetSlice[] = [
    { name: 'Active', value: buses.filter((b) => b.status === 'active').length, color: CHART_COLORS.teal },
    { name: 'Maintenance', value: buses.filter((b) => b.status === 'maintenance').length, color: CHART_COLORS.amber },
    { name: 'Inactive', value: buses.filter((b) => b.status === 'inactive').length, color: CHART_COLORS.slate },
  ].filter((s) => s.value > 0);

  return slices.length > 0 ? slices : busFleetStatusData;
}

export function buildRouteCapacityFromData(
  routes: Route[],
  buses: Bus[],
  students: Student[]
): RouteCapacityRow[] {
  if (routes.length === 0) return routeCapacityData;

  return routes.map((route) => {
    const bus = buses.find((b) => b.id === route.busId);
    const capacity = bus?.capacity ?? 45;
    const passengers = students.filter((s) => s.routeId === route.id || s.busId === route.busId).length;
    const utilization = capacity ? Math.round((passengers / capacity) * 100) : 0;
    const routeLabel = route.name.length > 10 ? route.name.split(' ')[0] : route.name;
    return { route: routeLabel, capacity, passengers, utilization };
  });
}

export function buildRequestStatusData(requests: TransportationRequest[]): FleetSlice[] {
  const slices: FleetSlice[] = [
    { name: 'Pending', value: requests.filter((r) => r.status === 'pending').length, color: CHART_COLORS.amber },
    { name: 'Approved', value: requests.filter((r) => r.status === 'approved').length, color: CHART_COLORS.teal },
    { name: 'Rejected', value: requests.filter((r) => r.status === 'rejected').length, color: CHART_COLORS.red },
  ].filter((s) => s.value > 0);

  return slices.length > 0 ? slices : [{ name: 'No Requests', value: 1, color: CHART_COLORS.slate }];
}

export function buildDriverTripChart(reports: TripReport[], driverId: string): TripReportRow[] {
  const driverReports = reports.filter((r) => r.driverId === driverId).slice(0, 8);

  if (driverReports.length === 0) {
    return weeklyTripsData.map((d) => ({
      label: d.day,
      passengers: d.trips,
      completed: d.onTime,
      delayed: d.delayed,
    }));
  }

  return [...driverReports].reverse().map((r) => ({
    label: r.date.slice(5),
    passengers: r.passengersCount,
    completed: r.status === 'completed' ? r.passengersCount : 0,
    delayed: r.status === 'delayed' ? r.passengersCount : 0,
  }));
}

export function buildParentAttendanceWeekly(
  attendance: AttendanceRecord[],
  studentIds: string[]
): AttendanceWeekRow[] {
  const records = attendance.filter((a) => studentIds.includes(a.studentId));
  const byDate = new Map<string, { present: number; absent: number }>();

  records.forEach((r) => {
    const cur = byDate.get(r.date) ?? { present: 0, absent: 0 };
    if (r.status === 'present') cur.present++;
    else cur.absent++;
    byDate.set(r.date, cur);
  });

  const rows = Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .reverse()
    .map(([date, v]) => ({
      day: date.slice(5),
      present: v.present,
      absent: v.absent,
    }));

  if (rows.length > 0) return rows;

  return [
    { day: 'Mon', present: 2, absent: 0 },
    { day: 'Tue', present: 2, absent: 0 },
    { day: 'Wed', present: 1, absent: 1 },
    { day: 'Thu', present: 2, absent: 0 },
    { day: 'Fri', present: 2, absent: 0 },
  ];
}

export function buildParentAttendanceByChild(
  students: Student[],
  attendance: AttendanceRecord[],
  studentIds: string[]
): { name: string; present: number; absent: number; fill: string }[] {
  const colors = [CHART_COLORS.teal, CHART_COLORS.blue, CHART_COLORS.amber, CHART_COLORS.slate];

  return students
    .filter((s) => studentIds.includes(s.id))
    .map((s, i) => {
      const records = attendance.filter((a) => a.studentId === s.id);
      return {
        name: s.name.split(' ')[0],
        present: records.filter((a) => a.status === 'present').length,
        absent: records.filter((a) => a.status === 'absent').length,
        fill: colors[i % colors.length],
      };
    });
}

export function countTripStatusBreakdown(reports: TripReport[]) {
  return {
    completed: reports.filter((r) => r.status === 'completed').length,
    delayed: reports.filter((r) => r.status === 'delayed').length,
    cancelled: reports.filter((r) => r.status === 'cancelled').length,
  };
}

export function buildTripStatusData(reports: TripReport[]): FleetSlice[] {
  const breakdown = countTripStatusBreakdown(reports);
  const slices: FleetSlice[] = [
    { name: 'Completed', value: breakdown.completed, color: CHART_COLORS.teal },
    { name: 'Delayed', value: breakdown.delayed, color: CHART_COLORS.amber },
    { name: 'Cancelled', value: breakdown.cancelled, color: CHART_COLORS.red },
  ].filter((s) => s.value > 0);

  return slices.length > 0 ? slices : [{ name: 'No Trips', value: 1, color: CHART_COLORS.slate }];
}
