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
    <div className={`min-w-0 ${interactive ? 'card-interactive' : 'card'} ${noPadding ? '!p-0' : ''} ${className}`}>
      {(title || action) && (
        <div className={`mb-4 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-3 ${noPadding ? 'px-4 pt-4 2xs:px-5 2xs:pt-5 sm:px-6 sm:pt-6' : ''}`}>
          <div className="min-w-0">
            {title && <h3 className="section-title">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{subtitle}</p>}
          </div>
          {action && <div className="page-actions shrink-0 sm:!flex-row">{action}</div>}
        </div>
      )}
      <div className={`min-w-0 ${noPadding && (title || action) ? 'px-4 pb-4 2xs:px-5 2xs:pb-5 sm:px-6 sm:pb-6' : ''}`}>{children}</div>
    </div>
  );
}
