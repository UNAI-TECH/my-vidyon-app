import { FileText, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface AssignmentCardProps {
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  maxGrade?: string;
}

export function AssignmentCard({
  title,
  course,
  dueDate,
  status,
  grade,
  maxGrade,
}: AssignmentCardProps) {
  const statusConfig = {
    pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
    submitted: { variant: 'info' as const, icon: CheckCircle2, label: 'Submitted' },
    graded: { variant: 'success' as const, icon: CheckCircle2, label: 'Graded' },
    overdue: { variant: 'destructive' as const, icon: Clock, label: 'Overdue' },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="dashboard-card group cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-accent">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <Badge variant={config.variant} className="flex-shrink-0">
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{course}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Due: {dueDate}</span>
            </div>
            
            {status === 'graded' && grade && maxGrade && (
              <span className="text-sm font-medium text-success">
                {grade}/{maxGrade}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
