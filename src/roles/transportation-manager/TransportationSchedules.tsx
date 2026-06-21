import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import FormField from '../../components/shared/FormField';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';
import type { ScheduleEntry } from '../../types';

const config = roleConfigs['transportation-manager'];

const scheduleFields = [
  { key: 'morningPickup' as const, label: 'Morning Pickup' },
  { key: 'morningDropoff' as const, label: 'Morning Drop-off' },
  { key: 'afternoonPickup' as const, label: 'Afternoon Pickup' },
  { key: 'afternoonDropoff' as const, label: 'Afternoon Drop-off' },
];

export default function TransportationSchedules() {
  const { schedules, updateScheduleEntry } = useData();

  return (
    <div className="page-shell">
      <PageHeader
        title="Transportation Schedules"
        description="Schedule changes save automatically as you edit"
        badge="Schedules"
      />

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.routeId} interactive>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.accentBg} text-lg`}>
                📅
              </div>
              <h3 className="section-title">{schedule.routeName}</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scheduleFields.map(({ key, label }) => (
                <FormField key={key} label={label}>
                  <input
                    type="text"
                    value={schedule[key]}
                    onChange={(e) =>
                      updateScheduleEntry(schedule.routeId, key as keyof ScheduleEntry, e.target.value)
                    }
                    className="input-field"
                  />
                </FormField>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
