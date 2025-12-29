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
    <div className="dashboard-card group cursor-pointer p-4 sm:p-6 touch-active">
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <Badge variant={statusVariant[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-1">{code} • {instructor}</p>

      {progress !== undefined && (
        <div className="mb-3 sm:mb-4">
          <ProgressBar value={progress} showLabel size="sm" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        {students !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{students} students</span>
          </div>
        )}
        {schedule && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{schedule}</span>
          </div>
        )}
      </div>
    </div>
  );
}

