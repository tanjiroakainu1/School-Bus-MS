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
      <div className="flex h-14 min-w-0 items-center justify-between gap-2 px-2 2xs:gap-3 2xs:px-3 sm:h-16 sm:px-6 lg:h-[4.5rem]">
        <div className="flex min-w-0 flex-1 items-center gap-2 2xs:gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col items-center justify-center gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-xs font-extrabold text-slate-900 2xs:text-sm">School Bus MS</p>
            <p className={`truncate text-[10px] font-semibold 2xs:text-xs ${config.accent}`}>{config.title}</p>
          </div>

          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-bold text-slate-500">
              {sidebarCollapsed ? config.title : 'Dashboard'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 2xs:gap-2 sm:gap-3">
          <div className="hidden min-w-0 text-right md:block">
            <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
            <p className="max-w-[140px] truncate text-xs text-slate-500 lg:max-w-[180px]">{user.email}</p>
          </div>
          <div className={`hidden h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white sm:flex lg:h-10 lg:w-10 ${config.color}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            className="btn-secondary !min-h-[40px] !w-auto !px-2.5 !py-2 text-xs 2xs:!px-3 sm:!px-4"
            aria-label="Logout"
          >
            <span className="hidden 2xs:inline">Logout</span>
            <span className="2xs:hidden">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
