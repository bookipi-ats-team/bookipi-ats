import type { JobStatus, ApplicationStage } from '../../types';

interface StatusBadgeProps {
  status: JobStatus | ApplicationStage;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; dotColor: string; bgColor: string }
> = {
  // Job statuses
  DRAFT: { label: 'Draft', dotColor: '#6B7280', bgColor: '#F3F4F6' },
  PUBLISHED: { label: 'Published', dotColor: '#16A34A', bgColor: '#E7F6EC' },
  PAUSED: { label: 'Paused', dotColor: '#F59E0B', bgColor: '#FEF3C7' },
  CLOSED: { label: 'Closed', dotColor: '#DC2626', bgColor: '#FDECEC' },
  
  // Application stages
  NEW: { label: 'New', dotColor: '#3B82F6', bgColor: '#E8F1FF' },
  SCREEN: { label: 'Screening', dotColor: '#8B5CF6', bgColor: '#F3E8FF' },
  INTERVIEW: { label: 'Interview', dotColor: '#F59E0B', bgColor: '#FEF3C7' },
  OFFER: { label: 'Offer', dotColor: '#10B981', bgColor: '#D1FAE5' },
  HIRED: { label: 'Hired', dotColor: '#16A34A', bgColor: '#E7F6EC' },
  REJECTED: { label: 'Rejected', dotColor: '#DC2626', bgColor: '#FDECEC' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.NEW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: config.bgColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dotColor }}
      ></span>
      {config.label}
    </span>
  );
};
