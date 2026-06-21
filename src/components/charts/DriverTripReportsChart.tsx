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
import type { TripReportRow } from '../../utils/chartHelpers';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_AXIS_TICK_SM, CHART_HEIGHT } from './chartTheme';

interface DriverTripReportsChartProps {
  data: TripReportRow[];
  title?: string;
  subtitle?: string;
}

export default function DriverTripReportsChart({
  data,
  title = 'Trip Report Analytics',
  subtitle = 'Passengers transported per trip',
}: DriverTripReportsChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="label" tick={CHART_AXIS_TICK_SM} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Bar yAxisId="left" dataKey="passengers" name="Passengers" fill={CHART_COLORS.amber} radius={[6, 6, 0, 0]} barSize={28} />
            <Line yAxisId="right" type="monotone" dataKey="completed" name="On Time" stroke={CHART_COLORS.teal} strokeWidth={3} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="delayed" name="Delayed" stroke={CHART_COLORS.red} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
