import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type {
  AttendanceRecord,
  BackupLog,
  Bus,
  Driver,
  Notification,
  Route,
  ScheduleEntry,
  Student,
  TransportationRequest,
  TransportationSettings,
  TripReport,
  TripStatusRecord,
  TripStatusType,
  VehicleIssue,
} from '../types';
import {
  mockAttendance,
  mockBuses,
  mockDrivers,
  mockMaintenance,
  mockNotifications,
  mockRequests,
  mockRoutes,
  mockStudents,
  mockTripReports,
  mockVehicleIssues,
} from '../data/mockData';
import { getAppDataStorageKey, getAppDataVersion, readJson, writeJson } from '../utils/storage';

const BACKUP_STORAGE_KEY = 'sbms_backup_snapshot';
const DATA_STORAGE_KEY = getAppDataStorageKey();

export interface AppData {
  version: number;
  buses: Bus[];
  drivers: Driver[];
  routes: Route[];
  students: Student[];
  attendance: AttendanceRecord[];
  requests: TransportationRequest[];
  tripReports: TripReport[];
  vehicleIssues: VehicleIssue[];
  notifications: Notification[];
  maintenance: typeof mockMaintenance;
  schedules: ScheduleEntry[];
  settings: TransportationSettings;
  backupLogs: BackupLog[];
  tripStatus: TripStatusRecord;
}

const defaultSettings: TransportationSettings = {
  schoolName: 'Green Valley School',
  maxBusCapacity: 50,
  notificationEnabled: true,
  emergencyContact: '555-0199',
  operatingHoursStart: '06:00',
  operatingHoursEnd: '18:00',
  autoBackup: true,
};

const defaultBackupLogs: BackupLog[] = [
  { id: '1', date: '2026-06-21 02:00 AM', type: 'backup', status: 'success', size: '245 MB' },
  { id: '2', date: '2026-06-20 02:00 AM', type: 'backup', status: 'success', size: '243 MB' },
  { id: '3', date: '2026-06-15 10:30 AM', type: 'restore', status: 'success', size: '240 MB' },
];

function buildDefaultSchedules(routes: Route[]): ScheduleEntry[] {
  return routes.map((route) => ({
    routeId: route.id,
    routeName: route.name,
    morningPickup: '7:00 AM',
    morningDropoff: '8:30 AM',
    afternoonPickup: '3:00 PM',
    afternoonDropoff: '4:30 PM',
  }));
}

export function getDefaultAppData(): AppData {
  return {
    version: getAppDataVersion(),
    buses: [...mockBuses],
    drivers: [...mockDrivers],
    routes: [...mockRoutes],
    students: [...mockStudents],
    attendance: [...mockAttendance],
    requests: [...mockRequests],
    tripReports: [...mockTripReports],
    vehicleIssues: [...mockVehicleIssues],
    notifications: [...mockNotifications],
    maintenance: [...mockMaintenance],
    schedules: buildDefaultSchedules(mockRoutes),
    settings: { ...defaultSettings },
    backupLogs: [...defaultBackupLogs],
    tripStatus: {
      driverId: 'd1',
      routeId: 'r1',
      routeName: 'North Route — Morning Trip',
      status: 'in-progress',
      delayReason: '',
    },
  };
}

function mergeSchedules(saved: ScheduleEntry[], routes: Route[]): ScheduleEntry[] {
  const savedMap = new Map(saved.map((s) => [s.routeId, s]));
  return routes.map((route) => {
    const existing = savedMap.get(route.id);
    if (existing) {
      return { ...existing, routeName: route.name };
    }
    return {
      routeId: route.id,
      routeName: route.name,
      morningPickup: '7:00 AM',
      morningDropoff: '8:30 AM',
      afternoonPickup: '3:00 PM',
      afternoonDropoff: '4:30 PM',
    };
  });
}

