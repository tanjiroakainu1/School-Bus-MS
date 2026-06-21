import { useAuth } from '../../context/AuthContext';
import { roleConfigs } from '../../config/roles';
import type { UserRole } from '../../types';

interface HeaderProps {
  onMenuOpen: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ onMenuOpen, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const config = roleConfigs[user.role as UserRole];

  return (
    <header className="glass-header sticky top-0 z-20">
      <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-6 lg:h-[4.5rem]">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col items-center justify-center gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-extrabold text-slate-900">School Bus MS</p>
            <p className={`truncate text-xs font-semibold ${config.accent}`}>{config.title}</p>
          </div>

          <div className="hidden min-w-0 lg:block">
            <p className="text-sm font-bold text-slate-500">
              {sidebarCollapsed ? config.title : 'Dashboard'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="max-w-[160px] truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <div className={`hidden h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white sm:flex ${config.color}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="btn-secondary !min-h-[40px] !px-3 !py-2 text-xs sm:!px-4">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
