import { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function BusSchedules() {
  const config = roleConfigs['parent-guardian'];
  const { user } = useAuth();
  const { students, routes, schedules } = useData();
  const child = students.find((s) => s.parentId === user?.id);
  const childRoute = routes.find((r) => r.id === child?.routeId);
  const routeSchedule = schedules.find((s) => s.routeId === childRoute?.id);
  const [activeTab, setActiveTab] = useState('all');

  const schedule = childRoute
    ? [
        { type: 'Morning Pickup', time: routeSchedule?.morningPickup ?? '7:00 AM', location: child?.pickupPoint ?? childRoute.stops[0], period: 'morning' },
        { type: 'Morning Drop-off', time: routeSchedule?.morningDropoff ?? '8:30 AM', location: childRoute.endPoint, period: 'morning' },
        { type: 'Afternoon Pickup', time: routeSchedule?.afternoonPickup ?? '3:00 PM', location: childRoute.endPoint, period: 'afternoon' },
        { type: 'Afternoon Drop-off', time: routeSchedule?.afternoonDropoff ?? '4:30 PM', location: child?.pickupPoint ?? childRoute.stops[0], period: 'afternoon' },
      ]
    : [];

  const filteredSchedule =
    activeTab === 'all' ? schedule : schedule.filter((item) => item.period === activeTab);

  const tabs = [
    { id: 'all', label: 'All', count: schedule.length },
    { id: 'morning', label: 'Morning', count: schedule.filter((s) => s.period === 'morning').length },
    { id: 'afternoon', label: 'Afternoon', count: schedule.filter((s) => s.period === 'afternoon').length },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus Schedules"
        description="Track bus pickup and drop-off schedules"
        badge={config.title}
      />

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        accentClass={config.navActive}
      />

      {childRoute ? (
        <Card title={`${childRoute.name} Schedule`} subtitle={childRoute.schedule}>
          <div className="space-y-3">
            {filteredSchedule.map((item, index) => (
              <div
                key={index}
                className="card-interactive flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.accentBg} text-xl`}>
                  {index % 2 === 0 ? '🚌' : '🏫'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{item.type}</p>
                  <p className="text-sm text-slate-500">{item.location}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className={`text-xl font-extrabold ${config.accent}`}>{item.time}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Daily</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-center text-slate-500">No schedule available for your children yet.</p>
        </Card>
      )}
    </div>
  );
}
