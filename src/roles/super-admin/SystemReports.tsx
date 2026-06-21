import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import FormField from '../../components/shared/FormField';
import AlertBanner from '../../components/shared/AlertBanner';
import StatCard from '../../components/shared/StatCard';
import WeeklyTripsChart from '../../components/charts/WeeklyTripsChart';
import RouteCapacityChart from '../../components/charts/RouteCapacityChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import UsersByRoleChart from '../../components/charts/UsersByRoleChart';
import HourlyActivityChart from '../../components/charts/HourlyActivityChart';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';

const config = roleConfigs['super-admin'];

type ReportType = 'transportation' | 'attendance' | 'route' | 'driver' | 'utilization';

const reportTypes: { id: ReportType; label: string; icon: string }[] = [
  { id: 'transportation', label: 'Transportation Report', icon: '🚌' },
  { id: 'attendance', label: 'Attendance Report', icon: '✅' },
  { id: 'route', label: 'Route Report', icon: '🗺️' },
  { id: 'driver', label: 'Driver Report', icon: '👨‍✈️' },
  { id: 'utilization', label: 'Bus Utilization', icon: '📊' },
];

const reportCharts: Record<ReportType, React.ComponentType[]> = {
  transportation: [WeeklyTripsChart, RouteCapacityChart],
  attendance: [AttendanceTrendChart, WeeklyTripsChart],
  route: [RouteCapacityChart, HourlyActivityChart],
  driver: [FleetStatusChart, UsersByRoleChart],
  utilization: [RouteCapacityChart, FleetStatusChart],
};

export default function SystemReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('transportation');
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-21' });
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const mockReportData: Record<ReportType, { label: string; value: string }[]> = {
    transportation: [
      { label: 'Total Trips', value: '480' },
      { label: 'On-Time Rate', value: '94.2%' },
      { label: 'Students Transported', value: '1,245' },
    ],
    attendance: [
      { label: 'Boarding Rate', value: '96.8%' },
      { label: 'Absent Students', value: '42' },
      { label: 'Daily Average', value: '312' },
    ],
    route: [
      { label: 'Active Routes', value: '8' },
      { label: 'Avg. Trip Duration', value: '45 min' },
      { label: 'Most Used Route', value: 'North Route' },
    ],
    driver: [
      { label: 'Active Drivers', value: '12' },
      { label: 'Avg. Rating', value: '4.7/5' },
      { label: 'Issues Reported', value: '3' },
    ],
    utilization: [
      { label: 'Fleet Utilization', value: '83%' },
      { label: 'Avg. Capacity Used', value: '78%' },
      { label: 'Idle Buses', value: '2' },
    ],
  };

  const selectedLabel = reportTypes.find((r) => r.id === selectedReport)?.label;
  const ActiveCharts = reportCharts[selectedReport];

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="System Reports"
        description="Generate system-wide transportation reports with live charts"
        action={
          <button onClick={handleGenerate} className="btn-primary">
            Generate Report
          </button>
        }
      />

      {generated && (
        <AlertBanner type="success" message="Report generated successfully." />
      )}

      <div className="grid grid-cols-1 gap-2.5 min-w-0 2xs:grid-cols-2 xs:gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`card-interactive flex min-h-[88px] flex-col items-center justify-center gap-1.5 p-3 text-center 2xs:min-h-[96px] 2xs:gap-2 2xs:p-4 ${
              selectedReport === report.id
                ? `border-slate-400 ${config.accentBg} ring-2 ring-slate-200`
                : ''
            }`}
          >
            <span className="text-2xl">{report.icon}</span>
            <span className="text-xs font-bold leading-tight text-slate-700">{report.label}</span>
          </button>
        ))}
      </div>

      <div className="content-grid lg:grid-cols-3">
        <Card title="Date Range" className="lg:col-span-1">
          <div className="space-y-4">
            <FormField label="Start Date">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-field"
              />
            </FormField>
            <FormField label="End Date">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-field"
              />
            </FormField>
          </div>
        </Card>

        <Card title={`${selectedLabel} Summary`} className="lg:col-span-2">
          <div className="stat-grid !grid-cols-1 xs:!grid-cols-3">
            {mockReportData[selectedReport].map((item, index) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                icon={reportTypes.find((r) => r.id === selectedReport)?.icon ?? '📊'}
                color={THEME.statGradients[index % THEME.statGradients.length]}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="chart-grid-secondary">
        {ActiveCharts.map((ChartComponent, index) => (
          <ChartComponent key={`${selectedReport}-${index}`} />
        ))}
      </div>
    </div>
  );
}
