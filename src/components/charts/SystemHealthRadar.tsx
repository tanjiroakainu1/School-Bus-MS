import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Card from '../shared/Card';
import { systemHealthData } from '../../data/chartData';
import { CHART_COLORS, CHART_TOOLTIP, CHART_HEIGHT_COMPACT } from './chartTheme';

export default function SystemHealthRadar() {
  return (
    <Card title="System Health Score" subtitle="Real-time performance metrics">
      <div className={CHART_HEIGHT_COMPACT}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={systemHealthData}>
            <PolarGrid stroke={CHART_COLORS.grid} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Radar name="Score" dataKey="score" stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.35} strokeWidth={2} />
            <Tooltip contentStyle={CHART_TOOLTIP} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {systemHealthData.map((item) => (
          <span key={item.metric} className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200">
            {item.metric}: {item.score}%
          </span>
        ))}
      </div>
    </Card>
  );
}
