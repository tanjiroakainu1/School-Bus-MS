import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import SearchInput from '../../components/shared/SearchInput';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { useState } from 'react';

const config = roleConfigs['super-admin'];

export default function TransportationRecords() {
  const { attendance, tripReports } = useData();
  const [activeTab, setActiveTab] = useState<'attendance' | 'trips'>('attendance');
  const [filter, setFilter] = useState('');

  const filteredAttendance = attendance.filter((a) =>
    a.studentName.toLowerCase().includes(filter.toLowerCase())
  );

  const tabs = [
    { id: 'attendance', label: 'Attendance Records', count: filteredAttendance.length },
    { id: 'trips', label: 'Trip Reports', count: tripReports.length },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="Transportation Records"
        description="View all transportation and attendance records"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'attendance' | 'trips')}
          accentClass={config.navActive}
        />
        {activeTab === 'attendance' && (
          <SearchInput
            value={filter}
            onChange={setFilter}
            placeholder="Filter records..."
            className="w-full sm:max-w-xs"
          />
        )}
      </div>

      <Card noPadding={activeTab === 'attendance' && filteredAttendance.length > 0}>
        {activeTab === 'attendance' ? (
          filteredAttendance.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="📋"
                title="No attendance records"
                description={filter ? 'No records match your filter.' : 'Attendance records will appear here.'}
              />
            </div>
          ) : (
            <>
              <div className="table-shell hidden border-0 shadow-none sm:block">
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
                      {filteredAttendance.map((record) => (
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

              <div className="mobile-card-list p-4">
                {filteredAttendance.map((record) => (
                  <div key={record.id} className="mobile-card-item">
                    <p className="font-semibold text-slate-900">{record.studentName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {record.date} • {record.time} • {record.type}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={record.status} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        ) : tripReports.length === 0 ? (
          <div className="p-6">
            <EmptyState icon="📄" title="No trip reports" description="Trip reports will appear here." />
          </div>
        ) : (
          <>
            <div className="table-shell hidden border-0 shadow-none sm:block">
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Passengers</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.date}</td>
                        <td className="font-semibold text-slate-900">{report.routeId}</td>
                        <td>
                          <StatusBadge status={report.status} />
                        </td>
                        <td>{report.passengersCount}</td>
                        <td className="max-w-xs truncate text-slate-600">{report.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-card-list p-4">
              {tripReports.map((report) => (
                <div key={report.id} className="mobile-card-item">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{report.date}</p>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{report.passengersCount} passengers</p>
                  <p className="mt-2 text-sm text-slate-600">{report.notes}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
