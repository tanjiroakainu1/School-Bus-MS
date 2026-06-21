import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import AlertBanner from '../../components/shared/AlertBanner';
import FormField from '../../components/shared/FormField';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { TripStatusType } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

const statusConfig: Record<TripStatusType, { label: string; icon: string }> = {
  'not-started': { label: 'Not Started', icon: '⏸️' },
  'in-progress': { label: 'In Progress', icon: '🚌' },
  completed: { label: 'Completed', icon: '✅' },
  delayed: { label: 'Delayed', icon: '⚠️' },
};

export default function TripStatus() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { tripStatus, getDriverByUserId, updateTripStatus } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const [updated, setUpdated] = useState(false);

  const currentStatus = driver?.id === tripStatus.driverId ? tripStatus : tripStatus;

  const handleUpdate = (newStatus: TripStatusType) => {
    updateTripStatus({
      driverId: driver?.id ?? tripStatus.driverId,
      status: newStatus,
    });
    setUpdated(true);
    setTimeout(() => setUpdated(false), 2000);
  };

  const handleDelayReasonChange = (delayReason: string) => {
    updateTripStatus({ delayReason });
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Trip Status"
        description="Update your current trip status for the transportation team"
      />

      {updated && <AlertBanner type="success" message="Status updated successfully!" />}

      <Card>
        <div className="mb-8 text-center">
          <span className="text-6xl">{statusConfig[currentStatus.status].icon}</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {currentStatus.routeName}
          </h2>
          <div className="mt-3">
            <StatusBadge status={currentStatus.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(statusConfig) as TripStatusType[]).map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              className={`card-interactive flex flex-col items-center gap-2 !p-4 text-center ${
                currentStatus.status === s ? `ring-2 ring-amber-500 ${config.accentBg}` : ''
              }`}
            >
              <span className="text-3xl">{statusConfig[s].icon}</span>
              <p className="text-xs font-bold text-slate-700">{statusConfig[s].label}</p>
            </button>
          ))}
        </div>

        {currentStatus.status === 'delayed' && (
          <div className="mt-8">
            <FormField label="Delay Reason" hint="Describe the reason so parents and staff are informed">
              <textarea
                value={currentStatus.delayReason}
                onChange={(e) => handleDelayReasonChange(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Describe the reason for delay..."
              />
            </FormField>
          </div>
        )}
      </Card>
    </div>
  );
}
