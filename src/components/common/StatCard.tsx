import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={cn('p-2.5 rounded-lg bg-primary/10', iconColor.replace('text-', 'bg-').replace('primary', 'primary/10'))}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
      {change && (
        <p className={cn(
          'text-sm mt-2',
          changeType === 'positive' && 'text-success',
          changeType === 'negative' && 'text-destructive',
          changeType === 'neutral' && 'text-muted-foreground'
        )}>
          {change}
        </p>
      )}
    </div>
  );
}
