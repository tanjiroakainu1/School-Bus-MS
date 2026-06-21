import { useState } from 'react';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import FormField from '../../components/shared/FormField';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import type { Route } from '../../types';

const config = roleConfigs['super-admin'];

export default function BusRouteManagement() {
  const { buses, routes, addBus, toggleBusStatus } = useData();
  const [activeTab, setActiveTab] = useState<'buses' | 'routes'>('buses');
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [busForm, setBusForm] = useState({ plateNumber: '', capacity: 45 });

  const handleAddBus = () => {
    if (!busForm.plateNumber) return;
    addBus({
      plateNumber: busForm.plateNumber,
      capacity: busForm.capacity,
      status: 'active',
    });
    setBusForm({ plateNumber: '', capacity: 45 });
    setIsBusModalOpen(false);
  };

  const tabs = [
    { id: 'buses', label: 'Buses', count: buses.length },
    { id: 'routes', label: 'Routes', count: routes.length },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="Bus & Route Management"
        description="Manage buses and transportation routes"
        action={
          activeTab === 'buses' ? (
            <button onClick={() => setIsBusModalOpen(true)} className="btn-primary">
              + Register Bus
            </button>
          ) : undefined
        }
      />

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'buses' | 'routes')}
        accentClass={config.navActive}
      />

      {activeTab === 'buses' ? (
        <Card>
          {buses.length === 0 ? (
            <EmptyState
              icon="🚌"
              title="No buses registered"
              description="Register a bus to start managing your fleet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buses.map((bus) => (
                <div key={bus.id} className="card-interactive p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-slate-900">{bus.plateNumber}</span>
                    <StatusBadge status={bus.status} />
                  </div>
                  <p className="text-sm text-slate-500">Capacity: {bus.capacity} seats</p>
                  <button
                    onClick={() => toggleBusStatus(bus.id)}
                    className={`mt-3 text-sm font-semibold ${config.accent} transition hover:opacity-80`}
                  >
                    Toggle Status
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card>
          {routes.length === 0 ? (
            <EmptyState
              icon="🗺️"
              title="No routes configured"
              description="Routes will appear here once they are set up."
            />
          ) : (
            <div className="space-y-4">
              {routes.map((route: Route) => (
                <div key={route.id} className="card-interactive p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-bold text-slate-900">{route.name}</h4>
                    <span className="text-sm font-medium text-slate-500">{route.schedule}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {route.startPoint} → {route.endPoint}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {route.stops.map((stop) => (
                      <span key={stop} className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Modal isOpen={isBusModalOpen} onClose={() => setIsBusModalOpen(false)} title="Register New Bus">
        <div className="space-y-4">
          <FormField label="Plate Number" hint="e.g. SB-005">
            <input
              type="text"
              value={busForm.plateNumber}
              onChange={(e) => setBusForm({ ...busForm, plateNumber: e.target.value })}
              className="input-field"
              placeholder="SB-005"
            />
          </FormField>
          <FormField label="Capacity">
            <input
              type="number"
              value={busForm.capacity}
              onChange={(e) => setBusForm({ ...busForm, capacity: Number(e.target.value) })}
              className="input-field"
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsBusModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddBus} className="btn-primary">Register</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
