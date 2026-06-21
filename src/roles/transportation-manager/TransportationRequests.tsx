import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import SearchInput from '../../components/shared/SearchInput';
import TabGroup from '../../components/shared/TabGroup';
import EmptyState from '../../components/shared/EmptyState';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import type { TransportationRequest } from '../../types';

type StatusFilter = 'all' | TransportationRequest['status'];

export default function TransportationRequests() {
  const config = roleConfigs['transportation-manager'];
  const { requests, updateRequestStatus } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = requests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(search.toLowerCase()) ||
      request.requestType.toLowerCase().includes(search.toLowerCase()) ||
      request.notes.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'all', label: 'All', count: requests.length },
    { id: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: requests.filter((r) => r.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: requests.filter((r) => r.status === 'rejected').length },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title="Transportation Requests"
        description="Review and handle transportation requests"
        badge="Requests"
      />

      <TabGroup
        tabs={tabs}
        activeTab={statusFilter}
        onChange={(id) => setStatusFilter(id as StatusFilter)}
        accentClass={config.navActive}
      />

      <Card noPadding>
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by student, type, or notes..."
            className="max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="📝"
              title="No requests found"
              description={search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'No transportation requests to review.'}
            />
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <div className="table-shell border-0 shadow-none">
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((request) => (
                        <tr key={request.id}>
                          <td className="font-semibold text-slate-900">{request.studentName}</td>
                          <td className="capitalize text-slate-600">
                            {request.requestType.replace(/-/g, ' ')}
                          </td>
                          <td>
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="text-slate-600">{request.submittedAt}</td>
                          <td className="max-w-xs truncate text-slate-600">{request.notes}</td>
                          <td>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'approved')}
                                  className="btn-primary text-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'rejected')}
                                  className="btn-danger text-xs"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mobile-card-list p-4">
              {filtered.map((request) => (
                <div key={request.id} className="mobile-card-item card-interactive">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{request.studentName}</h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Type: {request.requestType.replace(/-/g, ' ')} • Submitted: {request.submittedAt}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{request.notes}</p>
                  {request.status === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                        className="btn-primary flex-1 text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                        className="btn-danger flex-1 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
