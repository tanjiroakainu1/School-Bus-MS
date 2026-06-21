import { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import TabGroup from '../../components/shared/TabGroup';
import SearchInput from '../../components/shared/SearchInput';
import EmptyState from '../../components/shared/EmptyState';
import AlertBanner from '../../components/shared/AlertBanner';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function BusArrivalNotifications() {
  const config = roleConfigs['parent-guardian'];
  const { notifications, markNotificationRead } = useData();
  const parentNotifications = notifications.filter(
    (n) => n.title.includes('Bus') || n.title.includes('Route') || n.title.includes('Emergency')
  );

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const unreadCount = parentNotifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    let result = parentNotifications;
    if (activeTab === 'unread') {
      result = result.filter((n) => !n.read);
    }
    const query = search.toLowerCase();
    if (query) {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }
    return result;
  }, [parentNotifications, activeTab, search]);

  const handleDismiss = (id: string) => {
    markNotificationRead(id);
    setDismissedId(id);
    setTimeout(() => setDismissedId(null), 2500);
  };

  const tabs = [
    { id: 'all', label: 'All', count: parentNotifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
  ];

  const typeIcon = (type: string) => {
    if (type === 'warning') return '⚠️';
    if (type === 'emergency') return '🚨';
    return '🔔';
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Bus Arrival Notifications"
        description="Receive alerts about bus arrivals and route updates"
        badge={config.title}
      />

      {dismissedId && (
        <AlertBanner type="success" message="Notification dismissed successfully." />
      )}

      <div className="filter-bar">
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          accentClass={config.navActive}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search notifications..."
          className="w-full sm:max-w-xs"
        />
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <EmptyState
            icon="🔔"
            title="No notifications"
            description={
              activeTab === 'unread'
                ? 'You have read all your notifications.'
                : search
                  ? 'No notifications match your search.'
                  : 'You have no bus or route notifications at this time.'
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              interactive
              className={!notification.read ? `border-l-4 ${config.accentBorder.replace('border-', 'border-l-')}` : ''}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.accentBg} text-xl`}>
                    {typeIcon(notification.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className={`badge ${config.accentBg} ${config.accent} ring-1 ${config.accentBorder}`}>
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{notification.message}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{notification.createdAt}</p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className={`btn-secondary shrink-0 text-xs ${config.accent}`}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
