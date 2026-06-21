import { Link } from 'react-router-dom';
import DeveloperCredit from '../components/shared/DeveloperCredit';
import NavIcon from '../components/shared/NavIcon';
import { roleAccounts, roleIcons, DEFAULT_DEMO_PASSWORD } from '../data/authAccounts';
import { systemFlowSteps, systemFeatures, roleSummaries } from '../data/systemInfo';
import { roleConfigs } from '../config/roles';
import { DEMO_GRADIENTS, THEME } from '../config/theme';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-200">
            Safe · Smart · Connected
          </span>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            School Bus{' '}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
            A complete platform for schools to manage buses, drivers, routes, student transportation,
            attendance, and schedules — with dedicated dashboards for every role.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 xs:flex-row">
            <Link to="/register" className="btn-primary w-full min-w-[200px] !py-3.5 text-base xs:w-auto">
              Create Account →
            </Link>
            <Link to="/login" className="btn-secondary w-full min-w-[200px] !border-white/20 !bg-white/10 !py-3.5 !text-white hover:!bg-white/20 xs:w-auto">
              Sign In
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-300/80">
            4 roles · Demo password: <span className="font-bold text-amber-400">{DEFAULT_DEMO_PASSWORD}</span>
          </p>
        </div>
      </section>

      {/* System flow */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How the System Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200/80">
              From first visit to daily operations — here is the complete flow for every user in the system.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {systemFlowSteps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < systemFlowSteps.length - 1 && (
                  <div className="absolute -right-3 top-12 hidden h-0.5 w-6 bg-blue-500/40 lg:block" />
                )}
                <div className="card-interactive h-full !border-slate-500/20 !bg-white/95 !backdrop-blur-xl">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-500/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex min-w-[600px] items-center justify-between gap-2 text-center text-xs font-bold text-slate-200 sm:min-w-0 sm:text-sm">
              {['Visit Home', 'Login / Register', 'Role Dashboard', 'Sidebar Nav', 'Manage & Report'].map((label, i, arr) => (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white shadow-lg">
                      {i + 1}
                    </div>
                    <span className="max-w-[80px] leading-tight">{label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="mx-1 hidden h-0.5 flex-1 bg-slate-500/50 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Four Roles, One System</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200/80">
              Each role has its own dashboard, sidebar navigation, and tailored features.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {roleSummaries.map((role) => {
              const account = roleAccounts.find((a) => a.role === role.role);
              const config = roleConfigs[role.role];
              return (
                <div
                  key={role.role}
                  className="card-interactive overflow-hidden !border-slate-500/20 !bg-white/95 !p-0"
                >
                  <div className={`bg-gradient-to-r ${role.gradient} px-6 py-5 text-white`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{role.title}</h3>
                        {account && (
                          <p className="text-sm text-white/80">Demo: {account.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-teal-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {config.navItems.slice(0, 4).map((item) => (
                        <span
                          key={item.path}
                          className={`badge inline-flex items-center gap-1.5 ${config.accentBg} ${role.accent} ring-1 ${config.accentBorder}`}
                        >
                          <NavIcon name={item.icon} size="sm" />
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System features */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">System Features</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200/80">
              Everything schools need for safe and efficient student transportation.
            </p>
          </div>

          <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
            {systemFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-500/15 bg-white/10 p-5 backdrop-blur-sm transition hover:border-blue-400/30 hover:bg-white/15"
              >
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-3 font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-200/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer showcase */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <DeveloperCredit variant="home-showcase" />
        </div>
      </section>

      {/* Quick demo CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`hero-banner bg-gradient-to-br ${THEME.manager.gradient}`}>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to explore?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                Sign in with any demo account or register a new user. Each role opens its own dashboard instantly.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {roleAccounts.map((account) => (
                  <Link
                    key={account.role}
                    to="/login"
                    state={{ quickRole: account.role }}
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${DEMO_GRADIENTS[account.role]} text-lg`}>
                      {roleIcons[account.role]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{account.name}</p>
                      <p className="truncate text-xs text-white/70">{roleConfigs[account.role].title}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 xs:flex-row">
                <Link to="/login" className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50">
                  Go to Sign In →
                </Link>
                <Link to="/register" className="rounded-xl border border-white/30 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
