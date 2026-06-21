import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import FormField from '../../components/shared/FormField';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

const config = roleConfigs['transportation-manager'];

export default function BusDriverAssignment() {
  const { routes, buses, drivers, updateRouteAssignments } = useData();

  const assignments = routes.map((r) => ({
    routeId: r.id,
    routeName: r.name,
    busId: r.busId ?? '',
    driverId: r.driverId ?? '',
  }));

  const handleAssign = (routeId: string, field: 'busId' | 'driverId', value: string) => {
    const updated = assignments.map((a) =>
      a.routeId === routeId ? { ...a, [field]: value } : a
    );
    updateRouteAssignments(updated);
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus & Driver Assignments"
        description="Assignments save automatically when you make a selection"
        badge="Assignments"
      />

      <div className="content-grid">
        {assignments.map((assignment) => (
          <Card key={assignment.routeId} interactive>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.accentBg} text-lg`}>
                🗺️
              </div>
              <h3 className="section-title">{assignment.routeName}</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Assign Bus">
                <select
                  value={assignment.busId}
                  onChange={(e) => handleAssign(assignment.routeId, 'busId', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Bus</option>
                  {buses.filter((b) => b.status === 'active').map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plateNumber} ({bus.capacity} seats)
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Assign Driver">
                <select
                  value={assignment.driverId}
                  onChange={(e) => handleAssign(assignment.routeId, 'driverId', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.status})
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
