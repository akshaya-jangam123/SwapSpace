import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 shadow-sm ${className}`}
        onError={(e) => {
          // Fallback to initial on image error
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // Consistent background color based on name hash
  const colors = [
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-teal-500',
  ];
  const charCode = (name.charCodeAt(0) || 0) % colors.length;
  const bgColor = colors[charCode];

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} text-white font-medium rounded-full flex items-center justify-center shadow-sm select-none border border-white/20 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
