import { Building2, Users, GraduationCap, MapPin, Layers, Eye, Edit, UserCog, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/ui/button';

interface InstitutionCardProps {
  id?: string;
  name: string;
  code: string;
  location: string;
  students: number;
  faculty: number;
  status: 'active' | 'pending' | 'suspended';
  type: string;
  classes?: number;
  sections?: number;
  onClick?: () => void;
}

export function InstitutionCard({
  id,
  name,
  code,
  location,
  students,
  faculty,
  status,
  type,
  classes,
  sections,
  onClick,
}: InstitutionCardProps) {
  const statusVariant = {
    active: 'success',
    pending: 'warning',
    suspended: 'destructive',
  } as const;

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();

    if (action === 'view' && onClick) {
      // Trigger the main onClick which navigates to detail page
      onClick();
    } else {
      console.log(`Quick action: ${action} for ${code}`);
      // Other actions will be implemented later
    }
  };

  return (
    <div
      className="dashboard-card group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <Badge variant={statusVariant[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground mb-1">{code}</p>
      <p className="text-xs text-muted-foreground mb-4">{type}</p>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <MapPin className="w-4 h-4" />
        <span className="line-clamp-1">{location}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 pb-4 border-t border-b border-border">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-info" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{students.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Students</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-success" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{faculty}</span>
            <span className="text-xs text-muted-foreground">Staff</span>
          </div>
        </div>
        {classes && sections && (
          <>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-warning" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{classes}</span>
                <span className="text-xs text-muted-foreground">Classes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{sections}</span>
                <span className="text-xs text-muted-foreground">Sections</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => handleQuickAction(e, 'view')}
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => handleQuickAction(e, 'edit')}
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => handleQuickAction(e, 'users')}
        >
          <UserCog className="w-3 h-3 mr-1" />
          Users
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => handleQuickAction(e, 'analytics')}
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analytics
        </Button>
      </div>
    </div>
  );
}
