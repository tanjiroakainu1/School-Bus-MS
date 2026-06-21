import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import Card from '../shared/Card';
import { routeCapacityData } from '../../data/chartData';
import type { RouteCapacityRow } from '../../utils/chartHelpers';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_AXIS_TICK_SM, CHART_HEIGHT } from './chartTheme';

interface RouteCapacityChartProps {
  data?: RouteCapacityRow[];
  title?: string;
  subtitle?: string;
}

export default function RouteCapacityChart({
  data,
  title = 'Route Capacity Analysis',
  subtitle = 'Passengers vs bus capacity by route',
}: RouteCapacityChartProps) {
  const chartData = data ?? routeCapacityData;

  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="route" tick={CHART_AXIS_TICK_SM} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Bar dataKey="capacity" name="Capacity" fill={CHART_COLORS.slate} radius={[6, 6, 0, 0]} opacity={0.4} />
            <Bar dataKey="passengers" name="Passengers" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.route}
                  fill={entry.utilization >= 85 ? CHART_COLORS.amber : CHART_COLORS.blue}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
