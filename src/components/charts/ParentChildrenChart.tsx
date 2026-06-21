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
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_AXIS_TICK_SM, CHART_HEIGHT_COMPACT } from './chartTheme';

interface ChildAttendanceRow {
  name: string;
  present: number;
  absent: number;
  fill: string;
}

interface ParentChildrenChartProps {
  data: ChildAttendanceRow[];
  title?: string;
  subtitle?: string;
}

export default function ParentChildrenChart({
  data,
  title = 'Attendance by Child',
  subtitle = 'Present vs absent records per student',
}: ParentChildrenChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className={CHART_HEIGHT_COMPACT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="name" tick={CHART_AXIS_TICK_SM} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Legend />
            <Bar dataKey="present" name="Present" stackId="a" fill={CHART_COLORS.teal} radius={[0, 0, 0, 0]} />
            <Bar dataKey="absent" name="Absent" stackId="a" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CHART_COLORS.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
