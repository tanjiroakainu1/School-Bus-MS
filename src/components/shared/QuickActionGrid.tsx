import { Link } from 'react-router-dom';
import NavIcon from './NavIcon';
import type { NavItem } from '../../types';

interface QuickActionGridProps {
  items: NavItem[];
  accentBorder?: string;
  accentBg?: string;
  iconClassName?: string;
}

export default function QuickActionGrid({
  items,
  accentBorder = 'hover:border-blue-200 hover:bg-blue-50',
  accentBg = 'bg-slate-50',
  iconClassName = 'text-slate-600',
}: QuickActionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xs:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 ${accentBorder}`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${accentBg}`}>
            <NavIcon name={item.icon} size="lg" className={iconClassName} />
          </div>
          <span className="text-xs font-bold leading-tight text-slate-700 sm:text-sm">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
