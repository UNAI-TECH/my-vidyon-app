import { AdminLayout } from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { InstitutionCard } from '@/components/cards/InstitutionCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Server,
  Shield,
  Plus,
  Activity,
  AlertTriangle,
} from 'lucide-react';

const systemMetrics = [
  { name: '00:00', value: 45 },
  { name: '04:00', value: 32 },
  { name: '08:00', value: 78 },
  { name: '12:00', value: 95 },
  { name: '16:00', value: 88 },
  { name: '20:00', value: 62 },
];

const userDistribution = [
  { name: 'Students', value: 12500 },
  { name: 'Faculty', value: 850 },
  { name: 'Institution Admins', value: 45 },
  { name: 'Super Admins', value: 5 },
];

// Indian Matriculation Schools
const institutions = [
  {
    id: 'RPC001',
    name: 'Revoor Padmanabha Chattys Matriculation School',
    code: 'RPC001',
    location: 'Chennai, Tamil Nadu',
    students: 1250,
    faculty: 68,
    status: 'active' as const,
    type: 'Matriculation',
    classes: 15,
    sections: 28
  },
  {
    id: 'TBM001',
    name: 'The Beloved Matriculation School',
    code: 'TBM001',
    location: 'Coimbatore, Tamil Nadu',
    students: 980,
    faculty: 52,
    status: 'active' as const,
    type: 'Matriculation',
    classes: 12,
    sections: 24
  },
  {
    id: 'VMS001',
    name: 'Venkateshwara Matriculation School',
    code: 'VMS001',
    location: 'Madurai, Tamil Nadu',
    students: 1450,
    faculty: 75,
    status: 'active' as const,
    type: 'Matriculation',
    classes: 15,
    sections: 30
  },
  {
    id: 'MMS001',
    name: 'Mercury Matriculation School',
    code: 'MMS001',
    location: 'Trichy, Tamil Nadu',
    students: 820,
    faculty: 45,
    status: 'active' as const,
    type: 'Matriculation',
    classes: 12,
    sections: 20
  },
  {
    id: 'RKM001',
    name: 'Radha Krishna Matriculation School',
    code: 'RKM001',
    location: 'Salem, Tamil Nadu',
    students: 1120,
    faculty: 58,
    status: 'active' as const,
    type: 'Matriculation',
    classes: 14,
    sections: 26
  },
];

const recentActivities = [
  { id: 1, action: 'New institution registered', user: 'System', entity: 'Radha Krishna Matriculation School', time: '2 hours ago', type: 'create' },
  { id: 2, action: 'User role updated', user: 'Admin', entity: 'principal@rpc.edu.in', time: '4 hours ago', type: 'update' },
  { id: 3, action: 'Database backup completed', user: 'System', entity: 'Full Backup', time: '6 hours ago', type: 'system' },
  { id: 4, action: 'Security policy updated', user: 'Super Admin', entity: 'Password Policy', time: '1 day ago', type: 'security' },
  { id: 5, action: 'API rate limit exceeded', user: 'RPC001', entity: 'Enrollment API', time: '1 day ago', type: 'warning' },
];

const systemAlerts = [
  { id: 1, message: 'High API usage detected for Revoor Padmanabha Chattys School', severity: 'warning', time: '1 hour ago' },
  { id: 2, message: 'Database storage reaching 80% capacity', severity: 'warning', time: '3 hours ago' },
  { id: 3, message: 'SSL certificate renewal due in 15 days', severity: 'info', time: '1 day ago' },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  const activityColumns = [
    { key: 'action', header: 'Action' },
    { key: 'user', header: 'Initiated By' },
    { key: 'entity', header: 'Entity' },
    { key: 'time', header: 'Time' },
    {
      key: 'type',
      header: 'Type',
      render: (item: typeof recentActivities[0]) => {
        const variants: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
          create: 'success',
          update: 'info',
          system: 'default',
          security: 'warning',
          warning: 'destructive' as 'warning',
        };
        return <Badge variant={variants[item.type] || 'default'}>{item.type}</Badge>;
      },
    },
  ];

  const handleAddInstitution = () => {
    navigate('/admin/add-institution');
  };

  const handleViewInstitution = (institutionId: string) => {
    navigate(`/admin/institutions/${institutionId}`);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage institutions and monitor platform-wide activities"
        actions={
          <Button
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center min-h-[44px]"
            onClick={handleAddInstitution}
          >
            <Plus className="w-4 h-4" />
            Add Institution
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="stats-grid mb-6 sm:mb-8">
        <StatCard
          title="Total Institutions"
          value={institutions.length}
          icon={Building2}
          iconColor="text-admin"
          change="All active"
        />
        <StatCard
          title="Total Students"
          value={institutions.reduce((sum, inst) => sum + inst.students, 0).toLocaleString()}
          icon={Users}
          iconColor="text-primary"
          change="+120 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Staff"
          value={institutions.reduce((sum, inst) => sum + inst.faculty, 0).toString()}
          icon={Users}
          iconColor="text-success"
          change="+15 this month"
          changeType="positive"
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={Server}
          iconColor="text-info"
          change="All systems operational"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 dashboard-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h3 className="font-semibold text-sm sm:text-base">System Load (Last 24 Hours)</h3>
          </div>
          <div className="chart-container-responsive">
            <AreaChart data={systemMetrics} color="hsl(var(--admin))" height={250} />
          </div>
        </div>
        <div className="dashboard-card p-4 sm:p-6">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">User Distribution</h3>
          <div className="chart-container-responsive">
            <DonutChart data={userDistribution} height={250} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="dashboard-card p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
          <h3 className="font-semibold text-sm sm:text-base">System Alerts</h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-0 ${alert.severity === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                <span className="text-xs sm:text-sm">{alert.message}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0 ml-4 sm:ml-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-semibold text-base sm:text-lg">Managed Institutions</h3>
          <a href="/admin/institutions" className="text-xs sm:text-sm text-primary hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {institutions.map((institution) => (
            <InstitutionCard
              key={institution.code}
              {...institution}
              onClick={() => handleViewInstitution(institution.id)}
            />
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="dashboard-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-semibold text-sm sm:text-base">Recent Activity</h3>
          <a href="/admin/monitoring" className="text-xs sm:text-sm text-primary hover:underline">View Logs</a>
        </div>
        <DataTable columns={activityColumns} data={recentActivities} mobileCardView />
      </div>
    </AdminLayout>
  );
}
