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
    <div className="relative min-h-screen bg-slate-50">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          config={config}
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <Header onMenuOpen={handleMenuOpen} sidebarCollapsed={sidebarCollapsed} />
          <main className="flex-1 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
              <div className="mt-10 border-t border-slate-200 pt-6">
                <DeveloperCredit variant="role-footer" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
