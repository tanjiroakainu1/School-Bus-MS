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
import { weeklyTripsData } from '../../data/chartData';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_HEIGHT } from './chartTheme';

interface WeeklyTripsChartProps {
  title?: string;
  subtitle?: string;
}

export default function WeeklyTripsChart({
  title = 'Weekly Trip Performance',
  subtitle = 'On-time vs delayed trips this week',
}: WeeklyTripsChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyTripsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="delayedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="day" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Area type="monotone" dataKey="onTime" name="On Time" stroke={CHART_COLORS.teal} fill="url(#onTimeGrad)" strokeWidth={3} />
            <Area type="monotone" dataKey="delayed" name="Delayed" stroke={CHART_COLORS.amber} fill="url(#delayedGrad)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
