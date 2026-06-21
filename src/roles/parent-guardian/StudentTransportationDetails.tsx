import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function StudentTransportationDetails() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { students, buses, routes } = useData();
  const children = students.filter((s) => s.parentId === user?.id);

  return (
    <div className="page-shell">
      <PageHeader
        title="Student Transportation Details"
        description="View transportation details for your children"
        badge={config.title}
      />

      {children.length === 0 ? (
        <Card>
          <EmptyState
            icon="🚌"
            title="No transportation details"
            description="No children are linked to your account yet."
          />
        </Card>
      ) : (
        <div className="content-grid">
          {children.map((child) => {
            const route = routes.find((r) => r.id === child.routeId);
            const bus = buses.find((b) => b.id === child.busId);

            return (
              <Card key={child.id} interactive>
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config.accentBg} text-xl font-bold ${config.accent}`}>
                    {child.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                      {bus && <StatusBadge status={bus.status} />}
                    </div>
                    <p className="text-sm text-slate-500">Grade: {child.grade}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-xl border ${config.accentBorder} ${config.accentBg} p-4`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Route</p>
                    <p className="mt-1 font-semibold text-slate-900">{route?.name ?? 'N/A'}</p>
                    {route && (
                      <p className="mt-1 text-xs text-slate-500">{route.schedule}</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bus</p>
                    <p className="mt-1 font-semibold text-slate-900">{bus?.plateNumber ?? 'N/A'}</p>
                    {bus && (
                      <p className="mt-1 text-xs text-slate-500">Capacity: {bus.capacity} seats</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pickup Point</p>
                    <p className="mt-1 font-semibold text-slate-900">{child.pickupPoint}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Drop-off Point</p>
                    <p className="mt-1 font-semibold text-slate-900">{child.dropOffPoint}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
