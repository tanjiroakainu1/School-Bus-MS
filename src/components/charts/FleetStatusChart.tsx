import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../shared/Card';
import { busFleetStatusData } from '../../data/chartData';
import type { FleetSlice } from '../../utils/chartHelpers';
import { CHART_TOOLTIP, CHART_HEIGHT_COMPACT } from './chartTheme';

interface FleetStatusChartProps {
  data?: FleetSlice[];
  title?: string;
  subtitle?: string;
}

export default function FleetStatusChart({
  data,
  title = 'Bus Fleet Status',
  subtitle,
}: FleetStatusChartProps) {
  const chartData = data ?? busFleetStatusData;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const resolvedSubtitle = subtitle ?? `${total} total buses in fleet`;

  return (
    <Card title={title} subtitle={resolvedSubtitle}>
      <div className={CHART_HEIGHT_COMPACT}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend
              verticalAlign="bottom"
              formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={`mt-2 grid gap-2 text-center ${chartData.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {chartData.map((item) => (
          <div key={item.name} className="rounded-xl bg-slate-50 p-2">
            <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs text-slate-500">{item.name}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
