const statusStyles: Record<string, string> = {
  active: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  inactive: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  maintenance: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  approved: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  rejected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  present: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  absent: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  completed: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  delayed: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  open: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'in-progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  resolved: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  success: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  low: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  high: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  available: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  'on-route': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'off-duty': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  backup: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  restore: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  return (
    <span className={`badge capitalize ${style} ${className}`}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}