function normalizeAppData(parsed: Partial<AppData>, defaults: AppData): AppData {
  const routes = Array.isArray(parsed.routes) ? parsed.routes : defaults.routes;
  return {
    version: getAppDataVersion(),
    buses: Array.isArray(parsed.buses) ? parsed.buses : defaults.buses,
    drivers: Array.isArray(parsed.drivers) ? parsed.drivers : defaults.drivers,
    routes,
    students: Array.isArray(parsed.students) ? parsed.students : defaults.students,
    attendance: Array.isArray(parsed.attendance) ? parsed.attendance : defaults.attendance,
    requests: Array.isArray(parsed.requests) ? parsed.requests : defaults.requests,
    tripReports: Array.isArray(parsed.tripReports) ? parsed.tripReports : defaults.tripReports,
    vehicleIssues: Array.isArray(parsed.vehicleIssues) ? parsed.vehicleIssues : defaults.vehicleIssues,
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : defaults.notifications,
    maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : defaults.maintenance,
    schedules: mergeSchedules(
      Array.isArray(parsed.schedules) ? parsed.schedules : defaults.schedules,
      routes
    ),
    settings: { ...defaults.settings, ...(parsed.settings ?? {}) },
    backupLogs: Array.isArray(parsed.backupLogs) ? parsed.backupLogs : defaults.backupLogs,
    tripStatus: { ...defaults.tripStatus, ...(parsed.tripStatus ?? {}) },
  };
}

function loadAppData(): AppData {
  const defaults = getDefaultAppData();
  const parsed = readJson<Partial<AppData>>(DATA_STORAGE_KEY);

  if (!parsed) {
    writeJson(DATA_STORAGE_KEY, defaults);
    return defaults;
  }

  const normalized = normalizeAppData(parsed, defaults);
  writeJson(DATA_STORAGE_KEY, normalized);
  return normalized;
}

