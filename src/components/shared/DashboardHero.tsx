import type { ReactNode } from 'react';
import type { RoleConfig } from '../../types';

interface DashboardHeroProps {
  config: RoleConfig;
  title: string;
  subtitle: string;
  stats?: ReactNode;
}

export default function DashboardHero({ config, title, subtitle, stats }: DashboardHeroProps) {
  return (
    <div className={`hero-banner bg-gradient-to-br ${config.gradient}`}>
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
            {config.title}
          </p>
          <h1 className="mt-2 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {subtitle}
          </p>
        </div>
        {stats && (
          <div className="flex shrink-0 flex-wrap gap-3">
            {stats}
          </div>
        )}
      </div>
    </div>
  );
}
