import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '../shared/Card';
import { usersByRoleData } from '../../data/chartData';
import { CHART_COLORS, CHART_TOOLTIP, CHART_AXIS_TICK, CHART_AXIS_TICK_SM, CHART_HEIGHT_COMPACT } from './chartTheme';

export default function UsersByRoleChart() {
  return (
    <Card title="Users by Role" subtitle="Registered users across all system roles">
      <div className={CHART_HEIGHT_COMPACT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usersByRoleData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
            <XAxis type="number" tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="role" tick={CHART_AXIS_TICK_SM} width={90} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
            <Bar dataKey="count" name="Users" radius={[0, 6, 6, 0]} barSize={28}>
              {usersByRoleData.map((entry) => (
                <Cell key={entry.role} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
