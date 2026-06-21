import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import { useData } from '../../context/DataContext';
import { roleConfigs } from '../../config/roles';

export default function RouteNotifications() {
  const config = roleConfigs['bus-driver'];
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const typeIcon: Record<string, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    emergency: '🚨',
  };

  const typeBadge: Record<string, string> = {
    info: 'scheduled',
    warning: 'delayed',
    success: 'success',
    emergency: 'high',
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-shell">
      <PageHeader
        badge={config.title}
        title="Route Notifications"
        description="Receive route updates, alerts, and emergency notices"
        action={
          unreadCount > 0 ? (
            <button onClick={markAllNotificationsRead} className="btn-secondary">
              Mark All Read ({unreadCount})
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon="🔔"
            title="No notifications"
            description="You're all caught up. New route alerts will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              interactive
              className={!notification.read ? `border-l-4 ${config.accentBorder}` : ''}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{typeIcon[notification.type]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </h3>
                        <StatusBadge status={typeBadge[notification.type] ?? 'pending'} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{notification.message}</p>
                      <p className="mt-2 text-xs text-slate-400">{notification.createdAt}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationRead(notification.id)}
                        className={`shrink-0 text-sm font-semibold ${config.accent} hover:opacity-80`}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