function formatBackupSize(data: AppData): string {
  const bytes = new Blob([JSON.stringify(data)]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DataContextType extends AppData {
  addBus: (bus: Omit<Bus, 'id'>) => Bus;
  toggleBusStatus: (id: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => Route;
  deleteRoute: (id: string) => void;
  updateRouteAssignments: (assignments: { routeId: string; busId: string; driverId: string }[]) => void;
  updateSchedules: (schedules: ScheduleEntry[]) => void;
  updateScheduleEntry: (routeId: string, field: keyof ScheduleEntry, value: string) => void;
  updateStudent: (id: string, updates: Partial<Pick<Student, 'name' | 'grade' | 'pickupPoint' | 'dropOffPoint'>>) => void;
  addStudent: (student: Omit<Student, 'id'>) => Student;
  deleteStudent: (id: string) => void;
  upsertAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  addAttendanceRecords: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  addRequest: (request: Omit<TransportationRequest, 'id'>) => TransportationRequest;
  updateRequestStatus: (id: string, status: TransportationRequest['status']) => void;
  addTripReport: (report: Omit<TripReport, 'id'>) => TripReport;
  addVehicleIssue: (issue: Omit<VehicleIssue, 'id'>) => VehicleIssue;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (settings: TransportationSettings) => void;
  patchSettings: (patch: Partial<TransportationSettings>) => void;
  updateTripStatus: (updates: Partial<TripStatusRecord>) => void;
  createBackup: () => BackupLog;
  restoreFromBackup: () => BackupLog | null;
  resetAllData: () => void;
  getDriverByUserId: (userId: string) => Driver | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    writeJson(DATA_STORAGE_KEY, data);
  }, [data]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== DATA_STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as Partial<AppData>;
        setData(normalizeAppData(parsed, getDefaultAppData()));
      } catch {
        // ignore invalid cross-tab payloads
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev));
  }, []);

  const addBus = useCallback((bus: Omit<Bus, 'id'>) => {
    const newBus: Bus = { ...bus, id: Date.now().toString() };
    updateData((prev) => ({ ...prev, buses: [...prev.buses, newBus] }));
    return newBus;
  }, [updateData]);

  const toggleBusStatus = useCallback((id: string) => {
    updateData((prev) => ({
      ...prev,
      buses: prev.buses.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' as Bus['status'] }
          : b
      ),
    }));
  }, [updateData]);

  const addRoute = useCallback((route: Omit<Route, 'id'>) => {
    const newRoute: Route = { ...route, id: Date.now().toString() };
    updateData((prev) => {
      const routes = [...prev.routes, newRoute];
      return {
        ...prev,
        routes,
        schedules: mergeSchedules(prev.schedules, routes),
      };
    });
    return newRoute;
  }, [updateData]);

  const deleteRoute = useCallback((id: string) => {
    updateData((prev) => {
      const routes = prev.routes.filter((r) => r.id !== id);
      return {
        ...prev,
        routes,
        schedules: prev.schedules.filter((s) => s.routeId !== id),
      };
    });
  }, [updateData]);

  const updateRouteAssignments = useCallback(
    (assignments: { routeId: string; busId: string; driverId: string }[]) => {
      updateData((prev) => ({
        ...prev,
        routes: prev.routes.map((route) => {
          const assignment = assignments.find((a) => a.routeId === route.id);
          if (!assignment) return route;
          return {
            ...route,
            busId: assignment.busId || undefined,
            driverId: assignment.driverId || undefined,
          };
        }),
        buses: prev.buses.map((bus) => {
          const assignedRoute = assignments.find((a) => a.busId === bus.id);
          return assignedRoute
            ? { ...bus, routeId: assignedRoute.routeId, driverId: assignedRoute.driverId || bus.driverId }
            : bus;
        }),
        drivers: prev.drivers.map((driver) => {
          const assignedRoute = assignments.find((a) => a.driverId === driver.id);
          return assignedRoute
            ? { ...driver, busId: assignedRoute.busId || driver.busId, status: assignedRoute.busId ? 'on-route' as const : driver.status }
            : driver;
        }),
      }));
    },
    [updateData]
  );

  const updateSchedules = useCallback((schedules: ScheduleEntry[]) => {
    updateData((prev) => ({ ...prev, schedules }));
  }, [updateData]);

  const updateScheduleEntry = useCallback(
    (routeId: string, field: keyof ScheduleEntry, value: string) => {
      updateData((prev) => ({
        ...prev,
        schedules: prev.schedules.map((s) =>
          s.routeId === routeId ? { ...s, [field]: value } : s
        ),
      }));
    },
    [updateData]
  );

  const updateStudent = useCallback(
    (id: string, updates: Partial<Pick<Student, 'name' | 'grade' | 'pickupPoint' | 'dropOffPoint'>>) => {
      updateData((prev) => ({
        ...prev,
        students: prev.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        attendance: prev.attendance.map((a) =>
          a.studentId === id && updates.name ? { ...a, studentName: updates.name } : a
        ),
        requests: prev.requests.map((r) =>
          r.studentId === id && updates.name ? { ...r, studentName: updates.name } : r
        ),
      }));
    },
    [updateData]
  );

  const addStudent = useCallback((student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: Date.now().toString() };
    updateData((prev) => ({ ...prev, students: [...prev.students, newStudent] }));
    return newStudent;
  }, [updateData]);

  const deleteStudent = useCallback((id: string) => {
    updateData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
      attendance: prev.attendance.filter((a) => a.studentId !== id),
      requests: prev.requests.filter((r) => r.studentId !== id),
    }));
  }, [updateData]);

  const upsertAttendanceRecord = useCallback((record: Omit<AttendanceRecord, 'id'>) => {
    updateData((prev) => {
      const existingIndex = prev.attendance.findIndex(
        (a) =>
          a.studentId === record.studentId &&
          a.date === record.date &&
          a.type === record.type
      );

      if (existingIndex >= 0) {
        const attendance = [...prev.attendance];
        attendance[existingIndex] = {
          ...attendance[existingIndex],
          ...record,
        };
        return { ...prev, attendance };
      }

      return {
        ...prev,
        attendance: [{ ...record, id: Date.now().toString() }, ...prev.attendance],
      };
    });
  }, [updateData]);

  const addAttendanceRecords = useCallback((records: Omit<AttendanceRecord, 'id'>[]) => {
    records.forEach((record) => upsertAttendanceRecord(record));
  }, [upsertAttendanceRecord]);

  const addRequest = useCallback((request: Omit<TransportationRequest, 'id'>) => {
    const newRequest: TransportationRequest = { ...request, id: Date.now().toString() };
    updateData((prev) => ({ ...prev, requests: [newRequest, ...prev.requests] }));
    return newRequest;
  }, [updateData]);

  const updateRequestStatus = useCallback((id: string, status: TransportationRequest['status']) => {
    updateData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, [updateData]);

  const addTripReport = useCallback((report: Omit<TripReport, 'id'>) => {
    const newReport: TripReport = { ...report, id: Date.now().toString() };
    updateData((prev) => ({ ...prev, tripReports: [newReport, ...prev.tripReports] }));
    return newReport;
  }, [updateData]);

  const addVehicleIssue = useCallback((issue: Omit<VehicleIssue, 'id'>) => {
    const newIssue: VehicleIssue = { ...issue, id: Date.now().toString() };
    updateData((prev) => ({ ...prev, vehicleIssues: [newIssue, ...prev.vehicleIssues] }));
    return newIssue;
  }, [updateData]);

  const markNotificationRead = useCallback((id: string) => {
    updateData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, [updateData]);

  const markAllNotificationsRead = useCallback(() => {
    updateData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [updateData]);

  const updateSettings = useCallback((settings: TransportationSettings) => {
    updateData((prev) => ({ ...prev, settings }));
  }, [updateData]);

  const patchSettings = useCallback((patch: Partial<TransportationSettings>) => {
    updateData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, [updateData]);

  const updateTripStatus = useCallback((updates: Partial<TripStatusRecord>) => {
    updateData((prev) => ({
      ...prev,
      tripStatus: { ...prev.tripStatus, ...updates },
    }));
  }, [updateData]);

  const createBackup = useCallback((): BackupLog => {
    setData((prev) => {
      writeJson(BACKUP_STORAGE_KEY, prev);
      const log: BackupLog = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        type: 'backup',
        status: 'success',
        size: formatBackupSize(prev),
      };
      return { ...prev, backupLogs: [log, ...prev.backupLogs] };
    });
    return {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'backup',
      status: 'success',
      size: '—',
    };
  }, []);

  const restoreFromBackup = useCallback((): BackupLog | null => {
    const restored = readJson<AppData>(BACKUP_STORAGE_KEY);
    if (!restored) return null;

    const normalized = normalizeAppData(restored, getDefaultAppData());
    const log: BackupLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'restore',
      status: 'success',
      size: formatBackupSize(normalized),
    };
    const next = { ...normalized, backupLogs: [log, ...normalized.backupLogs] };
    setData(next);
    writeJson(DATA_STORAGE_KEY, next);
    return log;
  }, []);

  const resetAllData = useCallback(() => {
    const defaults = getDefaultAppData();
    setData(defaults);
    writeJson(DATA_STORAGE_KEY, defaults);
  }, []);

  const getDriverByUserId = useCallback(
    (userId: string) => data.drivers.find((d) => d.userId === userId),
    [data.drivers]
  );

  return (
    <DataContext.Provider
      value={{
        ...data,
        addBus,
        toggleBusStatus,
        addRoute,
        deleteRoute,
        updateRouteAssignments,
        updateSchedules,
        updateScheduleEntry,
        updateStudent,
        addStudent,
        deleteStudent,
        upsertAttendanceRecord,
        addAttendanceRecords,
        addRequest,
        updateRequestStatus,
        addTripReport,
        addVehicleIssue,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        patchSettings,
        updateTripStatus,
        createBackup,
        restoreFromBackup,
        resetAllData,
        getDriverByUserId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}

export type { TripStatusType };
