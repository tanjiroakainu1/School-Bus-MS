import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../shared/Card';
import type { AttendanceWeekRow } from '../../utils/chartHelpers';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_HEIGHT } from './chartTheme';

interface ParentAttendanceChartProps {
  data: AttendanceWeekRow[];
  title?: string;
  subtitle?: string;
}

export default function ParentAttendanceChart({
  data,
  title = 'Children Attendance Trend',
  subtitle = 'Boarding & drop-off records over recent days',
}: ParentAttendanceChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.45} />
                <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.35} />
                <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="day" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Area type="monotone" dataKey="present" name="Present" stroke={CHART_COLORS.teal} fill="url(#presentGrad)" strokeWidth={3} />
            <Area type="monotone" dataKey="absent" name="Absent" stroke={CHART_COLORS.red} fill="url(#absentGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
