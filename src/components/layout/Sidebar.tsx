import { NavLink } from 'react-router-dom';
import DeveloperCredit from '../shared/DeveloperCredit';
import NavIcon from '../shared/NavIcon';
import { useAuth } from '../../context/AuthContext';
import type { RoleConfig } from '../../types';

interface SidebarProps {
  config: RoleConfig;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ config, isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? config.navActive
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white shadow-lg transition-all duration-300 ease-in-out lg:z-30 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'w-[min(100vw,18rem)] max-w-[85vw] lg:w-64'}`}
        aria-label="Sidebar navigation"
      >
        <div className={`flex items-center border-b border-slate-200 p-4 ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-sm`}>
              <NavIcon name="bus" size="md" className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">School Bus MS</p>
                <p className={`truncate text-xs font-semibold ${config.accent}`}>{config.title}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 lg:hidden"
            aria-label="Close menu"
          >
            <NavIcon name="close" size="sm" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 lg:flex ${isCollapsed ? 'lg:absolute lg:right-2 lg:top-4' : ''}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <NavIcon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size="sm" />
          </button>
        </div>

        {user && !isCollapsed && (
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${config.color}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {config.navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === config.basePath}
                  className={navLinkClass}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                >
                  <NavIcon name={item.icon} size="md" className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`border-t border-slate-200 p-3 ${isCollapsed ? 'lg:px-2' : ''}`}>
          {isCollapsed ? (
            <DeveloperCredit variant="sidebar-mini" />
          ) : (
            <DeveloperCredit variant="sidebar" className="mb-3" />
          )}
          <button
            type="button"
            onClick={() => { onClose(); logout(); }}
            className={`flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${
              isCollapsed ? 'lg:justify-center lg:px-2' : ''
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <NavIcon name="logout" size="md" className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
