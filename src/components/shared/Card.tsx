import { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  interactive?: boolean;
  noPadding?: boolean;
}

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  action,
  interactive = false,
  noPadding = false,
}: CardProps) {
  return (
    <div className={`${interactive ? 'card-interactive' : 'card'} ${noPadding ? '!p-0' : ''} ${className}`}>
      {(title || action) && (
        <div className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${noPadding ? 'px-5 pt-5 sm:px-6 sm:pt-6' : ''}`}>
          <div>
            {title && <h3 className="section-title">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding && (title || action) ? 'px-5 pb-5 sm:px-6 sm:pb-6' : ''}>{children}</div>
    </div>
  );
}
