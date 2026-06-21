import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import DeveloperCredit from '../shared/DeveloperCredit';
import { THEME } from '../../config/theme';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/login', label: 'Sign In', end: true },
  { to: '/register', label: 'Register', end: true },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${THEME.public.bg}`}>
      <div className="pointer-events-none fixed inset-0 bg-slate-mesh" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${THEME.public.logo} text-lg shadow-md ${THEME.public.logoShadow}`}>
                🚌
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="text-sm font-extrabold text-white">School Bus MS</p>
                <p className="text-xs text-slate-400">Management System</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/login" className="btn-primary !min-h-[40px] !px-5 !py-2 text-sm">
                Get Started
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          <div
            className={`overflow-hidden border-t border-white/10 bg-slate-900/95 transition-all duration-300 md:hidden ${
              menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-semibold ${
                      isActive ? 'bg-white/10 text-white' : 'text-slate-300'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 text-center text-sm">
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-white/10 bg-slate-900/80">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <DeveloperCredit variant="public-footer" className="mb-8" />
            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${THEME.public.logo} text-sm`}>
                  🚌
                </div>
                <p className="text-sm text-slate-400">
                  © {new Date().getFullYear()} School Bus Management System
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/" className="text-slate-400 transition hover:text-white">Home</Link>
                <Link to="/login" className="text-slate-400 transition hover:text-white">Sign In</Link>
                <Link to="/register" className="text-slate-400 transition hover:text-white">Register</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
