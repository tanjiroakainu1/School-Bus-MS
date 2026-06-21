import NavIcon from './NavIcon';
import { DEVELOPER } from '../../config/developer';

type DeveloperCreditVariant = 'public-footer' | 'sidebar' | 'sidebar-mini' | 'role-footer' | 'home-showcase' | 'login-strip';

interface DeveloperCreditProps {
  variant?: DeveloperCreditVariant;
  className?: string;
}

function DeveloperAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-xl',
  };

  return (
    <div
      className={`developer-avatar ${sizes[size]} shrink-0`}
      title={DEVELOPER.name}
      aria-hidden
    >
      <span className="font-extrabold tracking-tight">{DEVELOPER.initials}</span>
    </div>
  );
}

export default function DeveloperCredit({ variant = 'role-footer', className = '' }: DeveloperCreditProps) {
  if (variant === 'sidebar-mini') {
    return (
      <div className={`flex justify-center py-2 ${className}`} title={`${DEVELOPER.name} · ${DEVELOPER.role}`}>
        <DeveloperAvatar size="sm" />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`developer-card-sidebar ${className}`}>
        <DeveloperAvatar size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Developer</p>
          <p className="truncate text-sm font-extrabold text-slate-900">{DEVELOPER.name}</p>
          <p className="truncate text-xs text-slate-500">{DEVELOPER.role}</p>
        </div>
        <span className="developer-sparkle shrink-0 text-sm" aria-hidden>✦</span>
      </div>
    );
  }

  if (variant === 'public-footer') {
    return (
      <div className={`developer-card-public ${className}`}>
        <DeveloperAvatar />
        <div className="min-w-0 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
            Designed & Developed by
          </p>
          <p className="bg-gradient-to-r from-blue-300 via-teal-300 to-amber-300 bg-clip-text text-lg font-extrabold text-transparent">
            {DEVELOPER.name}
          </p>
          <p className="text-xs text-slate-400">{DEVELOPER.title}</p>
        </div>
        <div className="hidden flex-wrap gap-1.5 sm:flex">
          {DEVELOPER.skills.map((skill) => (
            <span key={skill} className="developer-skill-badge">{skill}</span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'login-strip') {
    return (
      <div className={`developer-card-login ${className}`}>
        <DeveloperAvatar size="sm" />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Built by</p>
          <p className="text-sm font-extrabold text-slate-800">{DEVELOPER.name}</p>
          <p className="text-xs text-slate-500">{DEVELOPER.tagline}</p>
        </div>
      </div>
    );
  }

  if (variant === 'home-showcase') {
    return (
      <section className={`developer-showcase ${className}`}>
        <div className="developer-showcase-glow" aria-hidden />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="mx-auto lg:mx-0">
            <DeveloperAvatar size="lg" />
          </div>
          <div className="text-center lg:text-left">
            <span className="developer-pill">✦ Meet the Developer ✦</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {DEVELOPER.name}
            </h2>
            <p className="mt-2 text-lg font-semibold text-blue-300">{DEVELOPER.title}</p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300/90 lg:mx-0 sm:text-base">
              {DEVELOPER.quote}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {DEVELOPER.skills.map((skill) => (
                <span key={skill} className="developer-skill-badge-light">{skill}</span>
              ))}
            </div>
            <p className="mt-6 text-xs font-medium text-slate-500">
              School Bus Management System · © {DEVELOPER.year}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // role-footer (default)
  return (
    <div className={`developer-card-role ${className}`}>
      <DeveloperAvatar size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Developed by <span className="text-blue-600">{DEVELOPER.name}</span>
        </p>
        <p className="truncate text-xs text-slate-500">{DEVELOPER.tagline}</p>
      </div>
      <span className="hidden opacity-50 sm:inline" aria-hidden>
        <NavIcon name="bus" size="sm" />
      </span>
    </div>
  );
}
