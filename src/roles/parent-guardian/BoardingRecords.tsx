import { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function BoardingRecords() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { attendance, students } = useData();
  const childIds = students.filter((s) => s.parentId === user?.id).map((s) => s.id);
  const childRecords = attendance.filter((a) => childIds.includes(a.studentId));
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return childRecords;
    return childRecords.filter(
      (record) =>
        record.studentName.toLowerCase().includes(query) ||
        record.date.includes(query) ||
        record.type.includes(query) ||
        record.status.includes(query)
    );
  }, [childRecords, search]);

  return (
    <div className="page-shell">
      <PageHeader
        title="Boarding Records"
        description="View student boarding and drop-off records"
        badge={config.title}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by student, date, type, or status..."
      />

      {filteredRecords.length === 0 ? (
        <Card>
          <EmptyState
            icon="📍"
            title="No boarding records found"
            description={search ? 'Try adjusting your search terms.' : 'No records are available yet.'}
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
                  {filteredRecords.map((record) => (
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
            {filteredRecords.map((record) => (
              <div key={record.id} className="mobile-card-item">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{record.studentName}</p>
                    <p className="mt-1 text-sm text-slate-500">{record.date}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
                <div className="mt-3 flex gap-4 text-sm text-slate-600">
                  <span className="capitalize">
                    <span className="font-medium text-slate-500">Type: </span>
                    {record.type}
                  </span>
                  <span>
                    <span className="font-medium text-slate-500">Time: </span>
                    {record.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
