import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import AlertBanner from '../../components/shared/AlertBanner';
import { useData } from '../../context/DataContext';

export default function BackupRestore() {
  const { backupLogs, createBackup, restoreFromBackup } = useData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  const handleBackup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createBackup();
      setMessage({ type: 'success', text: 'Backup created and saved locally.' });
      setIsProcessing(false);
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  const handleRestore = () => {
    if (!confirm('Are you sure you want to restore? This will overwrite current data.')) return;
    setIsProcessing(true);
    setTimeout(() => {
      const result = restoreFromBackup();
      setMessage(
        result
          ? { type: 'success', text: 'Data restored from the latest backup.' }
          : { type: 'warning', text: 'No backup found. Create a backup first.' }
      );
      setIsProcessing(false);
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="Backup & Restore"
        description="Manage system data backup and recovery"
      />

      {message && <AlertBanner type={message.type} message={message.text} />}

      <div className="content-grid">
        <Card title="Create Backup" interactive>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Create a full backup of all system data including users, routes, and records.
          </p>
          <button onClick={handleBackup} disabled={isProcessing} className="btn-primary">
            {isProcessing ? 'Processing...' : '💾 Create Backup Now'}
          </button>
        </Card>

        <Card title="Restore Data" interactive>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Restore system data from the most recent backup. This action cannot be undone.
          </p>
          <button onClick={handleRestore} disabled={isProcessing} className="btn-danger">
            {isProcessing ? 'Processing...' : '🔄 Restore from Backup'}
          </button>
        </Card>
      </div>

      <Card title="Backup History" subtitle={`${backupLogs.length} entries`} noPadding={backupLogs.length > 0}>
        {backupLogs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="💾"
              title="No backup history"
              description="Create your first backup to see history here."
            />
          </div>
        ) : (
          <>
            <div className="table-shell hidden border-0 shadow-none sm:block">
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{log.type === 'backup' ? '💾' : '🔄'}</span>
                            <StatusBadge status={log.type} />
                          </div>
                        </td>
                        <td className="text-slate-600">{log.date}</td>
                        <td>
                          <StatusBadge status={log.status} />
                        </td>
                        <td className="text-slate-600">{log.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-card-list p-4">
              {backupLogs.map((log) => (
                <div key={log.id} className="mobile-card-item">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{log.type === 'backup' ? '💾' : '🔄'}</span>
                      <StatusBadge status={log.type} />
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                  <p className="text-sm text-slate-600">{log.date}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{log.size}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
