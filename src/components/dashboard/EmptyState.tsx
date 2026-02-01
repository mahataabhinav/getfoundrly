import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#18181B] rounded-[32px] border border-white/5 min-h-[400px]">
      <div className="text-zinc-400 mb-6 opacity-60">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 mb-8 max-w-md text-lg leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
