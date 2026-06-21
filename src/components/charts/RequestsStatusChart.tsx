import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../shared/Card';
import type { FleetSlice } from '../../utils/chartHelpers';
import { CHART_TOOLTIP, CHART_HEIGHT_COMPACT } from './chartTheme';

interface RequestsStatusChartProps {
  data: FleetSlice[];
  title?: string;
  subtitle?: string;
}

export default function RequestsStatusChart({
  data,
  title = 'Transportation Requests',
  subtitle = 'Pending, approved & rejected breakdown',
}: RequestsStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT_COMPACT}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius="40%"
              outerRadius="65%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-sm font-semibold text-slate-600">{total} total requests</p>
    </Card>
  );
}
