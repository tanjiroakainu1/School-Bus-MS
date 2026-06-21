import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../shared/Card';
import { monthlyAttendanceData } from '../../data/chartData';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_HEIGHT } from './chartTheme';

interface AttendanceTrendChartProps {
  title?: string;
  subtitle?: string;
}

export default function AttendanceTrendChart({
  title = 'Attendance Trend',
  subtitle = 'Monthly boarding attendance rate (%)',
}: AttendanceTrendChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="month" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Line type="monotone" dataKey="present" name="Present %" stroke={CHART_COLORS.teal} strokeWidth={3} dot={{ fill: CHART_COLORS.teal, r: 5 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="absent" name="Absent %" stroke={CHART_COLORS.red} strokeWidth={2} strokeDasharray="5 5" dot={{ fill: CHART_COLORS.red, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
