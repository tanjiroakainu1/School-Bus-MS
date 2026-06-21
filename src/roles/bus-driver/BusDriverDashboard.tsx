import StatCard from '../../components/shared/StatCard';
import Card from '../../components/shared/Card';
import DashboardHero from '../../components/shared/DashboardHero';
import QuickActionGrid from '../../components/shared/QuickActionGrid';
import DriverTripReportsChart from '../../components/charts/DriverTripReportsChart';
import RequestsStatusChart from '../../components/charts/RequestsStatusChart';
import RouteCapacityChart from '../../components/charts/RouteCapacityChart';
import HourlyActivityChart from '../../components/charts/HourlyActivityChart';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';
import {
  buildDriverTripChart,
  buildRouteCapacityFromData,
  buildTripStatusData,
} from '../../utils/chartHelpers';

const config = roleConfigs['bus-driver'];
const [slate, blue, amber, teal] = THEME.statGradients;

export default function BusDriverDashboard() {
  const { user } = useAuth();
  const { routes, students, notifications, tripStatus, tripReports, buses, getDriverByUserId } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const driverId = driver?.id ?? '';
  const assignedRoute = routes.find((r) => r.driverId === driver?.id);
  const passengersToday = students.filter((s) => s.busId === driver?.busId).length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const navItems = config.navItems.filter((item) => item.path !== '/bus-driver');

  const driverReports = tripReports.filter((r) => r.driverId === driverId);
  const tripChartData = buildDriverTripChart(tripReports, driverId);
  const tripStatusData = buildTripStatusData(driverReports);
  const routeCapacityData = assignedRoute
    ? buildRouteCapacityFromData([assignedRoute], buses, students)
    : undefined;

  return (
    <div className="page-shell">
      <DashboardHero
        config={config}
        title="Bus Driver Dashboard"
        subtitle="Your daily route and trip overview"
      />

      <div className="stat-grid">
        <StatCard label="Assigned Route" value={assignedRoute?.name ?? 'None'} icon="🗺️" color={amber} />
        <StatCard label="Passengers Today" value={passengersToday} icon="👨‍🎓" color={blue} />
        <StatCard label="Trip Status" value={tripStatus.status.replace('-', ' ')} icon="🚦" color={teal} />
        <StatCard label="Notifications" value={unreadNotifications} icon="🔔" color={slate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DriverTripReportsChart
            data={tripChartData}
            title="My Trip Performance"
            subtitle="Passengers and on-time records from your reports"
          />
        </div>
        <RequestsStatusChart
          data={tripStatusData}
          title="Trip Status Breakdown"
          subtitle="Completed, delayed & cancelled trips"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RouteCapacityChart
          data={routeCapacityData}
          title="Route Capacity"
          subtitle={assignedRoute ? `${assignedRoute.name} passenger load` : 'No route assigned'}
        />
        <HourlyActivityChart title="Peak Pickup Hours" subtitle="Typical morning & afternoon activity" />
      </div>

      <Card title="Quick Actions" subtitle="Routes, attendance, and trip tools">
        <QuickActionGrid
          items={navItems}
          accentBorder={THEME.driver.hover}
          accentBg={config.accentBg}
          iconClassName={config.accent}
        />
      </Card>
    </div>
  );
}
