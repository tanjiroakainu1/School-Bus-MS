import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import { THEME } from '../../config/theme';

const config = roleConfigs['transportation-manager'];

export default function BusOperations() {
  const { routes, buses, drivers } = useData();
  const activeBuses = buses.filter((b) => b.status === 'active').length;
  const onRouteDrivers = drivers.filter((d) => d.status === 'on-route').length;

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus Operations Monitor"
        description="Real-time overview of fleet operations"
        badge="Operations"
      />

      <div className="stat-grid">
        <StatCard label="Active Routes" value={routes.length} icon="🗺️" color={THEME.statGradients[1]} />
        <StatCard label="Active Buses" value={activeBuses} icon="🚌" color={THEME.statGradients[0]} />
        <StatCard label="Drivers On Route" value={onRouteDrivers} icon="👨‍✈️" color={THEME.statGradients[2]} />
        <StatCard label="Total Fleet" value={buses.length} icon="📊" color={THEME.statGradients[3]} />
      </div>

      <Card title="Live Route Status">
        <div className="space-y-4">
          {routes.map((route) => {
            const bus = buses.find((b) => b.id === route.busId);
            const driver = drivers.find((d) => d.id === route.driverId);
            return (
              <div key={route.id} className="card-interactive p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="font-bold text-slate-900">{route.name}</h4>
                  <span className={`text-sm font-medium ${config.accent}`}>{route.schedule}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Bus: {bus?.plateNumber ?? 'Unassigned'} • Driver: {driver?.name ?? 'Unassigned'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
