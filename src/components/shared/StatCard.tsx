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
    <div className="card-interactive group min-w-0">
      <div className="flex items-start gap-3 2xs:gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg text-white shadow-sm 2xs:h-12 2xs:w-12 2xs:rounded-2xl 2xs:text-xl sm:h-14 sm:w-14 sm:text-2xl ${color}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-500 2xs:text-sm">{label}</p>
          <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 2xs:mt-1 2xs:text-2xl sm:text-3xl">
            {value}
          </p>
          {trend && (
            <p className="mt-0.5 truncate text-[10px] font-medium text-teal-600 2xs:mt-1 2xs:text-xs">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
}
