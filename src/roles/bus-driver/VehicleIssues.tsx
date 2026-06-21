import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { VehicleIssue } from '../../types';
import { roleConfigs } from '../../config/roles';

export default function VehicleIssues() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { vehicleIssues, getDriverByUserId, addVehicleIssue } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const driverId = driver?.id ?? 'd1';
  const busId = driver?.busId ?? 'b1';

  const issues = vehicleIssues.filter((i) => i.driverId === driverId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ description: '', severity: 'low' as VehicleIssue['severity'] });

  const handleReport = () => {
    if (!form.description) return;
    addVehicleIssue({
      busId,
      driverId,
      description: form.description,
      severity: form.severity,
      status: 'open',
      reportedAt: new Date().toISOString().split('T')[0],
    });
    setForm({ description: '', severity: 'low' });
    setIsModalOpen(false);
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Vehicle Issues"
        description="Report and track vehicle maintenance issues on your bus"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Report Issue
          </button>
        }
      />

      {issues.length === 0 ? (
        <Card>
          <EmptyState
            icon="🚌"
            title="No issues reported"
            description="All good! Report any vehicle problems here when they arise."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <Card key={issue.id} interactive>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={issue.severity} />
                    <StatusBadge status={issue.status} />
                  </div>
                  <p className="mt-3 font-semibold text-slate-900">{issue.description}</p>
                  <p className="mt-2 text-sm text-slate-500">Reported: {issue.reportedAt}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Vehicle Issue">
        <div className="space-y-5">
          <FormField label="Description" hint="Provide details about the vehicle issue">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Describe the issue..."
            />
          </FormField>
          <FormField label="Severity">
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value as VehicleIssue['severity'] })}
              className="input-field"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleReport} className="btn-primary">Submit Report</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
