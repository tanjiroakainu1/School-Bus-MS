import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import SearchInput from '../../components/shared/SearchInput';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function PassengerList() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { students, getDriverByUserId } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const passengers = students.filter((s) => s.busId === driver?.busId);
  const [search, setSearch] = useState('');

  const filtered = passengers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupPoint.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Passenger List"
        description="View students assigned to your bus"
      />

      <Card>
        <div className="mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search passengers..."
            className="max-w-sm"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((student) => (
            <div key={student.id} className="card-interactive flex flex-col gap-2 !p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-500">Grade {student.grade}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                  Pickup: {student.pickupPoint}
                </span>
                <StatusBadge status="active" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
