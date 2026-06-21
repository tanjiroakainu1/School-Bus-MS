import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, getRoleDashboardPath } from '../context/AuthContext';
import { roleConfigs } from '../config/roles';
import { DEMO_GRADIENTS, THEME } from '../config/theme';
import {
  DEFAULT_DEMO_PASSWORD,
  roleAccounts,
  roleIcons,
} from '../data/authAccounts';
import AlertBanner from '../components/shared/AlertBanner';
import DeveloperCredit from '../components/shared/DeveloperCredit';
import FormField from '../components/shared/FormField';
import type { UserRole } from '../types';

type AuthMode = 'login' | 'register';

interface LocationState {
  quickRole?: UserRole;
}

export default function Login() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const isRegisterRoute = location.pathname === '/register';

  const [mode, setMode] = useState<AuthMode>(isRegisterRoute ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super-admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, quickLoginAsRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(isRegisterRoute ? 'register' : 'login');
  }, [isRegisterRoute]);

  useEffect(() => {
    if (state?.quickRole) {
      const account = roleAccounts.find((a) => a.role === state.quickRole);
      if (account) {
        setEmail(account.email);
        setPassword(account.password);
        setSelectedRole(account.role);
        setMode('login');
      }
    }
  }, [state?.quickRole]);

  const goToDashboard = (role: UserRole) => {
    navigate(getRoleDashboardPath(role));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = login(email, password);
    if (result.success && result.user) {
      goToDashboard(result.user.role);
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = register(name, email, password, confirmPassword, selectedRole);
    if (result.success && result.user) {
      setSuccess('Account created! Redirecting to your dashboard...');
      setTimeout(() => goToDashboard(result.user!.role), 800);
    } else {
      setError(result.error ?? 'Registration failed.');
    }
  };

  const fillCredentials = (accountEmail: string, accountPassword: string, role: UserRole) => {
    setMode('login');
    navigate('/login');
    setEmail(accountEmail);
    setPassword(accountPassword);
    setSelectedRole(role);
    setError('');
    setSuccess('Credentials filled — click Sign In or press Enter.');
  };

  const enterDashboard = (role: UserRole) => {
    setError('');
    setSuccess('');
    const result = quickLoginAsRole(role);
    if (result.success) {
      goToDashboard(role);
    } else {
      setError(result.error ?? 'Quick access failed.');
    }
  };

  const switchMode = (next: AuthMode) => {
    navigate(next === 'register' ? '/register' : '/login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-2xl animate-slide-up">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            ← Back to Home
          </Link>
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${THEME.public.logo} text-4xl shadow-2xl ${THEME.public.logoShadow}`}>
            🚌
          </div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            {mode === 'login'
              ? 'Access your role dashboard with email and password'
              : 'Register for any of the 4 system roles'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-500/20 bg-white/95 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex rounded-2xl bg-slate-50/80 p-1 ring-1 ring-slate-200">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              Register
            </button>
          </div>

          {error && <div className="mb-4"><AlertBanner type="warning" message={error} /></div>}
          {success && <div className="mb-4"><AlertBanner type="success" message={success} /></div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <FormField label="Email address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@school.edu"
                  required
                />
              </FormField>
              <FormField label="Password" hint={`Demo accounts use password: ${DEFAULT_DEMO_PASSWORD}`}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </FormField>
              <button type="submit" className="btn-primary w-full !py-3.5 text-base">
                Sign In →
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <FormField label="Full name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                  required
                />
              </FormField>
              <FormField label="Email address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@school.edu"
                  required
                />
              </FormField>
              <FormField label="Role">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="input-field"
                >
                  {Object.values(roleConfigs).map((config) => (
                    <option key={config.role} value={config.role}>{config.title}</option>
                  ))}
                </select>
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Password">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Min. 6 characters"
                    required
                  />
                </FormField>
                <FormField label="Confirm password">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Repeat password"
                    required
                  />
                </FormField>
              </div>
              <button type="submit" className="btn-primary w-full !py-3.5 text-base">
                Create Account →
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-100 pt-8">
            <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Quick access — all roles
            </p>
            <p className="mb-5 text-center text-xs text-slate-500">
              Pre-loaded demo accounts · password: <span className="font-bold text-blue-700">{DEFAULT_DEMO_PASSWORD}</span>
            </p>

            <div className="space-y-3">
              {roleAccounts.map((account) => {
                const config = roleConfigs[account.role];
                return (
                  <div
                    key={account.role}
                    className="rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/30 p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${DEMO_GRADIENTS[account.role]} text-xl text-white shadow-md`}>
                          {roleIcons[account.role]}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold uppercase tracking-wide ${config.accent}`}>
                            {config.title}
                          </p>
                          <p className="font-bold text-slate-900">{account.name}</p>
                          <p className="truncate text-sm text-slate-500">{account.email}</p>
                          <p className="mt-1 hidden text-xs text-slate-400 sm:block">{account.description}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 xs:flex-row sm:flex-col lg:flex-row">
                        <button
                          type="button"
                          onClick={() => fillCredentials(account.email, account.password, account.role)}
                          className="btn-secondary !min-h-[40px] whitespace-nowrap !px-4 !py-2 text-xs"
                        >
                          Use Credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => enterDashboard(account.role)}
                          className="btn-primary !min-h-[40px] whitespace-nowrap !px-4 !py-2 text-xs"
                        >
                          Enter Dashboard →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DeveloperCredit variant="login-strip" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
