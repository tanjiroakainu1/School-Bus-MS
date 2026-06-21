interface AlertBannerProps {
  type?: 'success' | 'info' | 'warning';
  message: string;
}

export default function AlertBanner({ type = 'success', message }: AlertBannerProps) {
  const styles = {
    success: 'border-teal-200 bg-teal-50 text-teal-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
  };

  const icons = { success: '✓', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className={`animate-slide-up rounded-xl border px-4 py-3 text-sm font-medium ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {message}
    </div>
  );
}
