import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function AssignedRoutes() {
  const config = roleConfigs['bus-driver'];
  const { user } = useAuth();
  const { routes, buses, getDriverByUserId } = useData();
  const driver = getDriverByUserId(user?.id ?? '');
  const assignedRoutes = routes.filter((r) => r.driverId === driver?.id);

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Assigned Routes"
        description="View your assigned bus routes and schedules"
      />

      {assignedRoutes.length === 0 ? (
        <Card>
          <p className="text-center text-slate-500">No routes assigned yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignedRoutes.map((route) => {
            const bus = buses.find((b) => b.id === route.busId);
            return (
              <Card key={route.id} interactive>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{route.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {route.startPoint} → {route.endPoint}
                    </p>
                    <p className={`mt-2 text-sm font-medium ${config.accent}`}>{route.schedule}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bus && (
                      <span className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                        Bus {bus.plateNumber}
                      </span>
                    )}
                    <StatusBadge status="active" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {route.stops.map((stop) => (
                    <span key={stop} className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                      {stop}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
