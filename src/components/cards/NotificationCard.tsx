import { Bell, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface NotificationCardProps {
  title: string;
  message: string;
  type?: NotificationType;
  time: string;
  read?: boolean;
  onDismiss?: () => void;
}

const typeConfig = {
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  error: { icon: Bell, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function NotificationCard({
  title,
  message,
  type = 'info',
  time,
  read = false,
  onDismiss,
}: NotificationCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-start gap-4 p-4 rounded-lg border border-border transition-colors',
      read ? 'bg-background' : 'bg-accent/30'
    )}>
      <div className={cn('p-2 rounded-lg', config.bg)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn('font-medium', read ? 'text-muted-foreground' : 'text-foreground')}>
            {title}
          </h4>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message}</p>
        <span className="text-xs text-muted-foreground mt-2 block">{time}</span>
      </div>
      
      {!read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </div>
  );
}
