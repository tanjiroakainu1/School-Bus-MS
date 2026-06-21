import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import { useData } from '../../context/DataContext';
import { THEME } from '../../config/theme';

export default function BusCapacity() {
  const { buses, students } = useData();

  const capacityData = buses
    .filter((b) => b.status === 'active')
    .map((bus) => {
      const passengerCount = students.filter((s) => s.busId === bus.id).length;
      const utilization = Math.round((passengerCount / bus.capacity) * 100);
      return { bus, passengerCount, utilization };
    });

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus Capacity Tracking"
        description="Monitor passenger load across the fleet"
        badge="Capacity"
      />

      <div className="stat-grid">
        <StatCard
          label="Active Buses"
          value={capacityData.length}
          icon="🚌"
          color={THEME.statGradients[1]}
        />
        <StatCard
          label="Total Passengers"
          value={students.length}
          icon="👥"
          color={THEME.statGradients[3]}
        />
        <StatCard
          label="Avg. Utilization"
          value={
            capacityData.length
              ? `${Math.round(capacityData.reduce((sum, d) => sum + d.utilization, 0) / capacityData.length)}%`
              : '0%'
          }
          icon="📊"
          color={THEME.statGradients[2]}
        />
      </div>

      <div className="content-grid">
        {capacityData.map(({ bus, passengerCount, utilization }) => (
          <Card key={bus.id} title={bus.plateNumber} subtitle={`${bus.capacity} seat capacity`} interactive>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Passengers</span>
                <span className="font-bold text-slate-900">{passengerCount} / {bus.capacity}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    utilization >= 85 ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-slate-600">{utilization}% utilized</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
