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
    <div className="grid grid-cols-2 gap-2.5 min-w-0 2xs:gap-3 xs:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] 2xs:gap-3 2xs:rounded-2xl 2xs:p-4 sm:p-5 ${accentBorder}`}
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 2xs:h-11 2xs:w-11 2xs:rounded-2xl sm:h-12 sm:w-12 ${accentBg}`}>
            <NavIcon name={item.icon} size="lg" className={iconClassName} />
          </div>
          <span className="line-clamp-2 text-[10px] font-bold leading-tight text-slate-700 2xs:text-xs sm:text-sm">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
