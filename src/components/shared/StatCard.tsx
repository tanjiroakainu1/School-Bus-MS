interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'from-blue-600 to-blue-800',
  trend,
}: StatCardProps) {
  return (
    <div className="card-interactive group">
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-2xl text-white shadow-sm`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-teal-600">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
}
