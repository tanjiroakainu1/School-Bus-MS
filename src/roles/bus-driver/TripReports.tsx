import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import DriverTripReportsChart from '../../components/charts/DriverTripReportsChart';
import RequestsStatusChart from '../../components/charts/RequestsStatusChart';
import WeeklyTripsChart from '../../components/charts/WeeklyTripsChart';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { TripReport } from '../../types';
import { roleConfigs } from '../../config/roles';
import { buildDriverTripChart, buildTripStatusData } from '../../utils/chartHelpers';

export default function TripReports() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { tripReports, getDriverByUserId, routes, addTripReport } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const driverId = driver?.id ?? 'd1';
  const assignedRoute = routes.find((r) => r.driverId === driverId);

  const reports = tripReports.filter((r) => r.driverId === driverId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ notes: '', status: 'completed' as TripReport['status'], passengersCount: 0 });

  const tripChartData = useMemo(() => buildDriverTripChart(tripReports, driverId), [tripReports, driverId]);
  const tripStatusData = useMemo(() => buildTripStatusData(reports), [reports]);

  const handleSubmit = () => {
    addTripReport({
      driverId,
      routeId: assignedRoute?.id ?? 'r1',
      date: new Date().toISOString().split('T')[0],
      status: form.status,
      notes: form.notes,
      passengersCount: form.passengersCount,
    });
    setForm({ notes: '', status: 'completed', passengersCount: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Trip Reports"
        description="Submit and view trip reports for your completed routes"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Submit Report
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DriverTripReportsChart
            data={tripChartData}
            title="Trip Report Analytics"
            subtitle="Passengers transported per submitted report"
          />
        </div>
        <RequestsStatusChart
          data={tripStatusData}
          title="Status Overview"
          subtitle="Your trip completion breakdown"
        />
      </div>

      <WeeklyTripsChart title="Weekly Trip Benchmark" subtitle="System-wide trip volume reference" />

      {reports.length === 0 ? (
        <Card>
          <EmptyState
            icon="📄"
            title="No trip reports yet"
            description="Submit your first trip report after completing a route."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} interactive>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">
                    {assignedRoute?.name ?? report.routeId} — {report.date}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{report.notes}</p>
                </div>
                <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-end">
                  <StatusBadge status={report.status} />
                  <p className="text-sm font-medium text-slate-500">{report.passengersCount} passengers</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Trip Report">
        <div className="space-y-5">
          <FormField label="Trip Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TripReport['status'] })}
              className="input-field"
            >
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Passengers Count">
            <input
              type="number"
              value={form.passengersCount}
              onChange={(e) => setForm({ ...form, passengersCount: Number(e.target.value) })}
              className="input-field"
            />
          </FormField>
          <FormField label="Notes" hint="Include any notable events during the trip">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Trip notes..."
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
