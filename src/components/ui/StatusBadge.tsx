
import React from 'react';
import { cn } from '@/lib/utils';
import { DocumentStatus } from '@/store/useStore';

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig = {
  new: {
    label: 'New',
    bgColor: 'bg-status-new',
    textColor: 'text-white',
  },
  'in-progress': {
    label: 'In Progress',
    bgColor: 'bg-status-in-progress',
    textColor: 'text-white',
  },
  review: {
    label: 'Ready for CCA Review',
    bgColor: 'bg-status-review',
    textColor: 'text-white',
  },
  complete: {
    label: 'CCA Review Complete',
    bgColor: 'bg-status-complete',
    textColor: 'text-white',
  },
  'ai-process': {
    label: 'AI in Process',
    bgColor: 'bg-status-ai-process',
    textColor: 'text-white',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-block px-2 py-1 text-xs font-medium rounded-full',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
