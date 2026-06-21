import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

const config = roleConfigs['transportation-manager'];

export default function BusRoutes() {
  const { routes, addRoute, deleteRoute } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', startPoint: '', endPoint: '', schedule: '', stops: '' });

  const filtered = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(search.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(search.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(search.toLowerCase()) ||
      route.stops.some((stop) => stop.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = () => {
    if (!form.name) return;
    addRoute({
      name: form.name,
      startPoint: form.startPoint,
      endPoint: form.endPoint,
      schedule: form.schedule,
      stops: form.stops.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setForm({ name: '', startPoint: '', endPoint: '', schedule: '', stops: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus Route Management"
        description="Create and manage bus routes"
        badge="Routes"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Create Route
          </button>
        }
      />

      <Card noPadding>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search routes, stops, or destinations..."
            className="w-full"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="🗺️"
              title="No routes found"
              description={search ? 'Try adjusting your search terms.' : 'Create your first bus route to get started.'}
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
                        <th>Route</th>
                        <th>Path</th>
                        <th>Schedule</th>
                        <th>Stops</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((route) => (
                        <tr key={route.id}>
                          <td className="font-semibold text-slate-900">{route.name}</td>
                          <td>
                            <span className="text-slate-600">{route.startPoint}</span>
                            <span className="mx-1 text-slate-400">→</span>
                            <span className="text-slate-600">{route.endPoint}</span>
                          </td>
                          <td className={config.accent}>{route.schedule}</td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {route.stops.map((stop) => (
                                <span key={stop} className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                                  {stop}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => deleteRoute(route.id)}
                              className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mobile-card-list p-4">
              {filtered.map((route) => (
                <div key={route.id} className="mobile-card-item card-interactive">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900">{route.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {route.startPoint} → {route.endPoint}
                      </p>
                      <p className={`mt-1 text-sm font-medium ${config.accent}`}>{route.schedule}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {route.stops.map((stop) => (
                          <span key={stop} className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRoute(route.id)}
                      className="btn-ghost shrink-0 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Route">
        <div className="space-y-4">
          <FormField label="Route Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Start Point">
              <input
                type="text"
                value={form.startPoint}
                onChange={(e) => setForm({ ...form, startPoint: e.target.value })}
                className="input-field"
              />
            </FormField>
            <FormField label="End Point">
              <input
                type="text"
                value={form.endPoint}
                onChange={(e) => setForm({ ...form, endPoint: e.target.value })}
                className="input-field"
              />
            </FormField>
          </div>
          <FormField label="Schedule" hint="e.g. 7:00 AM - 8:30 AM">
            <input
              type="text"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              className="input-field"
              placeholder="7:00 AM - 8:30 AM"
            />
          </FormField>
          <FormField label="Stops" hint="Separate multiple stops with commas">
            <input
              type="text"
              value={form.stops}
              onChange={(e) => setForm({ ...form, stops: e.target.value })}
              className="input-field"
              placeholder="Oak St, Pine Ave, Maple Rd"
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreate} className="btn-primary">
              Create Route
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
