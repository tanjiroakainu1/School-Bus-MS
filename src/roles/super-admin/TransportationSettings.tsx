import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import FormField from '../../components/shared/FormField';
import { useData } from '../../context/DataContext';
import { THEME } from '../../config/theme';

export default function TransportationSettings() {
  const { settings, patchSettings } = useData();

  return (
    <div className="page-shell">
      <PageHeader
        badge="Super Admin"
        title="Transportation Settings"
        description="Changes save automatically when you edit a field"
      />

      <div className="content-grid">
        <Card title="General Settings">
          <div className="space-y-4">
            <FormField label="School Name">
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => patchSettings({ schoolName: e.target.value })}
                className="input-field"
              />
            </FormField>
            <FormField label="Max Bus Capacity" hint="Maximum passengers per bus">
              <input
                type="number"
                value={settings.maxBusCapacity}
                onChange={(e) => patchSettings({ maxBusCapacity: Number(e.target.value) })}
                className="input-field"
              />
            </FormField>
            <FormField label="Emergency Contact">
              <input
                type="tel"
                value={settings.emergencyContact}
                onChange={(e) => patchSettings({ emergencyContact: e.target.value })}
                className="input-field"
              />
            </FormField>
          </div>
        </Card>

        <Card title="Operating Hours">
          <div className="space-y-4">
            <FormField label="Start Time">
              <input
                type="time"
                value={settings.operatingHoursStart}
                onChange={(e) => patchSettings({ operatingHoursStart: e.target.value })}
                className="input-field"
              />
            </FormField>
            <FormField label="End Time">
              <input
                type="time"
                value={settings.operatingHoursEnd}
                onChange={(e) => patchSettings({ operatingHoursEnd: e.target.value })}
                className="input-field"
              />
            </FormField>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={settings.notificationEnabled}
                onChange={(e) => patchSettings({ notificationEnabled: e.target.checked })}
                className={`h-4 w-4 rounded border-slate-300 ${THEME.superAdmin.accent} ${THEME.brand.ring}`}
              />
              <span className="text-sm font-medium text-slate-700">Enable notifications</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => patchSettings({ autoBackup: e.target.checked })}
                className={`h-4 w-4 rounded border-slate-300 ${THEME.superAdmin.accent} ${THEME.brand.ring}`}
              />
              <span className="text-sm font-medium text-slate-700">Automatic daily backup</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
