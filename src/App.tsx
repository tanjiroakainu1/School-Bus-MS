import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, getRoleDashboardPath } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import RoleLayout from './components/layout/RoleLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import type { UserRole } from './types';

import SuperAdminDashboard from './roles/super-admin/SuperAdminDashboard';
import UserManagement from './roles/super-admin/UserManagement';
import TransportationSettings from './roles/super-admin/TransportationSettings';
import BusRouteManagement from './roles/super-admin/BusRouteManagement';
import TransportationRecords from './roles/super-admin/TransportationRecords';
import SystemReports from './roles/super-admin/SystemReports';
import BackupRestore from './roles/super-admin/BackupRestore';

import TransportationManagerDashboard from './roles/transportation-manager/TransportationManagerDashboard';
import BusRoutes from './roles/transportation-manager/BusRoutes';
import BusDriverAssignment from './roles/transportation-manager/BusDriverAssignment';
import TransportationSchedules from './roles/transportation-manager/TransportationSchedules';
import BusOperations from './roles/transportation-manager/BusOperations';
import BusCapacity from './roles/transportation-manager/BusCapacity';
import TransportationReports from './roles/transportation-manager/TransportationReports';
import TransportationRequests from './roles/transportation-manager/TransportationRequests';

import BusDriverDashboard from './roles/bus-driver/BusDriverDashboard';
import AssignedRoutes from './roles/bus-driver/AssignedRoutes';
import PassengerList from './roles/bus-driver/PassengerList';
import StudentAttendance from './roles/bus-driver/StudentAttendance';
import TripStatus from './roles/bus-driver/TripStatus';
import VehicleIssues from './roles/bus-driver/VehicleIssues';
import RouteNotifications from './roles/bus-driver/RouteNotifications';
import TripReports from './roles/bus-driver/TripReports';

import ParentGuardianDashboard from './roles/parent-guardian/ParentGuardianDashboard';
import StudentTransportationDetails from './roles/parent-guardian/StudentTransportationDetails';
import BusSchedules from './roles/parent-guardian/BusSchedules';
import BoardingRecords from './roles/parent-guardian/BoardingRecords';
import BusArrivalNotifications from './roles/parent-guardian/BusArrivalNotifications';
import ParentTransportationRequests from './roles/parent-guardian/ParentTransportationRequests';
import StudentInformation from './roles/parent-guardian/StudentInformation';
import TransportationHistory from './roles/parent-guardian/TransportationHistory';

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  return <>{children}</>;
}

function RoleProtectedRoute({ allowedRole, children }: { allowedRole: UserRole; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== allowedRole) {
    return <Navigate to={getRoleDashboardPath(user!.role)} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes for non-authenticated users */}
      <Route
        element={
          <GuestOnly>
            <PublicLayout />
          </GuestOnly>
        }
      >
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Login />} />
      </Route>

      {/* Authenticated role routes */}
      <Route
        path="/super-admin"
        element={
          <RoleProtectedRoute allowedRole="super-admin">
            <RoleLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<TransportationSettings />} />
        <Route path="buses-routes" element={<BusRouteManagement />} />
        <Route path="records" element={<TransportationRecords />} />
        <Route path="reports" element={<SystemReports />} />
        <Route path="backup" element={<BackupRestore />} />
      </Route>

      <Route
        path="/transportation-manager"
        element={
          <RoleProtectedRoute allowedRole="transportation-manager">
            <RoleLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<TransportationManagerDashboard />} />
        <Route path="routes" element={<BusRoutes />} />
        <Route path="assignments" element={<BusDriverAssignment />} />
        <Route path="schedules" element={<TransportationSchedules />} />
        <Route path="operations" element={<BusOperations />} />
        <Route path="capacity" element={<BusCapacity />} />
        <Route path="reports" element={<TransportationReports />} />
        <Route path="requests" element={<TransportationRequests />} />
      </Route>

      <Route
        path="/bus-driver"
        element={
          <RoleProtectedRoute allowedRole="bus-driver">
            <RoleLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<BusDriverDashboard />} />
        <Route path="routes" element={<AssignedRoutes />} />
        <Route path="passengers" element={<PassengerList />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="trip-status" element={<TripStatus />} />
        <Route path="issues" element={<VehicleIssues />} />
        <Route path="notifications" element={<RouteNotifications />} />
        <Route path="trip-reports" element={<TripReports />} />
      </Route>

      <Route
        path="/parent-guardian"
        element={
          <RoleProtectedRoute allowedRole="parent-guardian">
            <RoleLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<ParentGuardianDashboard />} />
        <Route path="transport-details" element={<StudentTransportationDetails />} />
        <Route path="schedules" element={<BusSchedules />} />
        <Route path="boarding" element={<BoardingRecords />} />
        <Route path="notifications" element={<BusArrivalNotifications />} />
        <Route path="requests" element={<ParentTransportationRequests />} />
        <Route path="student-info" element={<StudentInformation />} />
        <Route path="history" element={<TransportationHistory />} />
      </Route>

      {/* Logged-in users hitting public URLs go to dashboard */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={getRoleDashboardPath(user.role)} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
