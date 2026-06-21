import { useMemo } from 'react';
import StatCard from '../../components/shared/StatCard';
import Card from '../../components/shared/Card';
import DashboardHero from '../../components/shared/DashboardHero';
import QuickActionGrid from '../../components/shared/QuickActionGrid';
import ParentAttendanceChart from '../../components/charts/ParentAttendanceChart';
import ParentChildrenChart from '../../components/charts/ParentChildrenChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import HourlyActivityChart from '../../components/charts/HourlyActivityChart';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';
import { buildParentAttendanceWeekly, buildParentAttendanceByChild } from '../../utils/chartHelpers';

const config = roleConfigs['parent-guardian'];
const [slate, blue, amber, teal] = THEME.statGradients;

export default function ParentGuardianDashboard() {
  const { user } = useAuth();
  const { students, attendance, notifications, schedules } = useData();
  const children = students.filter((s) => s.parentId === user?.id);
  const childIds = children.map((c) => c.id);
  const lastBoarding = attendance.find((a) => childIds.includes(a.studentId) && a.type === 'boarding');
  const routeSchedule = schedules.find((s) => s.routeId === children[0]?.routeId);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const navItems = config.navItems.filter((item) => item.path !== '/parent-guardian');

  const weeklyData = useMemo(
    () => buildParentAttendanceWeekly(attendance, childIds),
    [attendance, childIds]
  );
  const childrenData = useMemo(
    () => buildParentAttendanceByChild(students, attendance, childIds),
    [students, attendance, childIds]
  );

  return (
    <div className="page-shell">
      <DashboardHero
        config={config}
        title="Parent / Guardian Dashboard"
        subtitle="Monitor your children's transportation"
      />

      <div className="stat-grid">
        <StatCard label="Children" value={children.length} icon="👨‍👩‍👧" color={teal} />
        <StatCard label="Next Bus" value={routeSchedule?.morningPickup ?? '—'} icon="🚌" color={blue} />
        <StatCard label="Last Boarding" value={lastBoarding?.time ?? '—'} icon="📍" color={amber} />
        <StatCard label="Notifications" value={unreadNotifications} icon="🔔" color={slate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ParentAttendanceChart
            data={weeklyData}
            title="Recent Attendance Trend"
            subtitle="Boarding & drop-off records for your children"
          />
        </div>
        <ParentChildrenChart
          data={childrenData}
          title="By Child"
          subtitle="Present vs absent per student"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceTrendChart title="Monthly Attendance" subtitle="Long-term attendance patterns" />
        <HourlyActivityChart title="Bus Schedule Peaks" subtitle="When buses are most active" />
      </div>

      <Card title="Quick Actions" subtitle="Schedules, boarding, and student info">
        <QuickActionGrid
          items={navItems}
          accentBorder={THEME.parent.hover}
          accentBg={config.accentBg}
          iconClassName={config.accent}
        />
      </Card>
    </div>
  );
}
