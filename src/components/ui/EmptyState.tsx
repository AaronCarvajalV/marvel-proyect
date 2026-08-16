import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <span className="material-symbols-outlined text-[48px] opacity-50">database</span>, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col justify-center items-center p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-lg gap-4">
      <div className="text-primary mb-2">
        {icon}
      </div>
      <h3 className="font-headline-lg-mobile text-on-surface m-0 tracking-tight">{title}</h3>
      <p className="font-metadata text-metadata text-outline max-w-[400px]">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};
