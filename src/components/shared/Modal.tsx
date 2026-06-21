import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col ${sizeClass} overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-scale-in sm:max-h-[90vh] sm:rounded-3xl`}
        role="dialog"
        aria-modal
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 2xs:px-5 sm:px-6 sm:py-5">
          <h2 className="min-w-0 flex-1 text-lg font-bold tracking-tight text-slate-900 2xs:text-xl sm:text-2xl">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="safe-bottom min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 2xs:px-5 sm:px-6 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
