import { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import TabGroup from '../../components/shared/TabGroup';
import FormField from '../../components/shared/FormField';
import EmptyState from '../../components/shared/EmptyState';
import AlertBanner from '../../components/shared/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { TransportationRequest } from '../../types';
import { roleConfigs } from '../../config/roles';

export default function ParentTransportationRequests() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { requests, students, addRequest } = useData();
  const children = students.filter((s) => s.parentId === user?.id);
  const childIds = children.map((c) => c.id);
  const myRequests = requests.filter((r) => childIds.includes(r.studentId));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studentId: children[0]?.id ?? '',
    requestType: 'change-route' as TransportationRequest['requestType'],
    notes: '',
  });

  const tabs = [
    { id: 'all', label: 'All', count: myRequests.length },
    { id: 'pending', label: 'Pending', count: myRequests.filter((r) => r.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: myRequests.filter((r) => r.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: myRequests.filter((r) => r.status === 'rejected').length },
  ];

  const filteredRequests = useMemo(() => {
    if (activeTab === 'all') return myRequests;
    return myRequests.filter((r) => r.status === activeTab);
  }, [myRequests, activeTab]);

  const handleSubmit = () => {
    if (!form.notes || !form.studentId) return;
    const student = children.find((s) => s.id === form.studentId);
    addRequest({
      studentId: form.studentId,
      studentName: student?.name ?? '',
      requestType: form.requestType,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      notes: form.notes,
    });
    setForm({ studentId: children[0]?.id ?? '', requestType: 'change-route', notes: '' });
    setIsModalOpen(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Transportation Requests"
        description="Submit and track transportation requests"
        badge={config.title}
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" disabled={children.length === 0}>
            + New Request
          </button>
        }
      />

      {submitted && (
        <AlertBanner type="success" message="Transportation request submitted successfully!" />
      )}

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        accentClass={config.navActive}
      />

      {filteredRequests.length === 0 ? (
        <Card>
          <EmptyState
            icon="📝"
            title="No requests found"
            description={
              activeTab === 'all'
                ? 'Submit a new request to get started.'
                : `No ${activeTab} requests at this time.`
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} interactive>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">{request.studentName}</h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {request.requestType.replace(/-/g, ' ')} • {request.submittedAt}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{request.notes}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Transportation Request">
        <div className="space-y-5">
          <FormField label="Student">
            <select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="input-field"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Request Type">
            <select
              value={form.requestType}
              onChange={(e) => setForm({ ...form, requestType: e.target.value as TransportationRequest['requestType'] })}
              className="input-field"
            >
              <option value="new-route">New Route</option>
              <option value="change-route">Change Route</option>
              <option value="temporary-change">Temporary Change</option>
            </select>
          </FormField>

          <FormField label="Notes" hint="Describe your request in detail">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Describe your request..."
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary">Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
