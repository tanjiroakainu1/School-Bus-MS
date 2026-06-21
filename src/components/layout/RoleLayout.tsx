import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DeveloperCredit from '../shared/DeveloperCredit';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { roleConfigs } from '../../config/roles';
import type { UserRole } from '../../types';

export default function RoleLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const config = user ? roleConfigs[user.role as UserRole] : null;

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!config) return null;

  const handleMenuOpen = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-slate-50">
      <div className="relative z-10 flex min-h-screen min-h-[100dvh]">
        <Sidebar
          config={config}
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div
          className={`flex min-h-screen min-h-[100dvh] min-w-0 flex-1 flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <Header onMenuOpen={handleMenuOpen} sidebarCollapsed={sidebarCollapsed} />
          <main className="safe-bottom flex-1 px-3 py-4 2xs:px-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl min-w-0">
              <Outlet />
              <div className="mt-8 border-t border-slate-200 pt-5 sm:mt-10 sm:pt-6">
                <DeveloperCredit variant="role-footer" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
