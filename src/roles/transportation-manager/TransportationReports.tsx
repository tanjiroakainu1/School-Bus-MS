import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import AlertBanner from '../../components/shared/AlertBanner';
import StatCard from '../../components/shared/StatCard';
import WeeklyTripsChart from '../../components/charts/WeeklyTripsChart';
import RouteCapacityChart from '../../components/charts/RouteCapacityChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
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

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export default function TransportationReports() {
  const { buses, drivers, requests, students, routes, tripReports, attendance } = useData();
  const [reportType, setReportType] = useState<ReportPeriod>('daily');
  const [generated, setGenerated] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const fleetData = buildFleetStatusFromBuses(buses);
  const routeCapacityData = buildRouteCapacityFromData(routes, buses, students);
  const requestData = buildRequestStatusData(requests);

  const onTimeRate = useMemo(() => {
    const completed = tripReports.filter((r) => r.status === 'completed').length;
    const total = tripReports.length;
    return total ? `${Math.round((completed / total) * 100)}%` : '—';
  }, [tripReports]);

  const reportMetrics = useMemo(() => {
    const base = {
      daily: [
        { label: 'Trips Today', value: String(tripReports.filter((r) => r.date === today).length) },
        { label: 'Students Transported', value: String(students.length) },
        { label: 'On-Time Performance', value: onTimeRate },
        { label: 'Active Drivers', value: String(drivers.filter((d) => d.status === 'on-route').length) },
        { label: 'Pending Requests', value: String(requests.filter((r) => r.status === 'pending').length) },
      ],
      weekly: [
        { label: 'Weekly Trips', value: String(tripReports.length) },
        { label: 'Active Routes', value: String(routes.length) },
        { label: 'Fleet Active', value: String(buses.filter((b) => b.status === 'active').length) },
        { label: 'Approved Requests', value: String(requests.filter((r) => r.status === 'approved').length) },
        { label: 'Attendance Records', value: String(attendance.length) },
      ],
      monthly: [
        { label: 'Total Students', value: String(students.length) },
        { label: 'Total Buses', value: String(buses.length) },
        { label: 'Total Drivers', value: String(drivers.length) },
        { label: 'Open Requests', value: String(requests.filter((r) => r.status !== 'rejected').length) },
        { label: 'On-Time Rate', value: onTimeRate },
      ],
    };
    return base[reportType];
  }, [reportType, tripReports, today, students, onTimeRate, drivers, requests, routes, buses, attendance]);

  const handleExport = () => {
    setGenerated(true);
    setTimeout(() => setGenerated(false), 2000);
  };

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  const [slate, blue, amber, teal] = THEME.statGradients;
  const statColors = [blue, teal, amber, slate, blue];

  const renderCharts = () => {
    if (reportType === 'daily') {
      return (
        <div className="chart-grid-secondary">
          <HourlyActivityChart title="Daily Activity" subtitle="Buses and students by hour" />
          <FleetStatusChart data={fleetData} title="Fleet Snapshot" subtitle={`${buses.length} buses total`} />
        </div>
      );
    }
    if (reportType === 'weekly') {
      return (
        <div className="chart-grid-secondary">
          <WeeklyTripsChart title="Weekly Trips" subtitle="On-time vs delayed across the week" />
          <RouteCapacityChart data={routeCapacityData} />
        </div>
      );
    }
    return (
      <div className="chart-grid-secondary">
        <AttendanceTrendChart title="Monthly Attendance" subtitle="Boarding rates over time" />
        <RequestsStatusChart data={requestData} title="Request Pipeline" subtitle="Pending, approved & rejected" />
      </div>
    );
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Transportation Reports"
        description="Generate and export transportation reports with live analytics"
        badge="Reports"
        action={
          <button onClick={handleExport} className="btn-primary">
            Export Report
          </button>
        }
      />

      {generated && <AlertBanner type="success" message="Report exported successfully." />}

      <TabGroup
        tabs={tabs}
        activeTab={reportType}
        onChange={(id) => setReportType(id as ReportPeriod)}
        accentClass={config.navActive}
      />

      <Card
        title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Summary`}
        subtitle="Key performance metrics for the selected period"
      >
        <div className="stat-grid !grid-cols-1 xs:!grid-cols-2 lg:!grid-cols-5">
          {reportMetrics.map((item, index) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              icon="📊"
              color={statColors[index % statColors.length]}
            />
          ))}
        </div>
      </Card>

      {renderCharts()}
    </div>
  );
}
