import StatCard from '../../components/shared/StatCard';
import Card from '../../components/shared/Card';
import DashboardHero from '../../components/shared/DashboardHero';
import QuickActionGrid from '../../components/shared/QuickActionGrid';
import WeeklyTripsChart from '../../components/charts/WeeklyTripsChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
import RouteCapacityChart from '../../components/charts/RouteCapacityChart';
import RequestsStatusChart from '../../components/charts/RequestsStatusChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import HourlyActivityChart from '../../components/charts/HourlyActivityChart';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';
import {
  buildFleetStatusFromBuses,
  buildRouteCapacityFromData,
  buildRequestStatusData,
} from '../../utils/chartHelpers';

const config = roleConfigs['transportation-manager'];
const [slate, blue, amber, teal] = THEME.statGradients;

export default function TransportationManagerDashboard() {
  const { buses, drivers, requests, students, routes } = useData();
  const activeBuses = buses.filter((b) => b.status === 'active').length;
  const onRouteDrivers = drivers.filter((d) => d.status === 'on-route').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const totalCapacity = buses.filter((b) => b.status === 'active').reduce((sum, b) => sum + b.capacity, 0);
  const totalPassengers = students.length;
  const capacityUsed = totalCapacity ? Math.round((totalPassengers / totalCapacity) * 100) : 0;
  const navItems = config.navItems.filter((item) => item.path !== '/transportation-manager');

  const fleetData = buildFleetStatusFromBuses(buses);
  const routeCapacityData = buildRouteCapacityFromData(routes, buses, students);
  const requestData = buildRequestStatusData(requests);

  return (
    <div className="page-shell">
      <DashboardHero
        config={config}
        title="Transportation Manager Dashboard"
        subtitle="Monitor and manage daily transportation operations"
      />

      <div className="stat-grid">
        <StatCard label="Active Buses" value={activeBuses} icon="🚌" color={blue} />
        <StatCard label="On-Route Drivers" value={onRouteDrivers} icon="👨‍✈️" color={slate} />
        <StatCard label="Pending Requests" value={pendingRequests} icon="📝" color={amber} />
        <StatCard label="Capacity Used" value={`${capacityUsed}%`} icon="💺" color={teal} />
      </div>

      <div className="chart-grid-primary">
        <div className="chart-grid-primary-main">
          <WeeklyTripsChart title="Weekly Trip Volume" subtitle="Trips completed across all routes" />
        </div>
        <FleetStatusChart data={fleetData} subtitle={`${buses.length} buses in fleet`} />
      </div>

      <div className="chart-grid-secondary">
        <RouteCapacityChart data={routeCapacityData} />
        <RequestsStatusChart data={requestData} />
      </div>

      <div className="chart-grid-primary">
        <div className="chart-grid-primary-main">
          <AttendanceTrendChart title="Student Attendance Trend" subtitle="Monthly boarding attendance rates" />
        </div>
        <HourlyActivityChart title="Peak Hours" subtitle="Bus activity by time of day" />
      </div>

      <Card title="Quick Actions" subtitle="Manage routes, schedules, and operations">
        <QuickActionGrid
          items={navItems}
          accentBorder={THEME.manager.hover}
          accentBg={config.accentBg}
          iconClassName={config.accent}
        />
      </Card>
    </div>
  );
}
