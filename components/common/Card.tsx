import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  titleAdornment?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, icon, className, titleAdornment }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in ${className}`}>
      <div className="p-4 bg-gray-900/40 border-b border-gray-700/50 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-blue-400">{icon}</span>}
          <h3 className="font-semibold text-gray-200">{title}</h3>
        </div>
        {titleAdornment}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};