import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../shared/Card';
import { hourlyActivityData } from '../../data/chartData';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_AXIS_TICK_SM, CHART_HEIGHT } from './chartTheme';

interface HourlyActivityChartProps {
  title?: string;
  subtitle?: string;
}

export default function HourlyActivityChart({
  title = 'Live Hourly Activity',
  subtitle = 'Buses on route & students transported today',
}: HourlyActivityChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={hourlyActivityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="hour" tick={CHART_AXIS_TICK_SM} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Bar yAxisId="left" dataKey="buses" name="Active Buses" fill={CHART_COLORS.blue} radius={[6, 6, 0, 0]} barSize={32} />
            <Line yAxisId="right" type="monotone" dataKey="students" name="Students" stroke={CHART_COLORS.amber} strokeWidth={3} dot={{ fill: CHART_COLORS.amber, r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
