import StatCard from '../../components/shared/StatCard';
import Card from '../../components/shared/Card';
import DashboardHero from '../../components/shared/DashboardHero';
import QuickActionGrid from '../../components/shared/QuickActionGrid';
import WeeklyTripsChart from '../../components/charts/WeeklyTripsChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
import RouteCapacityChart from '../../components/charts/RouteCapacityChart';
import UsersByRoleChart from '../../components/charts/UsersByRoleChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import HourlyActivityChart from '../../components/charts/HourlyActivityChart';
import SystemHealthRadar from '../../components/charts/SystemHealthRadar';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';

const config = roleConfigs['super-admin'];
const [slate, blue, amber, teal] = THEME.statGradients;

export default function SuperAdminDashboard() {
  const { registeredUsers } = useAuth();
  const { buses, routes, tripReports } = useData();
  const today = new Date().toISOString().split('T')[0];
  const navItems = config.navItems.filter((item) => item.path !== '/super-admin');

  return (
    <div className="page-shell">
      <DashboardHero
        config={config}
        title="Super Admin Dashboard"
        subtitle="Full system overview, analytics & administration"
      />

      <div className="stat-grid">
        <StatCard label="Total Users" value={registeredUsers.length} icon="👥" color={slate} trend="Registered accounts" />
        <StatCard label="Total Buses" value={buses.length} icon="🚌" color={blue} trend={`${buses.filter((b) => b.status === 'active').length} active`} />
        <StatCard label="Active Routes" value={routes.length} icon="🗺️" color={amber} trend="System routes" />
        <StatCard label="Today's Trips" value={tripReports.filter((r) => r.date === today).length} icon="📍" color={teal} trend="Trip reports today" />
      </div>

      {/* Primary analytics row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyTripsChart />
        </div>
        <FleetStatusChart />
      </div>

      {/* Secondary analytics row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RouteCapacityChart />
        <HourlyActivityChart />
      </div>

      {/* Tertiary analytics row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>
        <SystemHealthRadar />
      </div>

      <UsersByRoleChart />

      <Card title="Quick Actions" subtitle="Jump to key administration areas">
        <QuickActionGrid
          items={navItems}
          accentBorder={THEME.superAdmin.hover}
          accentBg={config.accentBg}
          iconClassName={config.accent}
        />
      </Card>
    </div>
  );
}
