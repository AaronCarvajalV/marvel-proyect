import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Iniciando enlace de datos...' }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] gap-4 text-primary">
      <span className="material-symbols-outlined text-[32px] animate-spin">autorenew</span>
      <span className="font-label-caps text-label-caps animate-pulse">{message}</span>
    </div>
  );
};
