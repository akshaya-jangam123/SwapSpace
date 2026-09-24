import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'completed'
    | 'cancelled';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-semibold',
  };

  const variantClasses = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    secondary: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    success: 'bg-green-50 text-green-700 border border-green-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-800 border border-rose-200',
    completed: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    cancelled: 'bg-slate-100 text-slate-600 border border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide capitalize ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
