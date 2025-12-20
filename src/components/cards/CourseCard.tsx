import { BookOpen, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';

interface CourseCardProps {
  title: string;
  code: string;
  instructor: string;
  progress?: number;
  students?: number;
  schedule?: string;
  status?: 'active' | 'upcoming' | 'completed';
}

export function CourseCard({
  title,
  code,
  instructor,
  progress,
  students,
  schedule,
  status = 'active',
}: CourseCardProps) {
  const statusVariant = {
    active: 'success',
    upcoming: 'warning',
    completed: 'info',
  } as const;

  return (
    <div className="dashboard-card group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <Badge variant={statusVariant[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{code} • {instructor}</p>
      
      {progress !== undefined && (
        <div className="mb-4">
          <ProgressBar value={progress} showLabel size="sm" />
        </div>
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {students !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{students} students</span>
          </div>
        )}
        {schedule && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{schedule}</span>
          </div>
        )}
      </div>
    </div>
  );
}
