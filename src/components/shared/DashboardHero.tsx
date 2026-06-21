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
      <div className="relative z-10 flex flex-col gap-4 min-w-0 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70 2xs:text-xs sm:text-sm">
            {config.title}
          </p>
          <h1 className="mt-1.5 text-balance text-xl font-extrabold tracking-tight 2xs:mt-2 2xs:text-2xl sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/85 2xs:mt-3 2xs:text-sm sm:text-base">
            {subtitle}
          </p>
        </div>
        {stats && (
          <div className="flex shrink-0 flex-wrap gap-2 2xs:gap-3">
            {stats}
          </div>
        )}
      </div>
    </div>
  );
}
