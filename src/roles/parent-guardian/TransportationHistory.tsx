import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import StatusBadge from '../../components/shared/StatusBadge';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import ParentAttendanceChart from '../../components/charts/ParentAttendanceChart';
import ParentChildrenChart from '../../components/charts/ParentChildrenChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { buildParentAttendanceWeekly, buildParentAttendanceByChild } from '../../utils/chartHelpers';

export default function TransportationHistory() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { attendance, students } = useData();
  const children = students.filter((s) => s.parentId === user?.id);
  const childIds = children.map((s) => s.id);
  const baseHistory = attendance.filter((a) => childIds.includes(a.studentId));

  const [filter, setFilter] = useState<'all' | 'boarding' | 'drop-off'>('all');
  const [search, setSearch] = useState('');

  const weeklyData = useMemo(
    () => buildParentAttendanceWeekly(baseHistory, childIds),
    [baseHistory, childIds]
  );
  const childrenData = useMemo(
    () => buildParentAttendanceByChild(students, baseHistory, childIds),
    [students, baseHistory, childIds]
  );

  const tabs = [
    { id: 'all', label: 'All Records', count: baseHistory.length },
    { id: 'boarding', label: 'Boarding', count: baseHistory.filter((a) => a.type === 'boarding').length },
    { id: 'drop-off', label: 'Drop-off', count: baseHistory.filter((a) => a.type === 'drop-off').length },
  ];

  const history = useMemo(() => {
    let result = baseHistory.filter((a) => filter === 'all' || a.type === filter);
    const query = search.toLowerCase();
    if (query) {
      result = result.filter(
        (a) =>
          a.studentName.toLowerCase().includes(query) ||
          a.date.includes(query) ||
          a.time.toLowerCase().includes(query) ||
          a.type.includes(query)
      );
    }
    return result;
  }, [baseHistory, filter, search]);

  return (
    <div className="page-shell">
      <PageHeader
        title="Transportation History"
        description="View complete transportation history for your children"
        badge={config.title}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ParentAttendanceChart
            data={weeklyData}
            title="Attendance Over Time"
            subtitle="Recent boarding and drop-off activity"
          />
        </div>
        <ParentChildrenChart data={childrenData} />
      </div>

      <AttendanceTrendChart title="Monthly Overview" subtitle="Attendance trends across the school year" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabGroup
          tabs={tabs}
          activeTab={filter}
          onChange={(id) => setFilter(id as 'all' | 'boarding' | 'drop-off')}
          accentClass={config.navActive}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search history..."
          className="w-full sm:max-w-xs"
        />
      </div>

      {history.length === 0 ? (
        <Card>
          <EmptyState
            icon="📜"
            title="No records found"
            description={
              search
                ? 'Try adjusting your search or filter.'
                : 'No transportation history is available for this filter.'
            }
          />
        </Card>
      ) : (
        <>
          <div className="table-shell hidden sm:block">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td className="font-semibold text-slate-900">{record.studentName}</td>
                      <td>{record.date}</td>
                      <td className="capitalize">{record.type}</td>
                      <td>{record.time}</td>
                      <td>
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-card-list">
            {history.map((record) => (
              <div key={record.id} className="mobile-card-item">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                    record.type === 'boarding' ? config.accentBg : 'bg-slate-50'
                  }`}>
                    {record.type === 'boarding' ? '🚌' : '🏠'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">{record.studentName}</p>
                      <StatusBadge status={record.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {record.date} at {record.time}
                    </p>
                    <p className="mt-1 text-xs font-medium capitalize text-slate-400">{record.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
