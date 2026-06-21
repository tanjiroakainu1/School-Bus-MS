interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: string;
}

export default function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-3 2xs:gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1 animate-slide-up">
        {badge && (
          <span className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 2xs:px-3 2xs:text-xs">
            {badge}
          </span>
        )}
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 2xs:text-2xl sm:text-3xl lg:text-4xl lg:text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500 2xs:mt-2 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="page-actions shrink-0">{action}</div>
      )}
    </div>
  );
}
